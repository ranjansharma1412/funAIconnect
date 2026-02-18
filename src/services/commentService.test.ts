import { commentService } from './commentService';
import { apiClient } from './apiClient';

jest.mock('./apiClient');

describe('commentService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call apiClient.post with the correct arguments including userId', async () => {
        const postId = 1;
        const content = 'Test comment';
        const userId = 123;
        const mockResponse = { data: { id: 1, content, userId, postId } };

        (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

        const result = await commentService.addComment(postId, content, userId);

        expect(apiClient.post).toHaveBeenCalledWith(`/api/posts/${postId}/comments`, { content, userId });
        expect(result).toEqual(mockResponse.data);
    });
});
