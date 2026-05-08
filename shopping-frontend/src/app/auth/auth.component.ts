import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { LoginRequest, SignupRequest } from '../shared/models/auth';
import { CartService } from '../shared/services/cart.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
    isLoginMode = true;
    errorMessage = '';
    loading = false;

    loginData: LoginRequest = {
        username: '',
        password: ''
    };

    signupData: SignupRequest = {
        username: '',
        password: '',
        email: ''
    };

    constructor(
        private authService: AuthService,
        private cartService: CartService,
        private router: Router
    ) { }

    toggleMode(): void {
        this.isLoginMode = !this.isLoginMode;
        this.errorMessage = '';
    }

    login(): void {
        this.loading = true;
        this.errorMessage = '';

        this.authService.login(this.loginData).subscribe({
            next: () => {
                this.loading = false;

                if (this.authService.isAdmin()) {
                    this.router.navigate(['/admin/home']);
                } else {
                    this.router.navigate(['/user/home']);
                }
            },
            error: () => {
                this.loading = false;
                this.errorMessage = 'Invalid username or password';
            }
        });
    }

    signup(): void {
        this.loading = true;
        this.errorMessage = '';
        this.authService.signup(this.signupData).subscribe({
            next: () => {
                this.authService.login({
                    username: this.signupData.username,
                    password: this.signupData.password
                }).subscribe({
                    next: () => {
                        this.loading = false;
                        this.cartService.clearCart();
                        this.router.navigate(['/user/home']);
                    },
                    error: () => {
                        this.loading = false;
                        this.isLoginMode = true;
                    }
                });
            },
            error: () => {
                this.loading = false;
                this.errorMessage = 'Registration failed. Username or email may already exist.';
            }
        });
    }
}
