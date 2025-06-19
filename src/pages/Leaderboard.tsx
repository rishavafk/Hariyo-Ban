import React, { useState } from 'react';
import { Trophy, Medal, Award, Crown, Users, Building, Heart, TrendingUp, Loader2, Star } from 'lucide-react';
import { useRealTimeStats } from '../hooks/useRealTimeStats';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('individual');
  const [timeFilter, setTimeFilter] = useState('all');
  const { leaderboard, organizationLeaderboard, loading } = useRealTimeStats();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getOrgTypeColor = (type: string) => {
    const colors = {
      'Service Club': 'bg-blue-100 text-blue-800',
      'NGO': 'bg-green-100 text-green-800',
      'Corporate': 'bg-purple-100 text-purple-800',
      'Educational': 'bg-indigo-100 text-indigo-800',
      'Government': 'bg-orange-100 text-orange-800',
      'Municipal': 'bg-teal-100 text-teal-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const currentData = activeTab === 'individual' ? leaderboard : organizationLeaderboard;

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading leaderboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Top <span className="text-green-600">Contributors</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Celebrating the amazing individuals and organizations making Nepal greener through the Rotary Club of Nepal initiative.
          </p>
        </div>

        {/* Live Update Indicator */}
        <div className="flex justify-center mb-8">
          <div className="bg-green-50 border border-green-200 rounded-full px-4 py-2 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 text-sm font-medium">Live Updates</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          {/* Tab Navigation */}
          <div className="bg-white rounded-full p-2 shadow-lg border border-gray-200">
            <button
              onClick={() => setActiveTab('individual')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'individual'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Individual</span>
            </button>
            <button
              onClick={() => setActiveTab('organization')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'organization'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Building className="h-5 w-5" />
              <span>Organizations</span>
            </button>
          </div>

          {/* Time Filter */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-white"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
            <option value="today">Today</option>
          </select>
        </div>

        {/* Top 3 Podium */}
        {currentData.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {currentData.slice(0, 3).map((donor, index) => (
              <div key={donor.rank} className={`text-center ${index === 0 ? 'md:order-2' : index === 1 ? 'md:order-1' : 'md:order-3'}`}>
                <div className={`relative ${getRankBg(donor.rank)} border-2 rounded-2xl p-6 ${index === 0 ? 'transform scale-105' : ''}`}>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      {getRankIcon(donor.rank)}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                      {donor.avatar}
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{donor.name}</h3>
                      {donor.verified && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    {activeTab === 'organization' && (
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mb-2 ${getOrgTypeColor(donor.type)}`}>
                        {donor.type}
                      </span>
                    )}
                    <div className="text-2xl font-bold text-green-600 mb-1">₹{donor.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{donor.trees} trees planted</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
              <h2 className="text-2xl font-bold">Full Leaderboard</h2>
              <p className="text-green-100">Complete rankings of all contributors</p>
            </div>
            
            {currentData.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {currentData.map((donor) => (
                  <div key={donor.rank} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12">
                          {getRankIcon(donor.rank)}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {donor.avatar}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-bold text-gray-900">{donor.name}</h3>
                              {donor.verified && (
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                              {getTrendIcon(donor.trend)}
                            </div>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm text-gray-600">
                                {donor.trees} trees planted
                              </p>
                              {activeTab === 'organization' && (
                                <span className={`px-2 py-1 text-xs rounded-full ${getOrgTypeColor(donor.type)}`}>
                                  {donor.type}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{donor.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">donated</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No contributors yet</h3>
                <p className="text-gray-500">Be the first to make a donation and appear on the leaderboard!</p>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg font-bold">RC</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Join the Rotary Environmental Mission!</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Make a donation through the Rotary Club of Nepal's GreenNepal initiative and see your name among Nepal's environmental champions.
            </p>
            <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Donating
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;