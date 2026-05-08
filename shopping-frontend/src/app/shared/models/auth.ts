export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
}

export interface SignupResponse {
    userId: number;
    username: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    username: string;
    role: number;
}

export interface User {
    userId?: number;
    username: string;
    email?: string;
    role: Role;
}