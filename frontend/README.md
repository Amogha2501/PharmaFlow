# Pharmacy Inventory and Sales System - Frontend

A complete React frontend for a database-driven Pharmacy Inventory and Sales System.

## Features

- **Authentication & Role-Based Access**
  - Login page for Admin and Sales Clerk
  - Role-based dashboard routing
  - JWT token management

- **Core Pages**
  - Dashboard with summary cards
  - Inventory management with CRUD operations
  - Suppliers management
  - Point of Sale (POS) system
  - Reports with charts and analytics

## Tech Stack

- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Recharts for data visualization
- Lucide React for icons

## Folder Structure

```
src/
├── components/
│   ├── DashboardCard.tsx
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── ProductForm.tsx
│   ├── SupplierForm.tsx
│   └── SalesForm.tsx
├── context/
│   └── AuthContext.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Inventory.tsx
│   ├── Suppliers.tsx
│   ├── Sales.tsx
│   └── Reports.tsx
├── services/
│   ├── api.js
│   ├── productService.js
│   ├── supplierService.js
│   ├── salesService.js
│   └── reportService.js
├── App.tsx
├── main.tsx
└── index.css
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the frontend root with:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Routing

- `/login` - Login Page
- `/dashboard` - Admin Dashboard
- `/inventory` - Inventory Management
- `/suppliers` - Suppliers Management
- `/sales` - Point of Sale
- `/reports` - Analytics and Reports

## Role-Based Access

- **Admin**: Full access to all features
- **Sales Clerk**: Access to Sales and Reports only

## API Integration

The frontend connects to a Node.js backend at `http://localhost:5000/api` by default.
JWT tokens are stored in localStorage for authentication.

## Development

This project uses:
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling