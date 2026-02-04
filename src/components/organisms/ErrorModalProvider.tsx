import React, { useEffect, useState } from 'react';
import ErrorModal from '../molecules/ErrorModal';
import modalStore from '../../services/modalStore';
import { ErrorModalConfig } from '../../types/api.types';

/**
 * Global Error Modal Provider
 * This component should be placed at the root of your app
 * to display error modals from anywhere in the application
 */
const ErrorModalProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [modalConfig, setModalConfig] = useState<ErrorModalConfig>(
        modalStore.getConfig(),
    );

    useEffect(() => {
        // Subscribe to modal store changes
        const unsubscribe = modalStore.subscribe(config => {
            setModalConfig(config);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <>
            {children}
            <ErrorModal
                visible={modalConfig.visible}
                title={modalConfig.title}
                message={modalConfig.message}
                icon={modalConfig.icon}
                iconColor={modalConfig.iconColor}
                showCloseButton={modalConfig.showCloseButton}
                buttonText={modalConfig.buttonText}
                onClose={modalConfig.onClose}
                onButtonPress={modalConfig.onButtonPress}
            />
        </>
    );
};

export default ErrorModalProvider;
