import React, { useState, useEffect } from 'react';
import { Settings, Lock, Shield, CreditCard, Save, CheckCircle2 } from 'lucide-react';
import { useApi } from '../../hooks/useApi';

interface PlatformConfig {
  platformFee: number;
  taxRate: number;
  baseFare: number;
  perKmRate: number;
  surgeEnabled: boolean;
  autoAssign: boolean;
}

export const SettingsManagement: React.FC = () => {
  const { get, post, put, isLoading } = useApi<PlatformConfig>();
  
  // Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Platform State
  const [platformConfig, setPlatformConfig] = useState({
    platformFee: 5.0,
    taxRate: 18.0,
    baseFare: 50.0,
    perKmRate: 15.0,
    surgeEnabled: true,
    autoAssign: true
  });
  const [configSuccess, setConfigSuccess] = useState(false);

  useEffect(() => {
    // Fetch dynamic config on load
    get('/settings').then(res => {
      if (res && res.data) {
        setPlatformConfig({
          platformFee: res.data.platformFee,
          taxRate: res.data.taxRate,
          baseFare: res.data.baseFare,
          perKmRate: res.data.perKmRate,
          surgeEnabled: res.data.surgeEnabled,
          autoAssign: res.data.autoAssign,
        });
      }
    });
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      await post('/auth/change-password', passwordForm);
      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await put('/settings', platformConfig);
      setConfigSuccess(true);
      setTimeout(() => setConfigSuccess(false), 3000);
    } catch (err: any) {
      alert("Failed to update config");
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Settings className="text-accent-primary" /> Platform Settings
        </h1>
        <p className="text-text-secondary mt-1">Manage global application configurations and admin security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Security Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-status-warning/10 flex items-center justify-center text-status-warning">
                <Shield size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Admin Security</h2>
                <p className="text-sm text-text-secondary">Update your admin password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input 
                    type="password" required
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full bg-bg-primary border border-border-color rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input 
                    type="password" required minLength={6}
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full bg-bg-primary border border-border-color rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input 
                    type="password" required minLength={6}
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full bg-bg-primary border border-border-color rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors"
                  />
                </div>
              </div>

              {passwordError && <p className="text-sm text-status-danger">{passwordError}</p>}
              {passwordSuccess && <p className="text-sm text-status-success flex items-center gap-1"><CheckCircle2 size={16} /> Password updated successfully</p>}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-bg-tertiary hover:bg-bg-tertiary/80 border border-border-color rounded-xl transition-all duration-200 text-sm font-medium text-text-primary disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Global Configuration */}
        <div className="lg:col-span-2">
          <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm">
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-primary">Global Monetization & Logistics</h2>
                  <p className="text-sm text-text-secondary">Configure base fares, platform fees, and assignment rules.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveConfig}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Section 1 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider border-b border-border-color pb-2">Financial Settings</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Platform Fee (%)</label>
                    <input 
                      type="number" step="0.1" required
                      value={platformConfig.platformFee}
                      onChange={e => setPlatformConfig({...platformConfig, platformFee: parseFloat(e.target.value)})}
                      className="w-full bg-bg-primary border border-border-color rounded-xl px-4 py-2.5 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Tax / GST Rate (%)</label>
                    <input 
                      type="number" step="0.1" required
                      value={platformConfig.taxRate}
                      onChange={e => setPlatformConfig({...platformConfig, taxRate: parseFloat(e.target.value)})}
                      className="w-full bg-bg-primary border border-border-color rounded-xl px-4 py-2.5 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Section 2 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider border-b border-border-color pb-2">Logistic Rules</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Base Delivery Fare (₹)</label>
                    <input 
                      type="number" step="1" required
                      value={platformConfig.baseFare}
                      onChange={e => setPlatformConfig({...platformConfig, baseFare: parseFloat(e.target.value)})}
                      className="w-full bg-bg-primary border border-border-color rounded-xl px-4 py-2.5 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Per Kilometer Rate (₹)</label>
                    <input 
                      type="number" step="0.5" required
                      value={platformConfig.perKmRate}
                      onChange={e => setPlatformConfig({...platformConfig, perKmRate: parseFloat(e.target.value)})}
                      className="w-full bg-bg-primary border border-border-color rounded-xl px-4 py-2.5 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Section 3: Toggles */}
                <div className="md:col-span-2 space-y-4 mt-2">
                  <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider border-b border-border-color pb-2">Automation Toggles</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-4 bg-bg-primary border border-border-color rounded-xl cursor-pointer hover:border-accent-primary/50 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={platformConfig.surgeEnabled}
                        onChange={e => setPlatformConfig({...platformConfig, surgeEnabled: e.target.checked})}
                        className="w-5 h-5 rounded text-accent-primary focus:ring-accent-primary bg-bg-secondary border-border-color cursor-pointer"
                      />
                      <div>
                        <span className="block text-sm font-medium text-text-primary">Enable Dynamic Surge</span>
                        <span className="block text-xs text-text-muted">Apply zone multipliers automatically</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-bg-primary border border-border-color rounded-xl cursor-pointer hover:border-accent-primary/50 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={platformConfig.autoAssign}
                        onChange={e => setPlatformConfig({...platformConfig, autoAssign: e.target.checked})}
                        className="w-5 h-5 rounded text-accent-primary focus:ring-accent-primary bg-bg-secondary border-border-color cursor-pointer"
                      />
                      <div>
                        <span className="block text-sm font-medium text-text-primary">Auto-Assign Drivers</span>
                        <span className="block text-xs text-text-muted">Broadcast to nearest drivers first</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border-color flex items-center justify-between">
                <div>
                  {configSuccess && <p className="text-sm font-medium text-status-success flex items-center gap-1.5"><CheckCircle2 size={16} /> Configuration saved globally</p>}
                </div>
                <button 
                  type="submit" 
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-accent-primary hover:bg-accent-hover text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg shadow-accent-primary/20"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};
