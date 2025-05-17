import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiUsers, FiCreditCard, FiBarChart2, FiActivity } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        toast.error('Failed to load admin statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link
          to="/admin/users"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Manage Users
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiUsers className="text-2xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Users</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats?.users.total}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Free: {stats?.users.byPlan.free}</span>
              <span className="text-gray-500">Premium: {stats?.users.byPlan.premiumBasic + stats?.users.byPlan.premiumPro}</span>
            </div>
          </div>
        </div>

        {/* Total Conversions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiBarChart2 className="text-2xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Conversions</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats?.conversions.total}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Standard: {stats?.conversions.byVoiceType.standard}</span>
              <span className="text-gray-500">WaveNet: {stats?.conversions.byVoiceType.wavenet}</span>
            </div>
          </div>
        </div>

        {/* Characters Processed */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiCreditCard className="text-2xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Characters Processed</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats?.characters.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              Approx. {Math.round(stats?.characters / 1000000 * 100) / 100} million characters
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <FiActivity className="text-2xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Recent Activity</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats?.conversions.recent}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              Conversions in the last 7 days
            </div>
          </div>
        </div>
      </div>

      {/* User Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">User Plan Distribution</h2>
          <div className="h-64 flex items-end justify-around">
            {/* Free Users Bar */}
            <div className="flex flex-col items-center">
              <div 
                className="w-16 bg-blue-500 rounded-t-md" 
                style={{ 
                  height: `${(stats?.users.byPlan.free / stats?.users.total) * 200}px`,
                  minHeight: '20px'
                }}
              ></div>
              <p className="mt-2 text-sm font-medium">Free</p>
              <p className="text-gray-500 text-sm">{stats?.users.byPlan.free}</p>
            </div>
            
            {/* Premium Basic Users Bar */}
            <div className="flex flex-col items-center">
              <div 
                className="w-16 bg-purple-500 rounded-t-md" 
                style={{ 
                  height: `${(stats?.users.byPlan.premiumBasic / stats?.users.total) * 200}px`,
                  minHeight: '20px'
                }}
              ></div>
              <p className="mt-2 text-sm font-medium">Premium Basic</p>
              <p className="text-gray-500 text-sm">{stats?.users.byPlan.premiumBasic}</p>
            </div>
            
            {/* Premium Pro Users Bar */}
            <div className="flex flex-col items-center">
              <div 
                className="w-16 bg-green-500 rounded-t-md" 
                style={{ 
                  height: `${(stats?.users.byPlan.premiumPro / stats?.users.total) * 200}px`,
                  minHeight: '20px'
                }}
              ></div>
              <p className="mt-2 text-sm font-medium">Premium Pro</p>
              <p className="text-gray-500 text-sm">{stats?.users.byPlan.premiumPro}</p>
            </div>
          </div>
        </div>

        {/* Voice Type Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Voice Type Distribution</h2>
          <div className="h-64 flex items-end justify-around">
            {/* Standard Voice Bar */}
            <div className="flex flex-col items-center">
              <div 
                className="w-16 bg-blue-500 rounded-t-md" 
                style={{ 
                  height: `${(stats?.conversions.byVoiceType.standard / stats?.conversions.total) * 200}px`,
                  minHeight: '20px'
                }}
              ></div>
              <p className="mt-2 text-sm font-medium">Standard</p>
              <p className="text-gray-500 text-sm">{stats?.conversions.byVoiceType.standard}</p>
            </div>
            
            {/* WaveNet Voice Bar */}
            <div className="flex flex-col items-center">
              <div 
                className="w-16 bg-purple-500 rounded-t-md" 
                style={{ 
                  height: `${(stats?.conversions.byVoiceType.wavenet / stats?.conversions.total) * 200}px`,
                  minHeight: '20px'
                }}
              ></div>
              <p className="mt-2 text-sm font-medium">WaveNet</p>
              <p className="text-gray-500 text-sm">{stats?.conversions.byVoiceType.wavenet}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/users"
            className="bg-gray-100 hover:bg-gray-200 p-4 rounded-md text-center"
          >
            <FiUsers className="text-2xl mx-auto mb-2 text-gray-700" />
            <span className="text-gray-800 font-medium">Manage Users</span>
          </Link>
          
          <button
            className="bg-gray-100 hover:bg-gray-200 p-4 rounded-md text-center"
            onClick={() => toast.info('Feature coming soon!')}
          >
            <FiBarChart2 className="text-2xl mx-auto mb-2 text-gray-700" />
            <span className="text-gray-800 font-medium">View Detailed Reports</span>
          </button>
          
          <button
            className="bg-gray-100 hover:bg-gray-200 p-4 rounded-md text-center"
            onClick={() => toast.info('Feature coming soon!')}
          >
            <FiCreditCard className="text-2xl mx-auto mb-2 text-gray-700" />
            <span className="text-gray-800 font-medium">Manage Plans</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

