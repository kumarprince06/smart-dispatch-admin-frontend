import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { post, isLoading, error: apiError } = useApi<any>();

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing password reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset token.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const res = await post('/auth/reset-password', { 
      token,
      newPassword,
      confirmPassword
    });
    
    if (res && res.success) {
      setSuccess(true);
    } else if (apiError) {
      setError(apiError.message || 'Unable to reset password. The token may be expired.');
    } else if (!res) {
      setError('Unable to connect to the server. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg-primary p-4 sm:p-8 font-sans relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTUwLCAxNTAsIDE1MCwgMC4wNSkiLz48L3N2Zz4=')]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[420px] relative z-10">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Smart Dispatch Logo" className="w-16 h-16 rounded-2xl shadow-md border border-border-color mb-4" />
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Reset Password</h1>
          <p className="text-text-muted text-sm mt-1">Create a new password for your account.</p>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            {success ? (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-status-success/20 flex items-center justify-center mb-4 text-status-success">
                  <CheckCircle size={24} />
                </div>
                <h2 className="text-lg font-semibold text-text-primary mb-2">Password Reset Successful</h2>
                <p className="text-text-secondary text-sm mb-6">You can now sign in using your new password.</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full h-11 bg-accent-primary hover:bg-accent-hover text-white rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && (
                  <div className="p-3.5 rounded-xl bg-status-danger/10 border border-status-danger/20 text-status-danger text-sm font-medium flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-danger shrink-0"></div>
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">New Password</label>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-accent-primary" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">Confirm Password</label>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-accent-primary" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full py-3 pr-11 pl-10 bg-bg-primary border border-border-color rounded-xl text-text-primary text-sm transition-all outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 placeholder:text-text-muted/50"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || !token}
                  className="w-full mt-2 h-11 bg-accent-primary hover:bg-accent-hover text-white rounded-xl text-sm font-semibold shadow-md shadow-accent-primary/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>
              </form>
            )}
          </div>
          {!success && (
            <div className="px-8 py-4 bg-bg-tertiary border-t border-border-color text-center">
              <Link to="/login" className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors inline-flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
