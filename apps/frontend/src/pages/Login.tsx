import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../lib/apiClient';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // In a real app, we'd hit /api/auth/login.
      // For this spec, we might mock if it fails, but we'll try the real API first.
      const res = await apiClient.post('/auth/login', { email, password }).catch(() => {
         // Mock fallback for rapid dev if API is down
         if (email === 'admin@hydrotrack.com' && password === 'admin') {
           return { data: { token: 'mock-jwt-token', user: { id: '1', email, name: 'Admin', role: 'admin' } } };
         }
         throw new Error('Invalid credentials');
      });
      
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-2xl p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-functional-blue/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="font-display-lg text-primary text-3xl mb-2">HydroTrack v3.0</h1>
            <p className="text-on-surface-variant font-body-md">Advanced Water Telemetry System</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-functional-red/10 border border-functional-red/20 rounded-lg flex items-start gap-2 text-functional-red text-sm">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1 font-label-caps uppercase tracking-wider">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg py-2.5 pl-10 pr-4 text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                  placeholder="admin@hydrotrack.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1 font-label-caps uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg py-2.5 pl-10 pr-4 text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <>
                  Sign In <span className="material-symbols-outlined text-[18px]">login</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
