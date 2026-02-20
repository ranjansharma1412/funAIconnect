import { Alert, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import RNShare from 'react-native-share';

export interface ShareContent {
    message: string;
    url?: string;
    title?: string; // Android only
}

export const sharePost = async (content: ShareContent) => {
    try {
        let imageUrl = content.url;
        let localFileUrl = '';

        if (imageUrl && imageUrl.startsWith('http')) {
            // Download the image to a temporary path
            const extension = imageUrl.split('.').pop() || 'jpg';
            const fileName = `post_image_${Date.now()}.${extension}`;
            const localPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

            const response = await RNFS.downloadFile({
                fromUrl: imageUrl,
                toFile: localPath,
            }).promise;

            if (response.statusCode === 200) {
                // For RNShare, the url needs to be a file:// URI
                localFileUrl = `file://${localPath}`;
            }
        }

        const shareOptions: any = {
            message: content.message,
            title: content.title || 'Share Post', // Android
            subject: content.title, // iOS email
        };

        if (localFileUrl) {
            shareOptions.url = localFileUrl;
        } else if (imageUrl) {
            shareOptions.url = imageUrl;
        }

        const result = await RNShare.open(shareOptions);
        console.log('Shared successfully:', result);

        // Clean up the downloaded file
        if (localFileUrl) {
            RNFS.unlink(localFileUrl.replace('file://', '')).catch(console.error);
        }

    } catch (error: any) {
        if (error.message !== 'User did not share') { // RNShare throws this on dismissal sometimes
            console.log('Share dismissed or error:', error.message);
        } else {
            console.log('Share dismissed');
        }
    }
};
