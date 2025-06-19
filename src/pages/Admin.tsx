import React, { useState } from 'react';
import { BarChart3, Users, TreePine, MapPin, Plus, Edit, Trash2, Eye } from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'Total Trees Planted', value: '12,847', change: '+234 this week', color: 'text-green-600' },
    { label: 'Active Donors', value: '8,492', change: '+156 this month', color: 'text-blue-600' },
    { label: 'Total Donations', value: '₹32,45,000', change: '+₹45,000 this week', color: 'text-purple-600' },
    { label: 'Planting Sites', value: '15', change: '+2 this month', color: 'text-orange-600' }
  ];

  const recentDonations = [
    { id: 1, donor: 'Priya Sharma', amount: 2000, trees: 10, date: '2024-01-15', status: 'completed' },
    { id: 2, donor: 'Rajesh Thapa', amount: 1500, trees: 7, date: '2024-01-15', status: 'processing' },
    { id: 3, donor: 'Anita Gurung', amount: 3000, trees: 15, date: '2024-01-14', status: 'completed' },
    { id: 4, donor: 'Bikash Shrestha', amount: 1000, trees: 5, date: '2024-01-14', status: 'completed' },
  ];

  const plantingSites = [
    { id: 1, name: 'Shivapuri National Park', trees: 2847, status: 'active', lastUpdate: '2024-01-15' },
    { id: 2, name: 'Pashupatinath Area', trees: 1263, status: 'active', lastUpdate: '2024-01-12' },
    { id: 3, name: 'Godavari Botanical Garden', trees: 2156, status: 'active', lastUpdate: '2024-01-16' },
    { id: 4, name: 'Tribhuvan University', trees: 1823, status: 'planning', lastUpdate: '2024-01-13' },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'donations', label: 'Donations', icon: Users },
    { id: 'sites', label: 'Planting Sites', icon: MapPin },
    { id: 'trees', label: 'Tree Management', icon: TreePine }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage Plant a Tree platform operations</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="inline h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                          <p className="text-sm text-gray-500">{stat.change}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
                    <div className="space-y-3">
                      {recentDonations.slice(0, 5).map((donation) => (
                        <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{donation.donor}</div>
                            <div className="text-sm text-gray-600">{donation.trees} trees • {donation.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">₹{donation.amount}</div>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(donation.status)}`}>
                              {donation.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Planting Sites</h3>
                    <div className="space-y-3">
                      {plantingSites.slice(0, 5).map((site) => (
                        <div key={site.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{site.name}</div>
                            <div className="text-sm text-gray-600">{site.trees} trees planted</div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(site.status)}`}>
                              {site.status}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">{site.lastUpdate}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Donations Tab */}
            {activeTab === 'donations' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Donation Management</h3>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Export Data
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trees</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentDonations.map((donation) => (
                        <tr key={donation.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donation.donor}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{donation.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.trees}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(donation.status)}`}>
                              {donation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sites Tab */}
            {activeTab === 'sites' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Planting Sites Management</h3>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Site
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plantingSites.map((site) => (
                    <div key={site.id} className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">{site.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(site.status)}`}>
                          {site.status}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Trees Planted:</span>
                          <span className="text-sm font-semibold text-green-600">{site.trees}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Update:</span>
                          <span className="text-sm text-gray-900">{site.lastUpdate}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          View Details
                        </button>
                        <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trees Tab */}
            {activeTab === 'trees' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Tree Species Management</h3>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tree Species
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <p className="text-gray-600 text-center py-8">
                    Tree species management interface will be implemented here.
                    This will include adding new tree types, managing prices, and updating descriptions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;