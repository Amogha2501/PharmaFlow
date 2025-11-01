import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import { TrendingUp, Package, AlertCircle, Truck, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { mockData } from '../../services/mockData';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState({
    totalSales: 0,
    productsInStock: 0,
    lowStockAlerts: 0,
    suppliersCount: 0,
    expiryAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/reports/summary');
        // Get expiry alerts from mock data for now
        const expiryAlerts = mockData.getExpiryAlerts().filter(item => 
          item.status === 'expired' || item.status === 'critical' || item.status === 'warning'
        ).length;
        
        setSummary({
          ...response.data,
          expiryAlerts
        });
      } catch (error) {
        console.error('Error fetching summary data:', error);
        // Fallback to mock data in case of error
        const expiryAlerts = mockData.getExpiryAlerts().filter(item => 
          item.status === 'expired' || item.status === 'critical' || item.status === 'warning'
        ).length;
        
        setSummary({
          totalSales: 15420.50,
          productsInStock: 342,
          lowStockAlerts: 12,
          suppliersCount: 8,
          expiryAlerts
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

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
            {/* Welcome Message */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-emerald-900 mb-2">Admin Dashboard</h1>
              <p className="text-emerald-700">Welcome, Admin 👋 Manage your pharmacy system</p>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <DashboardCard
                title="Total Sales (Today)"
                value={`$${summary.totalSales.toFixed(2)}`}
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
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                    <div>
                      <p className="text-emerald-900 font-medium">Activity {i}</p>
                      <p className="text-emerald-700 text-sm">2 hours ago</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-700">Details</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;