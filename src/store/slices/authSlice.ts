import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, RegisterRequest, LoginRequest, AuthResponse } from '../../types/auth.types';
import { authService } from '../../services/authService';
import { showError } from './modalSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@funai_auth_state';

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true, // Start as true to wait for checkAuthStatus
    error: null,
};

// Application start auth check
export const checkAuthStatus = createAsyncThunk(
    'auth/checkStatus',
    async (_, { rejectWithValue }) => {
        try {
            const authStr = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
            if (authStr) {
                const parsed = JSON.parse(authStr);
                // Optionally verify token with backend here, or rely on interceptors
                return parsed;
            }
            return rejectWithValue('No auth state found');
        } catch (error) {
            return rejectWithValue('Failed to read auth state');
        }
    }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
    'auth/register',
    async (data: RegisterRequest, { dispatch, rejectWithValue }) => {
        try {
            const response = await authService.register(data);

            // Persist auth state
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
                user: response.user,
                token: response.token,
                refreshToken: response.refreshToken
            }));

            return response;
        } catch (error: any) {
            // Show error modal on failure
            dispatch(showError({
                title: 'Registration Failed',
                message: error.message || 'An unexpected error occurred during registration.',
            }));
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/login',
    async (data: LoginRequest, { dispatch, rejectWithValue }) => {
        try {
            const response = await authService.login(data);

            // Persist auth state
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
                user: response.user,
                token: response.token,
                refreshToken: response.refreshToken
            }));

            return response;
        } catch (error: any) {
            dispatch(showError({
                title: 'Login Failed',
                message: error.message || 'An unexpected error occurred during login.',
            }));
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.error = null;
            AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        },
        clearError: (state) => {
            state.error = null;
        },
        updateTokens: (state, action: PayloadAction<{ token: string, refreshToken: string }>) => {
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            if (state.user) {
                AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
                    user: state.user,
                    token: state.token,
                    refreshToken: state.refreshToken
                }));
            }
        }
    },
    extraReducers: (builder) => {
        // Register
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
            state.isLoading = false;
            state.isAuthenticated = true; // Auto-login after register if backend returns token
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Login
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Check Auth Status
        builder.addCase(checkAuthStatus.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(checkAuthStatus.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
        });
        builder.addCase(checkAuthStatus.rejected, (state) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.refreshToken = null;
        });
    },
});

export const { logout, clearError, updateTokens } = authSlice.actions;
export default authSlice.reducer;
