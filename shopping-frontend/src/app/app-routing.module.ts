import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { ProductsComponent } from './user/products/products.component';
import { ProductDetailComponent } from './user/product-detail/product-detail.component';
import { CartComponent } from './user/cart/cart.component';
import { AuthGuard } from './shared/services/auth.guard';
import { UserHomeComponent } from './user/home/user-home.component';
import { OrderDetailComponent } from './user/order-detail/order-detail.component';
import { AdminHomeComponent } from './admin/home/admin-home.component';
import { ProductManagementComponent } from './admin/product-management/product-management.component';
import { OrderManagementComponent } from './admin/order-management/order-management.component';
import { ProductEditComponent } from './admin/product-edit/product-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER', 'ROLE_ADMIN'] }
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER', 'ROLE_ADMIN'] }
  },
  {
    path: 'user/home',
    component: UserHomeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'orders/:id',
    component: OrderDetailComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER', 'ROLE_ADMIN'] }
  },
  {
    path: 'admin/home',
    component: AdminHomeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'admin/products',
    component: ProductManagementComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'admin/product-management',
    redirectTo: 'admin/products',
    pathMatch: 'full'
  },
  {
    path: 'admin/products/:id/edit',
    component: ProductEditComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'admin/orders',
    component: OrderManagementComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'admin/order-management',
    redirectTo: 'admin/orders',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: 'auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
