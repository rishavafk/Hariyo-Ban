import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Trophy, Users, MapPin, Heart, User,
  LogOut, BarChart3, Shield, Info
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from './Gemini_Generated_Image_hh6injhh6injhh6i.png'; // ✅ Your logo path

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const isActive = (path) => location.pathname === path;

  const commonNavItems = [
    { path: '/donate', label: 'Donate Trees', icon: Heart },
    { path: '/contribution-rooms', label: 'Contribution Rooms', icon: Users },
    { path: '/map', label: 'Live Map', icon: MapPin },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/about', label: 'About Rotary Roots', icon: Info },
  ];

  const authNavItems = user
    ? [{ path: '/dashboard', label: 'Dashboard', icon: BarChart3 }, ...commonNavItems]
    : commonNavItems;

  if (user && (profile?.role === 'main_admin' || profile?.role === 'site_admin')) {
    authNavItems.push({ path: '/admin', label: 'Admin Panel', icon: Shield });
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 🔗 Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img
              src={logo}
              alt="Rotary Roots Logo"
              className="w-12 h-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Rotary Roots</span>
              <span className="text-xs text-green-600 font-medium">Rotary Club of Kasthamandap</span>
            </div>
          </Link>

          {/* 🔗 Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            {authNavItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 ${
                  isActive(path)
                    ? 'bg-green-100 text-green-700 font-semibold'
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* 🔐 Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {profile?.is_rotary_member && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    Rotary Member
                  </div>
                )}
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span>{profile?.full_name || 'User'}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Join Initiative
                </Link>
              </div>
            )}
          </div>

          {/* 📱 Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* 📱 Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-1">
              {authNavItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    isActive(path)
                      ? 'bg-green-100 text-green-700 font-semibold'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}

              {/* Mobile auth */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {user ? (
                  <>
                    <div className="px-4 py-3 text-gray-700">
                      <User className="inline h-4 w-4 mr-2" />
                      {profile?.full_name || 'User'}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors mt-2"
                    >
                      Join Initiative
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
