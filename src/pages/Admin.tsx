import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  BarChart3, Users, TreePine, MapPin, Plus, Edit, Trash2, Eye, 
  Bell, CheckCircle, Clock, AlertCircle 
} from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalTrees: 0,
    totalDonors: 0,
    totalAmount: 0,
    activeSites: 0
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [plantingSites, setPlantingSites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user && (profile?.role === 'site_admin' || profile?.role === 'main_admin')) {
      fetchAdminData();
      fetchNotifications();
      
      // Set up real-time subscriptions
      const notificationsSubscription = supabase
        .channel('admin_notifications')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'site_notifications',
          filter: `admin_id=eq.${user.id}`
        }, () => {
          fetchNotifications();
        })
        .subscribe();

      const donationsSubscription = supabase
        .channel('admin_donations')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'donations'
        }, () => {
          fetchAdminData();
        })
        .subscribe();

      return () => {
        notificationsSubscription.unsubscribe();
        donationsSubscription.unsubscribe();
      };
    }
  }, [user, profile]);

  const fetchAdminData = async () => {
    try {
      // Fetch stats based on user role
      if (profile?.role === 'main_admin') {
        // Main admin sees all data
        const { data: donations } = await supabase
          .from('donations')
          .select('amount, trees_count, user_id, created_at, payment_status, profiles(full_name), planting_sites(name)')
          .eq('payment_status', 'completed')
          .order('created_at', { ascending: false })
          .limit(10);

        const { data: sites } = await supabase
          .from('planting_sites')
          .select('*')
          .order('name');

        if (donations) {
          const totalTrees = donations.reduce((sum, d) => sum + (d.trees_count || 0), 0);
          const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
          const totalDonors = new Set(donations.map(d => d.user_id)).size;

          setStats({
            totalTrees,
            totalDonors,
            totalAmount,
            activeSites: sites?.length || 0
          });
          setRecentDonations(donations);
        }
        setPlantingSites(sites || []);
      } else {
        // Site admin sees only their site data
        const { data: adminSites } = await supabase
          .from('site_admins')
          .select('site_id, planting_sites(*)')
          .eq('profile_id', user.id)
          .eq('is_active', true);

        if (adminSites && adminSites.length > 0) {
          const siteIds = adminSites.map(as => as.site_id);
          
          const { data: donations } = await supabase
            .from('donations')
            .select('amount, trees_count, user_id, created_at, payment_status, profiles(full_name), planting_sites(name)')
            .in('site_id', siteIds)
            .eq('payment_status', 'completed')
            .order('created_at', { ascending: false })
            .limit(10);

          if (donations) {
            const totalTrees = donations.reduce((sum, d) => sum + (d.trees_count || 0), 0);
            const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
            const totalDonors = new Set(donations.map(d => d.user_id)).size;

            setStats({
              totalTrees,
              totalDonors,
              totalAmount,
              activeSites: adminSites.length
            });
            setRecentDonations(donations);
          }
          setPlantingSites(adminSites.map(as => as.planting_sites));
        }
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('site_notifications')
        .select(`
          *,
          planting_sites(name),
          donations(amount, trees_count, tree_species)
        `)
        .eq('admin_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await supabase
        .from('site_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'donations', label: 'Donations', icon: Users },
    { id: 'sites', label: 'Planting Sites', icon: MapPin },
    { id: 'trees', label: 'Tree Management', icon: TreePine }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-forest-100 text-forest-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'donation': return <TreePine className="h-5 w-5 text-forest-600" />;
      case 'room_completed': return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'tree_planted': return <TreePine className="h-5 w-5 text-forest-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <TreePine className="h-12 w-12 animate-pulse text-forest-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {profile?.role === 'main_admin' ? 'Main Admin Dashboard' : 'Site Admin Dashboard'}
          </h1>
          <p className="text-gray-600">
            {profile?.role === 'main_admin' 
              ? 'Manage all Rotary Roots platform operations' 
              : 'Manage your assigned planting sites and track donations'
            }
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors relative ${
                    activeTab === tab.id
                      ? 'border-forest-500 text-forest-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="inline h-5 w-5 mr-2" />
                  {tab.label}
                  {tab.id === 'notifications' && notifications.filter(n => !n.is_read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.is_read).length}
                    </span>
                  )}
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
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <TreePine className="h-12 w-12 text-forest-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalTrees}</div>
                    <div className="text-gray-600">Trees Planted</div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="h-12 w-12 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalDonors}</div>
                    <div className="text-gray-600">Active Donors</div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <BarChart3 className="h-12 w-12 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">₹{stats.totalAmount.toLocaleString()}</div>
                    <div className="text-gray-600">Total Donations</div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <MapPin className="h-12 w-12 text-orange-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stats.activeSites}</div>
                    <div className="text-gray-600">
                      {profile?.role === 'main_admin' ? 'Total Sites' : 'Your Sites'}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
                    <div className="space-y-3">
                      {recentDonations.slice(0, 5).map((donation, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{donation.profiles?.full_name || 'Anonymous'}</div>
                            <div className="text-sm text-gray-600">{donation.trees_count} trees • {donation.planting_sites?.name}</div>
                            <div className="text-xs text-gray-500">{new Date(donation.created_at).toLocaleDateString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-forest-600">₹{donation.amount}</div>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(donation.payment_status)}`}>
                              {donation.payment_status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Planting Sites</h3>
                    <div className="space-y-3">
                      {plantingSites.slice(0, 5).map((site) => (
                        <div key={site.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{site.name}</div>
                            <div className="text-sm text-gray-600">{site.planted_trees} trees planted</div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(site.status)}`}>
                              {site.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
                  <div className="text-sm text-gray-600">
                    {notifications.filter(n => !n.is_read).length} unread
                  </div>
                </div>

                <div className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 rounded-xl border transition-all duration-200 ${
                          notification.is_read 
                            ? 'bg-gray-50 border-gray-200' 
                            : 'bg-forest-50 border-forest-200 shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.notification_type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{notification.title}</h4>
                              <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>{notification.planting_sites?.name}</span>
                                <span>{new Date(notification.created_at).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          {!notification.is_read && (
                            <button
                              onClick={() => markNotificationAsRead(notification.id)}
                              className="text-forest-600 hover:text-forest-700 text-sm font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No notifications yet</h3>
                      <p className="text-gray-500">You'll receive notifications when donations are made to your sites.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other tabs remain the same but with forest theme colors */}
            {activeTab === 'donations' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Donation Management</h3>
                </div>
                <div className="text-center py-12">
                  <TreePine className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Donation management interface coming soon.</p>
                </div>
              </div>
            )}

            {activeTab === 'sites' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Planting Sites Management</h3>
                </div>
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Site management interface coming soon.</p>
                </div>
              </div>
            )}

            {activeTab === 'trees' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Tree Management</h3>
                </div>
                <div className="text-center py-12">
                  <TreePine className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Tree management interface coming soon.</p>
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