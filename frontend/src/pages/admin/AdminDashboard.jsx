import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import { TrendingUp, Package, AlertCircle, Truck, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState({
    totalSales: 0,
    productsInStock: 0,
    lowStockAlerts: 0,
    suppliersCount: 0,
    expiryAlerts: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch real summary data
        const summaryResponse = await api.get('/reports/summary');
        
        setSummary({
          totalSales: summaryResponse.data.totalSales,
          productsInStock: summaryResponse.data.productsInStock,
          lowStockAlerts: summaryResponse.data.lowStockAlerts,
          suppliersCount: summaryResponse.data.suppliersCount,
          expiryAlerts: summaryResponse.data.expiryAlerts
        });
        
        // Fetch recent activities
        const activitiesResponse = await api.get('/reports/recent-activities');
        setActivities(activitiesResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to default values in case of error
        setSummary({
          totalSales: 0,
          productsInStock: 0,
          lowStockAlerts: 0,
          suppliersCount: 0,
          expiryAlerts: 0
        });
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    // Handler for sale created event
    const handleSaleCreated = () => {
      // Refresh data immediately when a sale is created
      fetchData();
    };

    fetchData();
    
    // Set up interval to refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    
    // Listen for sale created events
    window.addEventListener('saleCreated', handleSaleCreated);
    
    // Clean up interval and event listener on component unmount
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('saleCreated', handleSaleCreated);
    };
  }, []);

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-emerald-50">
        <SidebarAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} role="admin" />
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6 lg:p-8">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                  <p className="text-emerald-700">Loading dashboard data...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-emerald-50">
      <SidebarAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} role="admin" />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {/* Welcome Message - Keeping this for the welcome text */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-emerald-900 mb-2">Admin Dashboard</h1>
              <p className="text-emerald-700">Welcome, Admin 👋 Manage your pharmacy system</p>
            </div>
            
            {/* Summary Cards */}
            <div className="flex flex-wrap justify-center gap-6 lg:gap-8 mb-8 min-h-150px">
              <DashboardCard
                title="Total Sales (Today)"
                value={`₹${summary.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={TrendingUp}
                color="emerald"
              />
              <DashboardCard
                title="Products in Stock"
                value={summary.productsInStock}
                icon={Package}
                color="blue"
              />
              <DashboardCard
                title="Low Stock Alerts"
                value={summary.lowStockAlerts}
                icon={AlertCircle}
                color="orange"
              />
              <DashboardCard
                title="Expiry Alerts"
                value={summary.expiryAlerts}
                icon={Calendar}
                color="red"
              />
              <DashboardCard
                title="Active Suppliers"
                value={summary.suppliersCount}
                icon={Truck}
                color="purple"
              />
            </div>
            
            {/* Action Button */}
            <div className="mb-8">
              <Link 
                to="/dashboard/admin/reports"
                className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
              >
                View Detailed Reports
              </Link>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
              <h2 className="text-xl font-bold text-emerald-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.sale_id} className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                      <div>
                        <p className="text-emerald-900 font-medium">Sale #{activity.sale_id}</p>
                        <p className="text-emerald-700 text-sm">By {activity.clerk_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-900 font-semibold">₹{parseFloat(activity.total_amount).toFixed(2)}</p>
                        <p className="text-emerald-700 text-sm">{formatTimeAgo(activity.created_at)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-emerald-700">
                    No recent activities found
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;