import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    cartCount = 0;

    constructor(
        public authService: AuthService,
        private cartService: CartService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.cartService.cart$.subscribe(items => {
            this.cartCount = this.cartService.count;
        });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/auth']);
    }
}