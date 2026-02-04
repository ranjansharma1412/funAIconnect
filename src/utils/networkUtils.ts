import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { NetworkState } from '../types/api.types';
import { store } from '../store';
import { updateNetworkState } from '../store/slices/networkSlice';

/**
 * Check if device has internet connectivity
 * @returns Promise<boolean> - true if connected, false otherwise
 */
export const checkInternetConnection = async (): Promise<boolean> => {
    try {
        const state = await NetInfo.fetch();
        // Update Redux state
        store.dispatch(updateNetworkState({
            isConnected: state.isConnected ?? false,
            isInternetReachable: state.isInternetReachable,
            type: state.type,
        }));
        return state.isConnected === true && state.isInternetReachable !== false;
    } catch (error) {
        console.error('Error checking internet connection:', error);
        return false;
    }
};

/**
 * Get current network state
 * @returns Promise<NetworkState> - Current network state
 */
export const getNetworkState = async (): Promise<NetworkState> => {
    try {
        const state = await NetInfo.fetch();
        const networkState = {
            isConnected: state.isConnected ?? false,
            isInternetReachable: state.isInternetReachable,
            type: state.type,
        };

        // Update Redux state
        store.dispatch(updateNetworkState(networkState));

        return networkState;
    } catch (error) {
        console.error('Error getting network state:', error);
        return {
            isConnected: false,
            isInternetReachable: false,
            type: null,
        };
    }
};

/**
 * Subscribe to network state changes and sync with Redux
 */
export const startNetworkMonitoring = () => {
    return NetInfo.addEventListener((state: NetInfoState) => {
        store.dispatch(updateNetworkState({
            isConnected: state.isConnected ?? false,
            isInternetReachable: state.isInternetReachable,
            type: state.type,
        }));
    });
};

/**
 * Subscribe to network state changes (Legacy support)
 * @param callback - Function to call when network state changes
 */
export const subscribeToNetworkChanges = (
    callback: (state: NetInfoState) => void,
) => {
    return NetInfo.addEventListener(callback);
};
