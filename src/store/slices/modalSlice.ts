import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ErrorModalState {
    visible: boolean;
    title: string;
    message: string;
    icon?: string;
    iconColor?: string;
    showCloseButton?: boolean;
    buttonText?: string;
}

const initialState: ErrorModalState = {
    visible: false,
    title: '',
    message: '',
    icon: 'alert-circle-outline',
    iconColor: '#FF6B6B',
    showCloseButton: true,
    buttonText: 'Okay',
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        showError: (state, action: PayloadAction<Partial<ErrorModalState>>) => {
            // Merge initial state to reset default values for optional properties
            const newState = { ...initialState, ...action.payload, visible: true };
            return newState;
        },
        hideError: (state) => {
            state.visible = false;
        },
        updateModal: (state, action: PayloadAction<Partial<ErrorModalState>>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { showError, hideError, updateModal } = modalSlice.actions;
export default modalSlice.reducer;
