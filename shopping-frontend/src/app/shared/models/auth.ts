import { User } from "./user";

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