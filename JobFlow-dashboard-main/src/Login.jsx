import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function Login() {
  const { login, error: authError, isLoading } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLocalError('');

    if (!form.email.trim() || !form.password.trim()) {
      setLocalError('Email and password are required.');
      return;
    }

    const res = await login(form.email.trim(), form.password.trim());

    if (!res.success) {
      setLocalError(res.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">

        {/* HEADER */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          JobFlow Login
        </h2>

        {/* ERROR MESSAGE */}
        {(localError || authError) && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-3 rounded">
            <p className="text-red-700 text-sm font-semibold">
              {localError || authError}
            </p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="you@email.com"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white 
                         transition-all"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white 
                           transition-all"
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold 
                       rounded-xl transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400"
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
