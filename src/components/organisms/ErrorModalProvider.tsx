import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ErrorModal from '../molecules/ErrorModal';
import { RootState } from '../../store';
import { hideError } from '../../store/slices/modalSlice';

/**
 * Global Error Modal Provider
 * This component should be placed at the root of your app
 * to display error modals from anywhere in the application
 */
const ErrorModalProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const modalConfig = useSelector((state: RootState) => state.modal);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(hideError());
    };

    const handleButtonPress = () => {
        dispatch(hideError());
    };

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
                onClose={handleClose}
                onButtonPress={handleButtonPress}
            />
        </>
    );
};

export default ErrorModalProvider;
