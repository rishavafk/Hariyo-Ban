import React, { useState } from 'react';
import { Trophy, Medal, Award, Crown, Users, Building, Heart } from 'lucide-react';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('individual');

  const individualDonors = [
    { rank: 1, name: 'Priya Sharma', amount: 25000, trees: 125, avatar: 'PS', verified: true },
    { rank: 2, name: 'Rajesh Thapa', amount: 18500, trees: 92, avatar: 'RT', verified: true },
    { rank: 3, name: 'Anita Gurung', amount: 15200, trees: 76, avatar: 'AG', verified: false },
    { rank: 4, name: 'Bikash Shrestha', amount: 12800, trees: 64, avatar: 'BS', verified: true },
    { rank: 5, name: 'Sita Rai', amount: 11500, trees: 57, avatar: 'SR', verified: false },
    { rank: 6, name: 'Deepak Magar', amount: 9800, trees: 49, avatar: 'DM', verified: true },
    { rank: 7, name: 'Kamala Tamang', amount: 8900, trees: 44, avatar: 'KT', verified: false },
    { rank: 8, name: 'Suresh Poudel', amount: 7600, trees: 38, avatar: 'SP', verified: true },
  ];

  const organizationDonors = [
    { rank: 1, name: 'Himalayan Bank Ltd.', amount: 150000, trees: 750, avatar: 'HB', verified: true },
    { rank: 2, name: 'Ncell Pvt. Ltd.', amount: 125000, trees: 625, avatar: 'NC', verified: true },
    { rank: 3, name: 'Tribhuvan University', amount: 95000, trees: 475, avatar: 'TU', verified: true },
    { rank: 4, name: 'Nepal Tourism Board', amount: 75000, trees: 375, avatar: 'NT', verified: true },
    { rank: 5, name: 'Kathmandu Municipality', amount: 65000, trees: 325, avatar: 'KM', verified: true },
  ];

  const getRankIcon = (rank) => {
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

  const getRankBg = (rank) => {
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

  const currentData = activeTab === 'individual' ? individualDonors : organizationDonors;

  return (
    <section id="leaderboard" className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Top <span className="text-green-600">Contributors</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Celebrating the amazing individuals and organizations making Kathmandu greener. Join the leaderboard and make your mark!
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-2 shadow-lg border border-gray-200">
            <button
              onClick={() => setActiveTab('individual')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'individual'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Individual Donors</span>
            </button>
            <button
              onClick={() => setActiveTab('organization')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'organization'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Building className="h-5 w-5" />
              <span>Organizations</span>
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {currentData.map((donor, index) => (
              <div
                key={donor.rank}
                className={`${getRankBg(donor.rank)} border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
              >
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
                        </div>
                        <p className="text-sm text-gray-600">
                          {donor.trees} trees planted
                        </p>
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

          {/* Call to Action */}
          <div className="mt-12 text-center bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
            <Heart className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Join the Leaderboard!</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Make a donation and see your name among Nepal's environmental champions. Every contribution helps us reach our goal of 20,000 trees.
            </p>
            <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Donating
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;