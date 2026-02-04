import { ErrorModalConfig } from '../types/api.types';

/**
 * Modal Store - Singleton to manage error modal state globally
 */
class ModalStore {
    private static instance: ModalStore;
    private modalConfig: ErrorModalConfig = {
        visible: false,
        title: '',
        message: '',
        icon: 'alert-circle-outline',
        iconColor: '#FF6B6B',
        showCloseButton: true,
        buttonText: 'Okay',
    };
    private listeners: Array<(config: ErrorModalConfig) => void> = [];

    private constructor() { }

    static getInstance(): ModalStore {
        if (!ModalStore.instance) {
            ModalStore.instance = new ModalStore();
        }
        return ModalStore.instance;
    }

    /**
     * Subscribe to modal state changes
     */
    subscribe(listener: (config: ErrorModalConfig) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Notify all listeners of state change
     */
    private notify() {
        this.listeners.forEach(listener => listener(this.modalConfig));
    }

    /**
     * Show error modal
     */
    showError(config: Partial<ErrorModalConfig>) {
        this.modalConfig = {
            ...this.modalConfig,
            ...config,
            visible: true,
        };
        this.notify();
    }

    /**
     * Hide error modal
     */
    hideError() {
        this.modalConfig = {
            ...this.modalConfig,
            visible: false,
        };
        this.notify();
    }

    /**
     * Get current modal config
     */
    getConfig(): ErrorModalConfig {
        return this.modalConfig;
    }
}

export default ModalStore.getInstance();
