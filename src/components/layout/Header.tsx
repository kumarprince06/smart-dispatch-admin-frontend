import React from 'react';
import { Bell, Search, User, Moon, Sun, Menu, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useClickOutside } from '../../hooks/useClickOutside';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const { get, patch } = useApi<any>();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const notifRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(notifRef, () => setShowNotifications(false));
  useClickOutside(profileRef, () => setShowProfileMenu(false));

  React.useEffect(() => {
    if (user) {
      get('/notifications/unread-count').then(res => res && setUnreadCount(res.data));
    }
  }, [user]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/orders?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const openNotifications = async () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
    if (!showNotifications) {
      const res = await get('/notifications?size=5');
      if (res && res.data) {
        setNotifications(res.data.content);
      }
    }
  };

  const markAllRead = async () => {
    await patch('/notifications/read-all', {});
    setUnreadCount(0);
    setNotifications(notifications.map(n => ({...n, read: true})));
  };

  return (
    <header className="h-[72px] flex items-center justify-between px-4 md:px-8 z-10 glass-panel !rounded-none !border-t-0 !border-r-0 !border-l-0 w-full shrink-0">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-text-secondary hover:text-text-primary p-2"
        >
          <Menu size={24} />
        </button>
        
        <div className="relative w-full max-w-[400px] hidden sm:block">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search orders, drivers, or customers... (Press Enter)" 
            className="w-full py-2.5 pr-4 pl-10 bg-bg-secondary border border-border-color rounded-full text-text-primary text-sm transition-all duration-200 outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-light placeholder:text-text-muted"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button 
          onClick={toggleTheme}
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-text-secondary transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative" ref={notifRef}>
          <button 
            onClick={openNotifications}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-text-secondary transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-status-danger rounded-full ring-2 ring-bg-primary"></span>}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-bg-secondary border border-border-color rounded-xl shadow-lg overflow-hidden z-50">
              <div className="p-4 border-b border-border-color flex justify-between items-center bg-bg-tertiary">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-accent-primary hover:underline flex items-center gap-1">
                    <Check size={12} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? notifications.map(n => (
                  <div key={n.id} className={`p-4 border-b border-border-color text-sm ${!n.read ? 'bg-bg-primary' : 'bg-bg-secondary opacity-70'}`}>
                    <p className="text-text-primary font-medium mb-1">{n.title}</p>
                    <p className="text-text-secondary text-xs">{n.message}</p>
                  </div>
                )) : (
                  <div className="p-6 text-center text-text-muted text-sm">No new notifications</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => {setShowProfileMenu(!showProfileMenu); setShowNotifications(false);}}
            className="flex items-center gap-3 cursor-pointer p-1 pl-2 rounded-md transition-colors duration-200 hover:bg-bg-tertiary border border-transparent hover:border-border-color"
          >
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-medium text-text-primary">
                {user ? `${user.firstName} ${user.lastName}`.trim() : 'Admin'}
              </span>
              <span className="text-xs text-text-muted">{user?.role || 'User'}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-accent-light text-accent-primary flex items-center justify-center shrink-0">
              <User size={18} />
            </div>
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border-color rounded-xl shadow-lg overflow-hidden z-50 py-1">
              <button 
                onClick={() => navigate('/settings')}
                className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-tertiary transition-colors"
              >
                Account Settings
              </button>
              <div className="h-px bg-border-color my-1"></div>
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-status-danger hover:bg-status-danger/10 transition-colors"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
