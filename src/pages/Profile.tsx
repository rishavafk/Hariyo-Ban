import React, { useState } from 'react';
import { User, TreePine, Heart, Award, Calendar, MapPin, Settings, Download, Share2 } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const userData = {
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    joinDate: '2023-06-15',
    totalDonated: 25000,
    treesPlanted: 125,
    rank: 1,
    badges: ['Top Donor', 'Early Supporter', 'Tree Champion', 'Monthly Contributor'],
    recentDonations: [
      { id: 1, date: '2024-01-15', amount: 2000, trees: 10, location: 'Shivapuri National Park' },
      { id: 2, date: '2024-01-10', amount: 1500, trees: 7, location: 'Pashupatinath Area' },
      { id: 3, date: '2024-01-05', amount: 3000, trees: 15, location: 'Godavari Botanical Garden' },
      { id: 4, date: '2023-12-28', amount: 1000, trees: 5, location: 'Tribhuvan University' },
    ],
    impactStats: {
      co2Absorbed: '2.5 tons',
      waterSaved: '15,000 liters',
      wildlifeSupported: '50+ species',
      soilImproved: '500 sq meters'
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'donations', label: 'My Donations', icon: Heart },
    { id: 'impact', label: 'My Impact', icon: TreePine },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold">PS</span>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
              <p className="text-green-100 mb-4">{userData.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                <div className="bg-white/20 rounded-full px-3 py-1">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Joined {new Date(userData.joinDate).toLocaleDateString()}
                </div>
                <div className="bg-white/20 rounded-full px-3 py-1">
                  <Award className="inline h-4 w-4 mr-1" />
                  Rank #{userData.rank}
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">₹{userData.totalDonated.toLocaleString()}</div>
              <div className="text-green-100">Total Donated</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <TreePine className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 mb-2">{userData.treesPlanted}</div>
            <div className="text-gray-600">Trees Planted</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 mb-2">{userData.recentDonations.length}</div>
            <div className="text-gray-600">Donations Made</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 mb-2">{userData.badges.length}</div>
            <div className="text-gray-600">Badges Earned</div>
          </div>
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Badges */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Your Badges</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {userData.badges.map((badge, index) => (
                      <div key={index} className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                        <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-sm font-semibold text-green-800">{badge}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {userData.recentDonations.slice(0, 3).map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <TreePine className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Planted {donation.trees} trees</div>
                            <div className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {donation.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">₹{donation.amount}</div>
                          <div className="text-sm text-gray-500">{donation.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Donations Tab */}
            {activeTab === 'donations' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Donation History</h3>
                  <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {userData.recentDonations.map((donation) => (
                    <div key={donation.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                            <TreePine className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {donation.trees} trees planted
                            </div>
                            <div className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {donation.location}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(donation.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">₹{donation.amount}</div>
                          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact Tab */}
            {activeTab === 'impact' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Your Environmental Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-blue-50 rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{userData.impactStats.co2Absorbed}</div>
                      <div className="text-blue-800 font-semibold">CO₂ Absorbed</div>
                      <div className="text-sm text-blue-600 mt-1">Annually by your trees</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">{userData.impactStats.waterSaved}</div>
                      <div className="text-green-800 font-semibold">Water Conserved</div>
                      <div className="text-sm text-green-600 mt-1">Through tree planting</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">{userData.impactStats.wildlifeSupported}</div>
                      <div className="text-purple-800 font-semibold">Wildlife Supported</div>
                      <div className="text-sm text-purple-600 mt-1">Species benefited</div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">{userData.impactStats.soilImproved}</div>
                      <div className="text-orange-800 font-semibold">Soil Improved</div>
                      <div className="text-sm text-orange-600 mt-1">Area enhanced</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white text-center">
                  <TreePine className="h-16 w-16 mx-auto mb-4 text-green-200" />
                  <h4 className="text-2xl font-bold mb-4">Keep Growing Your Impact!</h4>
                  <p className="text-green-100 mb-6">
                    Your {userData.treesPlanted} trees are making a real difference. Plant more to increase your environmental impact!
                  </p>
                  <button className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-full font-bold transition-colors">
                    Plant More Trees
                  </button>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={userData.name}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={userData.email}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-600" defaultChecked />
                          <span className="ml-2 text-sm text-gray-700">Email updates about my trees</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-600" defaultChecked />
                          <span className="ml-2 text-sm text-gray-700">Monthly impact reports</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-600" />
                          <span className="ml-2 text-sm text-gray-700">Promotional emails</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                    Save Changes
                  </button>
                  <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;