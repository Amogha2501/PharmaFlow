import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import Navbar from '../../components/Navbar';
import { Users, Plus, Edit, Trash2, Key } from 'lucide-react';
import api from '../../services/api';

const UsersManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'clerk',
    password: ''
  });

  // Mock data for users
  // const mockUsers = [
  //   { id: 1, name: 'John Smith', email: 'john@pharmacy.com', role: 'clerk', status: 'Active' },
  //   { id: 2, name: 'Sarah Johnson', email: 'sarah@pharmacy.com', role: 'clerk', status: 'Active' },
  //   { id: 3, name: 'Mike Davis', email: 'mike@pharmacy.com', role: 'clerk', status: 'Inactive' },
  // ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'clerk',
      password: ''
    });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: ''
    });
    setShowModal(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        // Fetch updated user list to ensure consistency
        await fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await api.patch(`/users/${id}/toggle-status`);
      // Fetch updated user list to ensure consistency
      await fetchUsers();
      alert(response.data.message);
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Failed to toggle user status: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (currentUser) {
        // Update existing user (requires authentication)
        response = await api.put(`/users/${currentUser.id}`, formData);
        // Fetch updated user list to ensure consistency
        await fetchUsers();
      } else {
        // Create new user (requires authentication as admin)
        response = await api.post('/users', formData);
        // Fetch updated user list to ensure consistency
        await fetchUsers();
      }
      
      setShowModal(false);
    } catch (error) {
      console.error('Error saving user:', error);
      // Don't add user to state if there was an error
      alert('Failed to save user: ' + (error.response?.data?.message || error.message));
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
                  <p className="text-emerald-700">Loading users data...</p>
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-emerald-900 mb-2">Users Management</h1>
              <p className="text-emerald-700">Manage pharmacy staff and their access permissions</p>
            </div>
            
            {/* Add User Button */}
            <div className="mb-6">
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New User
              </button>
            </div>
            
            {/* Users Table */}
            <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
              <h2 className="text-xl font-bold text-emerald-900 mb-6">Staff Members</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-emerald-50 border-b border-emerald-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-emerald-50 transition-all duration-200">
                          <td className="px-6 py-4 text-emerald-900 font-medium">{user.name}</td>
                          <td className="px-6 py-4 text-emerald-700">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleEditUser(user)}
                                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                              <button 
                                onClick={() => handleToggleStatus(user.id)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center ${
                                  user.status === 'active' 
                                    ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                                    : 'bg-green-100 hover:bg-green-200 text-green-700'
                                }`}
                              >
                                {user.status === 'active' ? 'Deactivate' : 'Activate'}
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors flex items-center"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-emerald-700">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* User Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-emerald-700/50">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {currentUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-emerald-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-100 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-emerald-700/50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-emerald-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-emerald-100 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-emerald-700/50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-emerald-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-emerald-100 mb-1">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-emerald-700/50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-emerald-200"
                      required
                    >
                      <option value="clerk" className="bg-emerald-800">Sales Clerk</option>
                      <option value="admin" className="bg-emerald-800">Administrator</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-emerald-100 mb-1">
                      {currentUser ? 'New Password (optional)' : 'Password'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-emerald-700/50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-emerald-200"
                      required={!currentUser}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-emerald-500/20"
                  >
                    {currentUser ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;