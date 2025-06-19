import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { TreePine, Heart, Award, TrendingUp, Calendar, MapPin, Users, Target, Leaf, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRealTimeStats } from '../hooks/useRealTimeStats';

interface UserStats {
  totalDonated: number;
  treesPlanted: number;
  donationCount: number;
  rank: number;
  co2Absorbed: number;
  waterSaved: number;
}

interface Donation {
  id: string;
  amount: number;
  trees: number;
  tree_type: string;
  location: string;
  created_at: string;
  payment_status: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { stats: globalStats } = useRealTimeStats();
  const [stats, setStats] = useState<UserStats>({
    totalDonated: 0,
    treesPlanted: 0,
    donationCount: 0,
    rank: 0,
    co2Absorbed: 0,
    waterSaved: 0,
  });
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      setProfile(profileData);

      // Fetch donations
      const { data: donationsData } = await supabase
        .from('donations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (donationsData) {
        setRecentDonations(donationsData);

        // Calculate stats
        const totalDonated = donationsData.reduce((sum, d) => sum + d.amount, 0);
        const treesPlanted = donationsData.reduce((sum, d) => sum + d.trees, 0);
        const co2Absorbed = treesPlanted * 22; // 22kg CO2 per tree per year
        const waterSaved = treesPlanted * 120; // 120 liters per tree per year

        setStats({
          totalDonated,
          treesPlanted,
          donationCount: donationsData.length,
          rank: 1, // This would be calculated based on all users
          co2Absorbed,
          waterSaved,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <TreePine className="h-12 w-12 animate-pulse text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || 'Tree Planter'}!</h1>
                <p className="text-green-100">Your environmental impact dashboard</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/donate"
                className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Plant More Trees
              </Link>
              <button
                onClick={handleSignOut}
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-6 py-3 rounded-full font-semibold transition-all duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Global Stats Banner */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Target className="h-6 w-6 text-green-600 mr-2" />
            Global Impact (Live)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{globalStats.totalTrees.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Trees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{globalStats.totalDonors.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Donors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₹{Math.round(globalStats.totalAmount / 100000)}L</div>
              <div className="text-sm text-gray-600">Total Raised</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{globalStats.recentPlantings}</div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
          </div>
        </div>

        {/* Personal Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <TreePine className="h-12 w-12 text-green-600" />
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.treesPlanted}</div>
            <div className="text-gray-600">Your Trees Planted</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Heart className="h-12 w-12 text-red-500" />
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">₹{stats.totalDonated.toLocaleString()}</div>
            <div className="text-gray-600">Total Donated</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-12 w-12 text-yellow-500" />
              <span className="text-sm font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                #{stats.rank}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.donationCount}</div>
            <div className="text-gray-600">Donations Made</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Leaf className="h-12 w-12 text-blue-500" />
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.co2Absorbed}kg</div>
            <div className="text-gray-600">CO₂ Absorbed/Year</div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="h-6 w-6 text-green-600 mr-2" />
              Your Environmental Impact
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <div className="font-semibold text-blue-800">CO₂ Absorbed</div>
                  <div className="text-sm text-blue-600">Annual carbon capture</div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{stats.co2Absorbed}kg</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div>
                  <div className="font-semibold text-green-800">Water Conserved</div>
                  <div className="text-sm text-green-600">Annual water savings</div>
                </div>
                <div className="text-2xl font-bold text-green-600">{stats.waterSaved}L</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div>
                  <div className="font-semibold text-purple-800">Wildlife Supported</div>
                  <div className="text-sm text-purple-600">Species benefited</div>
                </div>
                <div className="text-2xl font-bold text-purple-600">{Math.floor(stats.treesPlanted * 0.4)}+</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-6 w-6 text-green-600 mr-2" />
                Recent Donations
              </h3>
              <button className="text-green-600 hover:text-green-700 flex items-center text-sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            </div>
            <div className="space-y-4">
              {recentDonations.slice(0, 5).map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <TreePine className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{donation.trees} {donation.tree_type}</div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {donation.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">₹{donation.amount}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {recentDonations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <TreePine className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No donations yet. Start planting trees!</p>
                  <Link
                    to="/donate"
                    className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
                  >
                    Make Your First Donation
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/donate"
              className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
            >
              <TreePine className="h-8 w-8 text-green-600" />
              <div>
                <div className="font-semibold text-green-800">Plant More Trees</div>
                <div className="text-sm text-green-600">Continue your impact</div>
              </div>
            </Link>
            <Link
              to="/map"
              className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <MapPin className="h-8 w-8 text-blue-600" />
              <div>
                <div className="font-semibold text-blue-800">View Tree Map</div>
                <div className="text-sm text-blue-600">See your trees growing</div>
              </div>
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center space-x-3 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors"
            >
              <Users className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="font-semibold text-yellow-800">View Leaderboard</div>
                <div className="text-sm text-yellow-600">See your ranking</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;