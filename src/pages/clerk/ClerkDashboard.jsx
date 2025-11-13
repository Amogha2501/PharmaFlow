import React, { useState, useEffect } from 'react';
import SidebarClerk from '../../components/SidebarClerk';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import { TrendingUp, Receipt, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ClerkDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState({
    todaysSales: 0,
    transactionsCount: 0,
    stockAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/reports/clerk-summary');
        setSummary(response.data);
      } catch (error) {
        console.error('Error fetching clerk summary data:', error);
        // Fallback to mock data in case of error
        setSummary({
          todaysSales: 2450.75,
          transactionsCount: 42,
          stockAlerts: 3
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
        <SidebarClerk isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} role="clerk" />
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
      <SidebarClerk isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} role="clerk" />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {/* Welcome Message */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-emerald-900 mb-2">Clerk Dashboard</h1>
              <p className="text-emerald-700">Welcome, Clerk 👋 Manage sales and transactions</p>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link to="/dashboard/clerk/sales" className="block">
                <DashboardCard
                  title="Today's Sales"
                  value={`$${summary.todaysSales.toFixed(2)}`}
                  icon={TrendingUp}
                  color="emerald"
                />
              </Link>
              <Link to="/dashboard/clerk/history" className="block">
                <DashboardCard
                  title="Transactions"
                  value={summary.transactionsCount}
                  icon={Receipt}
                  color="blue"
                />
              </Link>
              <Link to="/dashboard/clerk/inventory" className="block">
                <DashboardCard
                  title="Stock Alerts"
                  value={summary.stockAlerts}
                  icon={AlertCircle}
                  color="orange"
                />
              </Link>
            </div>
            
            {/* Recent Transactions */}
            <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
              <h2 className="text-xl font-bold text-emerald-900 mb-6">Recent Transactions</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                    <div>
                      <p className="text-emerald-900 font-medium">Transaction #{1000 + i}</p>
                      <p className="text-emerald-700 text-sm">2 hours ago</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-700 font-semibold">${(Math.random() * 100 + 20).toFixed(2)}</p>
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

export default ClerkDashboard;