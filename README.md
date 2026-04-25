# Car Rental System — Angular Frontend

A modern, responsive Car Rental System frontend built with Angular, featuring role-based access for Admins and Customers.

## Features

- **Admin Dashboard:** Full CRUD operations for Users, Cars, and Orders.
- **Customer Portal:** Car browsing, order creation, and installment management.
- **Role-Based Access Control:** Secure routes with guards for Guests, Admins, and Customers.
- **Theming:** Full Dark Mode support with persistence.
- **Localization:** Multi-language support (English & Arabic) with RTL support.
- **Responsive Design:** Optimized for both desktop and mobile devices.
- **State Management:** Reactive approach using RxJS.

## Project Structure

```
src/app/
├── core/                   # Global singletons
│   ├── interceptors/       # HTTP Interceptors (Auth, Error)
│   ├── guards/             # Route Guards (Admin, Customer, Guest)
│   ├── services/           # Core Services (Auth, Theme, Translate)
│   └── models/             # Shared Interfaces
├── features/               # Feature-based modules
│   ├── admin/              # Admin Dashboard features
│   ├── customer/           # Customer portal features
│   └── auth/               # Shared Authentication (Login/Register)
├── shared/                 # Shared UI components & utilities
│   ├── components/         # Reusable UI (Table, Spinner, Toast)
│   ├── pipes/              # Custom pipes (Translate)
│   └── directives/         # Custom directives
└── i18n/                   # Translation JSON files (EN, AR)
```

## Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd car
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`.

### Building for Production

```bash
npm run build
```
The build artifacts will be stored in the `dist/` directory.

## Core Implementations

### Dark Mode Toggle
The `ThemeService` manages the application's visual theme. It toggles a `.dark` class on the `<html>` element and persists the choice in `localStorage`. The application uses CSS Variables (defined in `styles.css` or component styles) to switch colors dynamically based on the presence of the `.dark` class.

### Language Switch (i18n)
The `TranslateService` handles localization. It supports English (LTR) and Arabic (RTL). When the language is switched:
- The `lang` attribute of `<html>` is updated.
- The `dir` attribute of `<html>` is updated (`ltr` or `rtl`).
- The corresponding JSON translation file is loaded.
- The preference is persisted in `localStorage`.

## Routing & Guards

- **GuestGuard:** Prevents logged-in users from accessing login/register pages.
- **AdminGuard:** Ensures only users with the `admin` role can access `/admin/**` routes.
- **CustomerGuard:** Ensures only users with the `customer` role can access customer-specific routes.

## API Integration

The system communicates with a REST API defined in `environment.ts`. An `AuthInterceptor` automatically attaches the Bearer Token to all outgoing requests.
