import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from './shared/services/jwt.interceptor';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthComponent } from './auth/auth.component';
import { ProductsComponent } from './user/products/products.component';
import { ProductDetailComponent } from './user/product-detail/product-detail.component';
import { CartComponent } from './user/cart/cart.component';
import { UserHomeComponent } from './user/home/user-home.component';
import { OrderDetailComponent } from './user/order-detail/order-detail.component';
import { AdminHomeComponent } from './admin/home/admin-home.component';
import { ProductManagementComponent } from './admin/product-management/product-management.component';
import { OrderManagementComponent } from './admin/order-management/order-management.component';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { ProductEditComponent } from './admin/product-edit/product-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AuthComponent,
    ProductsComponent,
    ProductDetailComponent,
    CartComponent,
    UserHomeComponent,
    OrderDetailComponent,
    AdminHomeComponent,
    ProductManagementComponent,
    OrderManagementComponent,
    ProductFormComponent,
    ProductEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
