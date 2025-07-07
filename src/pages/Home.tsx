import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Heart, TreePine, Target, Users, Trophy, MapPin, Award, Shield, Globe, Leaf } from 'lucide-react';
import { useRealTimeStats } from '../hooks/useRealTimeStats';

const Home = () => {
  const { stats } = useRealTimeStats();
  const progress = stats.totalTrees > 0 ? (stats.totalTrees / 50000) * 100 : 0;

  const features = [
    {
      icon: Heart,
      title: 'Easy eSewa Donations',
      description: 'Secure donations through eSewa payment gateway with instant confirmation.'
    },
    {
      icon: Users,
      title: 'Contribution Rooms',
      description: 'Join community rooms and contribute as little as NPR 10 to reach collective goals.'
    },
    {
      icon: MapPin,
      title: 'Real-time Site Tracking',
      description: 'Watch your trees grow on our interactive map with live updates from planting sites.'
    },
    {
      icon: Trophy,
      title: 'Community Leaderboards',
      description: 'Join fellow Rotarians and community members making a difference for Nepal.'
    },
    {
      icon: Shield,
      title: 'Rotary Transparency',
      description: 'Complete accountability through Rotary Club of Kasthamandap\'s trusted network.'
    }
  ];

  const rotaryValues = [
    {
      icon: Globe,
      title: 'Service Above Self',
      description: 'Following Rotary\'s motto in environmental stewardship for Nepal'
    },
    {
      icon: Users,
      title: 'Community Partnership',
      description: 'Bringing together local communities for lasting environmental change'
    },
    {
      icon: Target,
      title: 'Sustainable Impact',
      description: 'Creating measurable environmental improvements across Nepal'
    }
  ];

  const impactStats = [
    {
      icon: TreePine,
      value: stats.totalTrees.toLocaleString(),
      label: 'Trees Planted',
      color: 'text-forest-600'
    },
    {
      icon: Users,
      value: stats.totalDonors.toLocaleString(),
      label: 'Contributors',
      color: 'text-forest-600'
    },
    {
      icon: Globe,
      value: `${Math.round(stats.co2Absorbed / 1000)}T`,
      label: 'CO₂ Absorbed',
      color: 'text-forest-600'
    },
    {
      icon: Leaf,
      value: `${Math.round(stats.waterFiltered / 1000)}K L`,
      label: 'Water Filtered',
      color: 'text-forest-600'
    }
  ];

  return (
    <div>
      {/* Hero Section with Animated Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Tree Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(77, 93, 53, 0.7), rgba(77, 93, 53, 0.7)), url('https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
            }}
          />
          {/* Animated overlay for swaying effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-forest-900/20 to-transparent animate-pulse"></div>
          <div className="absolute inset-0">
            {/* Floating particles effect */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-forest-400 rounded-full opacity-30 animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-forest-400 to-forest-600 rounded-full flex items-center justify-center animate-pulse">
                <TreePine className="h-12 w-12 text-white animate-bounce" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-earth-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">R</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Rotary<span className="text-forest-400 animate-pulse">Roots</span>
          </h1>
          
          <div className="bg-forest-600/20 backdrop-blur-sm rounded-xl p-4 mb-6 max-w-2xl mx-auto">
            <p className="text-forest-100 font-semibold text-lg">Rotary Club of Kasthamandap Initiative</p>
            <p className="text-forest-200 text-sm">Service Above Self • Environmental Stewardship</p>
          </div>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Join the Rotary Club of Kasthamandap in reforesting Nepal. Every donation plants a tree and creates a greener future through community service and environmental action.
          </p>

          {/* Progress Bar */}
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mb-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-full p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-800 font-semibold">Progress to 50,000 Trees</span>
                <span className="text-gray-800 font-bold">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-forest-500 to-forest-600 h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span className="font-semibold text-forest-600">{stats.totalTrees.toLocaleString()} trees planted</span>
                <span>Goal: 50,000 trees by 2025</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              to="/donate"
              className="bg-forest-600 hover:bg-forest-700 text-white px-10 py-4 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
            >
              <Heart className="h-6 w-6 mr-2" />
              Plant Trees Now
            </Link>
            <Link 
              to="/contribution-rooms"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-4 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <Users className="h-6 w-6 mr-2" />
              Join Rooms
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
            {impactStats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color} animate-pulse`} />
                <div className="text-2xl font-bold text-forest-400 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-8 w-8 text-white" />
        </div>
      </section>

      {/* Rotary Values Section */}
      <section className="py-20 bg-gradient-to-b from-forest-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-earth-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">R</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Rotary <span className="text-forest-600">Values</span> in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Guided by Rotary International's principles of service, fellowship, and integrity in environmental stewardship for Nepal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rotaryValues.map((value, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-forest-50 to-forest-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                  <value.icon className="h-10 w-10 text-forest-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-forest-600">Rotary Roots</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We make tree planting simple, transparent, and impactful through Rotary's trusted network and cutting-edge technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-forest-50 to-forest-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                  <feature.icon className="h-10 w-10 text-forest-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-forest-600 to-earth-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <TreePine className="h-16 w-16 text-forest-200 animate-bounce" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-forest-600 text-xs font-bold">R</span>
              </div>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Serve Above Self?
          </h2>
          <p className="text-xl text-forest-100 mb-8 leading-relaxed">
            Join the Rotary Club of Kasthamandap's environmental mission. Every tree you plant helps combat climate change and creates a better future for Nepal through community service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/donate"
              className="bg-white text-forest-600 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Planting Trees
            </Link>
            <Link 
              to="/contribution-rooms"
              className="border-2 border-white text-white hover:bg-white hover:text-forest-600 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300"
            >
              Join Contribution Rooms
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;