# Car Rental System — Angular Frontend

## Project Overview

A Car Rental System frontend built with Angular, consisting of an Admin Dashboard and a Customer Frontend.

- **API Base URL:** `https://task.abudiyab-soft.com/api`
- **Auth:** Bearer Token — attach to all protected requests via HTTP Interceptor

---

## Master Plan — 6 Phases

### Phase 1 — Project Setup & Core Architecture (~2–3h)

- Create Angular project with standalone components and routing
- Establish folder structure: `core / features / shared`
- HTTP Interceptors: auth token injection + global error handler
- Route Guards: guest / customer / admin role-based access
- Environment files with API base URL
- i18n setup: English + Arabic with RTL support
- Dark mode setup using CSS class toggle and CSS variables

### Phase 2 — Authentication (~1–2h)

- Login page with Reactive Form and inline validation
- Register page with Reactive Form and inline validation
- Auth service: `login` / `register` / `logout` / `me`
- Token storage and auto-redirect after login/logout
- Backend validation errors displayed inline under fields

### Phase 3 — Admin Dashboard (~4–5h)

- Admin layout with sidebar navigation
- **Users:** full CRUD — list, create, edit, delete with filters
- **Cars:** full CRUD — list, create, edit, delete with filters
- **Orders:** list with filters + view details + update payment status + delete
- Reusable table component with server-side pagination and search
- Confirm dialog component for destructive actions (delete)

### Phase 4 — Customer Frontend (~4–5h)

- Customer layout with top navbar
- Cars listing with search, filters, and server-side pagination
- Car details page
- Create order flow: select dates → auto-calculated days & price → choose payment type + order type
- My orders: list + order details
- Installments: list + pay installment action

### Phase 5 — UX Polish & Error Handling (~2h)

- Loading spinners and skeleton screens on all data-fetching views
- Empty state components: "no data available" and "no results found"
- Global error handling surfaced from the HTTP interceptor
- Toast / snackbar notification system
- Responsive design for mobile and desktop
- Form UX: disable submit button when form is invalid

### Phase 6 — Final Touches & README (~1h)

- Review all routing guards and verify redirects
- Write `README.md`: setup steps, folder structure, dark mode toggle, language switch
- Clean git history with meaningful commit messages per feature
- Apply lazy loading to feature modules (bonus)

---

## Folder Structure

```
src/app/
├── core/
│   ├── interceptors/       # auth-token.interceptor, error.interceptor
│   ├── guards/             # auth.guard, role.guard
│   ├── services/           # auth.service
│   └── models/             # interfaces (ICar, IOrder, IUser ...)
├── features/
│   ├── admin/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── users/
│   │   ├── cars/
│   │   └── orders/
│   ├── customer/
│   │   ├── cars/
│   │   ├── orders/
│   │   └── installments/
│   └── auth/
│       ├── login/
│       └── register/
├── shared/
│   ├── components/         # table, spinner, empty-state, toast, confirm-dialog
│   ├── pipes/              # translate, currency
│   └── directives/
└── i18n/
    ├── en.json
    └── ar.json
```

---

## Routing Structure

| Scope    | Path                    | Guard         |
|----------|-------------------------|---------------|
| Public   | `/login`                | GuestGuard    |
| Public   | `/register`             | GuestGuard    |
| Public   | `/admin/login`          | GuestGuard    |
| Public   | `/admin/register`       | GuestGuard    |
| Admin    | `/admin/users`          | AdminGuard    |
| Admin    | `/admin/cars`           | AdminGuard    |
| Admin    | `/admin/orders`         | AdminGuard    |
| Customer | `/cars`                 | CustomerGuard |
| Customer | `/cars/:id`             | CustomerGuard |
| Customer | `/orders`               | CustomerGuard |
| Customer | `/orders/:id`           | CustomerGuard |
| Customer | `/installments`         | CustomerGuard |

---

## Coding Rules

### General

- **No comments anywhere in the code.** Code must be self-explanatory through naming alone.
- **No inline comments, no block comments, no JSDoc.** Zero exceptions.
- Every variable, method, property, and class name must clearly reflect the component or feature it belongs to.

### Naming Examples

| Bad | Good |
|-----|------|
| `comp` | `CarListComponent` |
| `service` | `OrderService` |
| `status` | `orderPaymentStatus` |
| `data` | `carDetails` |
| `list` | `userList` |
| `res` | `createOrderResponse` |
| `fn` | `fetchInstallments` |

### Naming Conventions

- **Components:** `PascalCase` — e.g. `CarDetailsComponent`
- **Services / files:** `kebab-case` — e.g. `car-details.service.ts`
- **Variables / methods:** `camelCase` — e.g. `fetchCarDetails()`
- **Constants:** `UPPER_SNAKE_CASE` — e.g. `API_BASE_URL`
- **Interfaces:** prefix `I` — e.g. `ICar`, `IOrder`, `IUser`

### Architecture

- All HTTP calls live inside services only — components never call HTTP directly.
- Shared components must not be coupled to any specific feature.
- Each feature lives in its own isolated folder under `features/`.
- Use **Reactive Forms only** — no template-driven forms.
- Services are injected via constructor, not via `inject()` at the top level (keep it consistent).

### Forms

- Show inline validation messages below each field.
- Disable the submit button when the form is invalid.
- Display backend validation errors inline under the relevant field.
- Show a loading state on the submit button during API calls.

### Tables & Lists

- Pagination is server-side — never filter or paginate on the client.
- Filters and search are server-side — pass query params to the API.
- Search inputs must use `debounceTime` to avoid excessive API calls.
- Show a skeleton loader while data is being fetched.
- Show an empty state component when the result set is empty.

### HTTP Interceptors

- `AuthInterceptor` — attaches `Authorization: Bearer <token>` to all protected requests.
- `ErrorInterceptor` — handles 401 (redirect to login), 422 (pass validation errors to form), 500 (show global toast).

### Git Commits

- One commit per feature or logical unit — not per file.
- Use conventional commit format: `feat:`, `fix:`, `refactor:`, `chore:`
- Example: `feat: add car list with server-side pagination`
- Never commit broken or non-compiling code.

---

## API Reference

### Admin — Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/register` | Register new admin |
| POST | `/admin/login` | Admin login |
| GET | `/admin/me` | Get current admin |
| POST | `/admin/logout` | Logout |

### Customer — Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/customer/register` | Register new customer |
| POST | `/customer/login` | Customer login |
| POST | `/customer/logout` | Logout |
| GET | `/customer/me` | Get current user |

### Admin — Cars

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/cars` | List cars (search, brand, min_price, max_price, per_page) |
| POST | `/admin/cars` | Create car |
| GET | `/admin/cars/:id` | Get car |
| PUT | `/admin/cars/:id` | Update car |
| DELETE | `/admin/cars/:id` | Delete car |

### Admin — Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List users (search, role, country, per_page) |
| GET | `/admin/users/:id` | Get user details |
| POST | `/admin/users` | Create user |
| PUT | `/admin/users/:id` | Update user |
| DELETE | `/admin/users/:id` | Delete user |

### Admin — Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/orders` | List orders (search, user_id, car_id, payment_type, payment_status, order_type, per_page) |
| GET | `/admin/orders/:id` | Get order details |
| PUT | `/admin/orders/:id` | Update payment status |
| DELETE | `/admin/orders/:id` | Delete order |

### Customer — Cars

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer/cars` | List cars (search, brand, min_price, max_price, per_page) |
| GET | `/customer/cars/:id` | Get car details |

### Customer — Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer/orders` | List my orders (per_page) |
| POST | `/customer/orders` | Create order (full, cash, or installments) |
| GET | `/customer/orders/:id` | Get order details |

### Customer — Installments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer/installments` | List my installments (per_page) |
| POST | `/customer/installments/:id/pay` | Pay an installment |

---

## Key Business Rules

- Payment is simulated via API only — no real payment gateway integration.
- Days, total price, payment status, and installments are all calculated server-side — display only, never compute on the frontend.
- Order type can be `full` or `installments`.
- Payment type can be `cash`, `visa`, or `tamara`.

---

## Mandatory UI/UX Requirements

- Responsive design — mobile and desktop.
- Clean, modern UI.
- Loading indicators on every async operation (spinners or skeletons).
- Error handling: validation errors inline, network errors via toast.
- Empty states for no data and no results.
- Dark mode toggle (light / dark theme).
- Multi-language support: English and Arabic (with RTL for Arabic).

---

## Bonus (Optional)

- Lazy loading for feature modules
- Shared UI component library
- Unit tests
- Deployment to Netlify / Vercel / Firebase
- State management with NgRx
