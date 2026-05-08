# Shopping Frontend

Angular frontend for a role-based shopping app. Customers can browse products, manage a cart/watchlist, place orders, and view order history. Admins can manage inventory and process orders.

## Tech Stack

- Angular 14
- TypeScript 4.7
- RxJS 7
- Angular Material 14

## Backend APIs

This app expects two local backend services:

| Service      | Base URL                | Used for                           |
| ------------ | ----------------------- | ---------------------------------- |
| Auth API     | `http://localhost:8081` | `/login`, `/signup`                |
| Shopping API | `http://localhost:8080` | products, orders, watchlist, stats |

JWT tokens are stored in `localStorage` as `jwt_token` and attached to requests by `JwtInterceptor`.

## Getting Started

Prerequisites:

- Node.js and npm
- Angular CLI 14, or the local CLI through `npm run ng`
- Backend services running on ports `8080` and `8081`

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm start
```

Open `http://localhost:4200/`. The app redirects to `/auth` by default.

Build:

```bash
npm run build
```

## Main Routes

| Route                      | Access     | Description                    |
| -------------------------- | ---------- | ------------------------------ |
| `/auth`                    | Public     | Login and signup.              |
| `/user/home`               | User       | Customer dashboard.            |
| `/products`                | User       | Product catalog and watchlist. |
| `/products/:id`            | User/Admin | Product detail page.           |
| `/cart`                    | User/Admin | Cart and checkout.             |
| `/orders/:id`              | User/Admin | Order detail page.             |
| `/admin/home`              | Admin      | Admin dashboard.               |
| `/admin/products`          | Admin      | Product management.            |
| `/admin/products/:id/edit` | Admin      | Edit product.                  |
| `/admin/orders`            | Admin      | Order management.              |

## How It Works

- `AppComponent` renders the shared navbar and the active route through `router-outlet`.
- `AuthComponent` handles login/signup and redirects users by role.
- `AuthGuard` protects routes using role metadata from `app-routing.module.ts`.
- `AuthService` stores the JWT and current user in `localStorage`.
- `JwtInterceptor` adds the JWT to outgoing HTTP requests.
- `ApiService` centralizes calls to products, orders, watchlist, and stats endpoints.
- `CartService` keeps cart state in `localStorage`, scoped by username.

## Components

```text
AppComponent
├── NavbarComponent
└── Routed pages
    ├── AuthComponent
    ├── UserHomeComponent
    ├── ProductsComponent
    ├── ProductDetailComponent
    ├── CartComponent
    ├── OrderDetailComponent
    ├── AdminHomeComponent
    ├── ProductManagementComponent
    │   └── ProductFormComponent
    ├── ProductEditComponent
    │   └── ProductFormComponent
    └── OrderManagementComponent
```

User-facing components:

- `UserHomeComponent`: order summary and purchase stats.
- `ProductsComponent`: product list, search, pagination, cart actions, and watchlist.
- `ProductDetailComponent`: single product view.
- `CartComponent`: cart quantities, totals, and checkout.
- `OrderDetailComponent`: order line items, total, and cancellation.

Admin-facing components:

- `AdminHomeComponent`: order metrics, popular/profitable products, and order actions.
- `ProductManagementComponent`: inventory table and create-product flow.
- `ProductFormComponent`: reusable create/edit product form.
- `ProductEditComponent`: loads one product and submits updates.
- `OrderManagementComponent`: order table with status filters and admin actions.

## Models

Files in `src/app/shared/models/` define TypeScript shapes for frontend/backend data.

- `auth.ts`: login, signup, current user, and role types.
- `product.ts`: product, admin product, create request, and update request.
- `cart.ts`: cart item and checkout request data.
- `order.ts`: order status, order item, user order, and admin order.
- `stats.ts`: dashboard statistics data.
- `watchlist-item.ts`: watchlist item shape.

## Project Structure

```text
src/app
├── admin/                 Admin dashboard, products, orders, product forms
├── auth/                  Login and signup UI
├── shared/
│   ├── models/            TypeScript interfaces for API data
│   ├── navbar/            Shared navigation component
│   └── services/          API, auth, cart, guard, and JWT interceptor services
└── user/                  User dashboard, products, product details, cart, orders
```

## Notes

- API base URLs are hardcoded in `auth.service.ts` and `api.service.ts`.
- User session data is stored as `current_user`.
- Cart data is stored as `shopping_cart_<username>` or `shopping_cart_guest`.
- `dist/` contains a built artifact; regenerate it with `npm run build`.
