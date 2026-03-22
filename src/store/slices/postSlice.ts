import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../services/postService';

interface PostState {
    myPosts: Post[];
    dashboardPosts: Post[];
}

const initialState: PostState = {
    myPosts: [],
    dashboardPosts: [],
};

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setMyPosts(state, action: PayloadAction<Post[]>) {
            state.myPosts = action.payload;
        },
        setDashboardPosts(state, action: PayloadAction<Post[]>) {
            state.dashboardPosts = action.payload;
        },
        appendDashboardPosts(state, action: PayloadAction<Post[]>) {
            state.dashboardPosts = [...state.dashboardPosts, ...action.payload];
        },
        updatePost(state, action: PayloadAction<Partial<Post> & { id: number }>) {
            const indexMyPosts = state.myPosts.findIndex((p) => p.id === action.payload.id);
            if (indexMyPosts !== -1) {
                state.myPosts[indexMyPosts] = { ...state.myPosts[indexMyPosts], ...action.payload };
            }

            const indexDashboard = state.dashboardPosts.findIndex((p) => p.id === action.payload.id);
            if (indexDashboard !== -1) {
                state.dashboardPosts[indexDashboard] = { ...state.dashboardPosts[indexDashboard], ...action.payload };
            }
        },
    },
});

export const { setMyPosts, setDashboardPosts, appendDashboardPosts, updatePost } = postSlice.actions;

export default postSlice.reducer;
