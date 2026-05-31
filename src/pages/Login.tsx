import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useApi } from '../hooks/useApi';
import { LogIn, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();
  const { post, isLoading, error: apiError } = useApi<any>();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await post('/auth/login', { email, password });
    
    if (res && res.success) {
      const { accessToken, refreshToken, firstName, lastName, role, phoneNumber, email: userEmail } = res.data;
      
      const user = {
        firstName: firstName || 'Admin',
        lastName: lastName || '',
        email: userEmail || email,
        phoneNumber: phoneNumber || undefined,
        role: role || 'ADMIN'
      };
      
      login(accessToken, refreshToken || '', user);
      navigate('/');
    } else if (apiError) {
      setError(apiError.message || 'Invalid email or password.');
    } else if (!res) {
      setError('Unable to connect to the server. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg-primary p-4 sm:p-8 font-sans relative">
      {/* Subtle modern grid background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTUwLCAxNTAsIDE1MCwgMC4wNSkiLz48L3N2Zz4=')]"></div>
      
      {/* Centered ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[420px] relative z-10">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="FataFat Logo" className="w-16 h-16 rounded-2xl shadow-md border border-border-color mb-4" />
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">FataFat</h1>
          <p className="text-text-muted text-sm mt-1">Admin Portal Login</p>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Sign in to your account</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-status-danger/10 border border-status-danger/20 text-status-danger text-sm font-medium flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-status-danger shrink-0"></div>
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary">Email address</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-accent-primary" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@fatafat.com"
                    className="w-full py-3 pr-4 pl-10 bg-bg-primary border border-border-color rounded-xl text-text-primary text-sm transition-all outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 placeholder:text-text-muted/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-text-secondary">Password</label>
                  <Link to="/forgot-password" className="text-sm font-medium text-accent-primary hover:text-accent-hover transition-colors">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-accent-primary" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-3 pr-11 pl-10 bg-bg-primary border border-border-color rounded-xl text-text-primary text-sm transition-all outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 placeholder:text-text-muted/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-bg-tertiary focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-2 h-11 bg-accent-primary hover:bg-accent-hover text-white rounded-xl text-sm font-semibold shadow-md shadow-accent-primary/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign in</span>
                    <LogIn size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="px-8 py-4 bg-bg-tertiary border-t border-border-color text-center">
            <p className="text-xs text-text-muted">
              Secure administrative access only.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-8">
          &copy; {new Date().getFullYear()} FataFat Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
};
