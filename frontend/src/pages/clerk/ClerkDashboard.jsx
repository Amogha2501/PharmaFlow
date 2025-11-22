import React, { useState, useEffect } from 'react';
import SidebarClerk from '../../components/SidebarClerk';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import { Link } from 'react-router-dom';
import { TrendingUp, Receipt, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const ClerkDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState({
    todaysSales: 0,
    transactionsCount: 0,
    stockAlerts: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clerk summary data
        const summaryResponse = await api.get('/reports/clerk-summary');
        setSummary(summaryResponse.data);
        
        // Fetch recent transactions for this clerk
        const transactionsResponse = await api.get('/reports/clerk-recent-transactions');
        setRecentTransactions(transactionsResponse.data);
      } catch (error) {
        console.error('Error fetching clerk dashboard data:', error);
        // Fallback to default values in case of error
        setSummary({
          todaysSales: 0,
          transactionsCount: 0,
          stockAlerts: 0
        });
        setRecentTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        <SidebarClerk isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} role="clerk" pageTitle="Clerk Dashboard" />
          
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
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} role="clerk" pageTitle="Clerk Dashboard" />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {/* Welcome Message - Keeping this for the welcome text */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-emerald-900 mb-2">Clerk Dashboard</h1>
              <p className="text-emerald-700">Welcome, Clerk 👋 Manage sales and transactions</p>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link to="/dashboard/clerk/sales" className="block overflow-hidden">
                <DashboardCard
                  title="Today's Sales"
                  value={`₹${summary.todaysSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  icon={TrendingUp}
                  color="emerald"
                />
              </Link>
              <Link to="/dashboard/clerk/history" className="block overflow-hidden">
                <DashboardCard
                  title="Transactions"
                  value={summary.transactionsCount}
                  icon={Receipt}
                  color="blue"
                />
              </Link>
              <Link to="/dashboard/clerk/inventory" className="block overflow-hidden">
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
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <div key={transaction.sale_id} className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                      <div>
                        <p className="text-emerald-900 font-medium">Transaction #{transaction.sale_id}</p>
                        <p className="text-emerald-700 text-sm">{formatTimeAgo(transaction.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-700 font-semibold">₹{parseFloat(transaction.total_amount).toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-emerald-700">
                    No recent transactions found
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

export default ClerkDashboard;