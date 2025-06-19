import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TreePine, Mail, Lock, Eye, EyeOff, AlertCircle, Users, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <TreePine className="h-16 w-16 text-green-600" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">R</span>
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back to Hariyo Ban</h2>
          <p className="text-gray-600">Sign in to continue planting trees for Nepal</p>
        </div>

        {/* Login Type Selector */}
        <div className="bg-white rounded-2xl shadow-xl p-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLoginType('user')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                loginType === 'user'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>User Login</span>
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                loginType === 'admin'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6 text-center">
            <h3 className="text-xl font-bold text-gray-900">
              {loginType === 'user' ? 'User Sign In' : 'Admin Sign In'}
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              {loginType === 'user' 
                ? 'Access your dashboard and track your tree donations'
                : 'Manage planting sites and receive donation notifications'
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-green-600 focus:ring-green-600"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none"
            >
              {loading ? 'Signing in...' : `Sign In as ${loginType === 'user' ? 'User' : 'Admin'}`}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-green-600 hover:text-green-700 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;