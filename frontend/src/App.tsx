import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useContext, lazy, Suspense } from "react"
import { AuthContext } from "./context/AuthContext"
import Login from "./pages/Login"
import LandingPage from "./pages/LandingPage.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"

// Lazy load admin pages for faster initial load
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"))
const AdminInventory = lazy(() => import("./pages/admin/Inventory.jsx"))
const AdminSuppliers = lazy(() => import("./pages/admin/Suppliers.jsx"))
const AdminReports = lazy(() => import("./pages/admin/Reports.jsx"))
const AdminSalesOverview = lazy(() => import("./pages/admin/SalesOverview.jsx"))
const AdminUsers = lazy(() => import("./pages/admin/Users.jsx"))
const AdminExpiryReports = lazy(() => import("./pages/admin/ExpiryReports.jsx"))

// Lazy load clerk pages for faster initial load
const ClerkDashboard = lazy(() => import("./pages/clerk/ClerkDashboard.jsx"))
const SalesPOS = lazy(() => import("./pages/clerk/SalesPOS.jsx"))
const InventoryView = lazy(() => import("./pages/clerk/InventoryView.jsx"))
const TransactionHistory = lazy(() => import("./pages/clerk/TransactionHistory.jsx"))

function App() {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-emerald-900 to-teal-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-emerald-200">Loading application...</p>
        </div>
      </div>
    )
  }

  // Role-based dashboard redirect
  const getDashboardPath = () => {
    if (!user) return "/login"
    return user.role === "admin" ? "/dashboard/admin" : "/dashboard/clerk"
  }

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-emerald-900 to-teal-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
        <p className="text-emerald-200">Loading content...</p>
      </div>
    </div>
  )

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={!user ? <LandingPage /> : <Navigate to={getDashboardPath()} />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to={getDashboardPath()} />} />
          
          {/* Admin Routes */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/inventory" element={
            <ProtectedRoute requiredRole="admin">
              <AdminInventory />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/suppliers" element={
            <ProtectedRoute requiredRole="admin">
              <AdminSuppliers />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/reports" element={
            <ProtectedRoute requiredRole="admin">
              <AdminReports />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/sales" element={
            <ProtectedRoute requiredRole="admin">
              <AdminSalesOverview />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/expiry-reports" element={
            <ProtectedRoute requiredRole="admin">
              <AdminExpiryReports />
            </ProtectedRoute>
          } />
          
          {/* Clerk Routes */}
          <Route path="/dashboard/clerk" element={
            <ProtectedRoute requiredRole="clerk">
              <ClerkDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/clerk/sales" element={
            <ProtectedRoute requiredRole="clerk">
              <SalesPOS />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/clerk/inventory" element={
            <ProtectedRoute requiredRole="clerk">
              <InventoryView />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/clerk/history" element={
            <ProtectedRoute requiredRole="clerk">
              <TransactionHistory />
            </ProtectedRoute>
          } />
          
          <Route path="/unauthorized" element={
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-emerald-900 to-teal-900">
              <div className="text-center p-8 bg-white/10 rounded-2xl border border-white/20 max-w-md backdrop-blur-xl">
                <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
                <p className="text-emerald-200 mb-6 text-lg">You don't have permission to access this page.</p>
                <button 
                  onClick={() => window.history.back()} 
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-colors font-medium"
                >
                  Go Back
                </button>
              </div>
            </div>
          } />
          <Route path="*" element={<Navigate to={user ? getDashboardPath() : "/"} />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App