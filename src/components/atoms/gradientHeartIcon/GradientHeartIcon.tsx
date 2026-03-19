import React from 'react';
import { View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface GradientHeartIconProps {
    size: number;
}

const GradientHeartIcon: React.FC<GradientHeartIconProps> = ({ size }) => {
    return (
        <MaskedView
            style={{ width: size, height: size }}
            maskElement={
                <View
                    style={{
                        backgroundColor: 'transparent',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Ionicons name="heart" size={size} color="white" />
                </View>
            }
        >
            <LinearGradient
                colors={['#FF8C00', '#8B0000']} // Orange to Dark Red
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            />
        </MaskedView>
    );
};

export default GradientHeartIcon;
