# PharmaFlow - Pharmacy Management System

PharmaFlow is a comprehensive pharmacy management system designed to streamline inventory tracking, sales processing, and supplier management for modern pharmacies. Built with a modern tech stack, it provides separate dashboards for administrators and sales clerks with role-based access control.

## 🏥 Features

### Admin Dashboard
- **Inventory Management**: Add, edit, and track pharmaceutical products with real-time stock updates
- **Supplier Management**: Maintain supplier information and track product-supplier relationships
- **User Management**: Create and manage pharmacy staff accounts with role assignments
- **Sales Reports**: Comprehensive sales analytics with visual charts and data exports
- **Expiry Tracking**: Monitor product expiration dates with automated alerts
- **Low Stock Alerts**: Automatic notifications when inventory falls below reorder levels

### Clerk Dashboard
- **Point of Sale (POS)**: Quick and efficient sales processing with barcode scanning support
- **Inventory View**: Real-time access to product information and stock levels
- **Transaction History**: View and manage sales transactions
- **Stock Alerts**: Immediate notifications for low stock and expiring products

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MySQL** database for data persistence
- **JWT** for authentication and session management
- **BCrypt** for password hashing
- RESTful API architecture

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for responsive UI design
- **Recharts** for data visualization
- **React Router** for navigation
- **Axios** for HTTP requests
- **Lucide React** for icons

## 📁 Project Structure

```
PharmaFlow/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── database/        # Database schema and scripts
│   ├── middleware/      # Authentication and validation middleware
│   ├── models/          # Data models
│   ├── routes/          # API route definitions
│   ├── scripts/         # Database initialization scripts
│   └── server.js        # Main server entry point
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React context providers
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   └── App.tsx      # Main application component
│   └── vite.config.ts   # Build configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL database
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd PharmaFlow
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```

4. **Database Configuration:**
   - Create a MySQL database
   - Update the `.env` file in the backend directory with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=pharmacy_db
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Initialize Database:**
   ```bash
   npm run init-db
   ```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm start
   ```

2. **Start the Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔐 Default Accounts

### Admin Account
- **Email**: admin@pharmacy.com
- **Password**: admin123

### Clerk Account
- **Email**: clerk@pharmacy.com
- **Password**: admin123

## 📊 Database Schema

The system includes the following key tables:
- `user_account`: Stores user information with role-based access
- `product`: Product inventory with pricing and stock levels
- `supplier`: Supplier information and contact details
- `sale`: Sales transactions with payment information
- `sale_item`: Individual items within sales transactions
- `low_stock_alert`: Automated alerts for low inventory
- `expiry_log`: Product expiration tracking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

-  Amogha & Pooja- Initial work

## 🙏 Acknowledgments

- Pharmacy management professionals for domain expertise
- Open-source community for the amazing tools and libraries