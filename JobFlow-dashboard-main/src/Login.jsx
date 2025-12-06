import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoggingIn(true);
    
    try {
      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
      // If success, AuthContext will handle the redirect via isAuthenticated change
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JobFlow Dashboard</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isLoggingIn}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base pr-12"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoggingIn}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isLoggingIn}
              >
                {showPassword ? (
                  <span className="text-xl">👁️</span>
                ) : (
                  <span className="text-xl">👁️‍🗨️</span>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Contact your administrator for account access</p>
        </div>
      </div>
    </div>
  );
}
