export interface User {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    token?: string;
    gender?: string;
}

export interface RegisterRequest {
    name: string;
    username: string;
    email: string;
    password: string;
    gender?: string;
}

export interface LoginRequest {
    email?: string;
    username?: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
    message?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
