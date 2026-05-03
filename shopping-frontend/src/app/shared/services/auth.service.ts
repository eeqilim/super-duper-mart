import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { AuthResponse, LoginRequest, SignupRequest } from '../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly API = 'http://localhost:8081';
    private readonly TOKEN_KEY = 'jwt_token';
    private readonly USER_KEY = 'current_user';

    currentUser$ = new BehaviorSubject<User | null>(this.storedUser());

    constructor(private http: HttpClient, private router: Router) { }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API}/login`, request)
            .pipe(tap(response => this.store(response)));
    }

    signup(request: SignupRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API}/signup`, request)
            .pipe(tap(response => this.store(response)));
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUser$.next(null);
        this.router.navigate(['/auth']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getCurrentUser(): User | null {
        return this.currentUser$.value;
    }

    getUsername(): string | null {
        return this.currentUser$.value?.username ?? null;
    }

    getRole(): 'ROLE_USER' | 'ROLE_ADMIN' | null {
        return this.currentUser$.value?.role ?? null;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        return this.currentUser$.value?.role === 'ROLE_ADMIN';
    }

    private store(response: AuthResponse): void {
        const user: User = {
            username: response.username,
            role: response.role === 1 ? 'ROLE_ADMIN' : 'ROLE_USER'
        };
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUser$.next(user);
    }

    private storedUser(): User | null {
        const raw = localStorage.getItem(this.USER_KEY);

        if (!raw) return null;

        try {
            return JSON.parse(raw) as User;
        } catch {
            localStorage.removeItem(this.USER_KEY);
            return null;
        }
    }
}