import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { NetworkState } from '../types/api.types';

/**
 * Check if device has internet connectivity
 * @returns Promise<boolean> - true if connected, false otherwise
 */
export const checkInternetConnection = async (): Promise<boolean> => {
    try {
        const state = await NetInfo.fetch();
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
        return {
            isConnected: state.isConnected ?? false,
            isInternetReachable: state.isInternetReachable,
            type: state.type,
        };
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
 * Subscribe to network state changes
 * @param callback - Function to call when network state changes
 * @returns Unsubscribe function
 */
export const subscribeToNetworkChanges = (
    callback: (state: NetInfoState) => void,
) => {
    return NetInfo.addEventListener(callback);
};
