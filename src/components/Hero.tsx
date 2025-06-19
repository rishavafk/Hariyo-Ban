import React from 'react';
import { ArrowDown, Heart, TreePine, Target, Users, Trophy } from 'lucide-react';
import { useRealTimeStats } from '../hooks/useRealTimeStats';

const Hero = () => {
  const { stats } = useRealTimeStats();
  const progress = stats.totalTrees > 0 ? (stats.totalTrees / 20000) * 100 : 0;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
        }}
      />
      
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <TreePine className="h-20 w-20 text-green-400 animate-pulse" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">🌱</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
          Green<span className="text-green-400">Nepal</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
          Join thousands of Nepalis in reforesting our beautiful country. Every donation plants a tree and creates a greener future for Nepal.
        </p>

        {/* Progress Bar */}
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mb-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-full p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-800 font-semibold">Progress to Goal</span>
              <span className="text-gray-800 font-bold">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-semibold text-green-600">{stats.totalTrees.toLocaleString()} trees planted</span>
              <span>Goal: 20,000 trees</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <Heart className="inline h-6 w-6 mr-2" />
            Plant Trees Now
          </button>
          <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-4 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105">
            <Trophy className="inline h-6 w-6 mr-2" />
            View Leaderboard
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold text-green-400 mb-1">{stats.totalTrees.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Trees Planted</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold text-green-400 mb-1">{stats.totalDonors.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Donors</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold text-green-400 mb-1">₹{Math.round(stats.totalAmount / 100000)}L</div>
            <div className="text-sm text-gray-300">Raised</div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-8 w-8 text-white" />
      </div>
    </section>
  );
};

export default Hero;