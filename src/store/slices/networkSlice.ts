import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetInfoState } from '@react-native-community/netinfo';

interface NetworkState {
    isConnected: boolean;
    isInternetReachable: boolean | null;
    type: string | null;
}

const initialState: NetworkState = {
    isConnected: true,
    isInternetReachable: true,
    type: null,
};

const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {
        updateNetworkState: (state, action: PayloadAction<Partial<NetworkState>>) => {
            const { isConnected, isInternetReachable, type } = action.payload;
            if (isConnected !== undefined) state.isConnected = isConnected;
            if (isInternetReachable !== undefined) state.isInternetReachable = isInternetReachable;
            if (type !== undefined) state.type = type;
        },
    },
});

export const { updateNetworkState } = networkSlice.actions;
export default networkSlice.reducer;
