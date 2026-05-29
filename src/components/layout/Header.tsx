import React from 'react';
import { Bell, Search, User, Moon, Sun, Menu, Check, Package, Car, Users, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useClickOutside } from '../../hooks/useClickOutside';

interface HeaderProps {
  onMenuClick: () => void;
}

interface SearchResult {
  type: 'order' | 'driver' | 'customer';
  id: number | string;
  title: string;
  subtitle: string;
  route: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const { request, get, patch } = useApi<any>();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showSearchResults, setShowSearchResults] = React.useState(false);

  const [unreadCount, setUnreadCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const searchRef = React.useRef<HTMLElement>(null);
  const notifRef = React.useRef<HTMLElement>(null);
  const profileRef = React.useRef<HTMLElement>(null);

  useClickOutside(searchRef, () => { setShowSearchResults(false); });
  useClickOutside(notifRef, () => setShowNotifications(false));
  useClickOutside(profileRef, () => setShowProfileMenu(false));

  React.useEffect(() => {
    if (user) {
      get('/notifications/unread-count').then(res => res && setUnreadCount(res.data));
    }
  }, [user]);

  // Debounced global search across all modules
  React.useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setShowSearchResults(true);

      const q = encodeURIComponent(searchQuery);
      const results: SearchResult[] = [];

      // Fire all 3 searches in parallel
      const [ordersRes, driversRes, customersRes] = await Promise.allSettled([
        request({ method: 'GET', url: `/orders?search=${q}&page=0&size=3` }),
        request({ method: 'GET', url: `/drivers?search=${q}&page=0&size=3` }),
        request({ method: 'GET', url: `/admin/customers?search=${q}&page=0&size=3` }),
      ]);

      if (ordersRes.status === 'fulfilled' && ordersRes.value?.data?.content) {
        ordersRes.value.data.content.forEach((o: any) => {
          results.push({
            type: 'order',
            id: o.id,
            title: `Order #${o.trackingId || o.id}`,
            subtitle: `${o.status} • ${o.pickupAddress?.substring(0, 40) || 'No address'}`,
            route: '/orders',
          });
        });
      }

      if (driversRes.status === 'fulfilled' && driversRes.value?.data?.content) {
        driversRes.value.data.content.forEach((d: any) => {
          results.push({
            type: 'driver',
            id: d.id,
            title: `${d.firstName} ${d.lastName}`,
            subtitle: `Driver • ${d.vehicleNumber || 'No vehicle'} • ${d.status || ''}`,
            route: '/drivers',
          });
        });
      }

      if (customersRes.status === 'fulfilled' && customersRes.value?.data?.content) {
        customersRes.value.data.content.forEach((c: any) => {
          results.push({
            type: 'customer',
            id: c.id,
            title: `${c.firstName} ${c.lastName}`,
            subtitle: `Customer • ${c.email}`,
            route: '/customers',
          });
        });
      }

      setSearchResults(results);
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectResult = (result: SearchResult) => {
    navigate(`${result.route}?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const getResultIcon = (type: SearchResult['type']) => {
    if (type === 'order') return <Package size={16} className="text-accent-primary" />;
    if (type === 'driver') return <Car size={16} className="text-status-info" />;
    return <Users size={16} className="text-status-success" />;
  };

  const getTypeBadge = (type: SearchResult['type']) => {
    const map = {
      order: 'bg-accent-primary/10 text-accent-primary',
      driver: 'bg-status-info/10 text-status-info',
      customer: 'bg-status-success/10 text-status-success',
    };
    return map[type];
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
        
        {/* Global Search */}
        <div className="relative w-full max-w-[440px] hidden sm:block" ref={searchRef}>
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted z-10" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
            placeholder="Search orders, drivers, customers..." 
            className="w-full py-2.5 pr-8 pl-10 bg-bg-secondary border border-border-color rounded-full text-text-primary text-sm transition-all duration-200 outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-light placeholder:text-text-muted"
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X size={14} />
            </button>
          )}

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-bg-secondary border border-border-color rounded-2xl shadow-2xl overflow-hidden z-50">
              {isSearching ? (
                <div className="p-4 flex items-center gap-3 text-sm text-text-muted">
                  <div className="w-4 h-4 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
                  Searching across all modules...
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="px-4 py-2 border-b border-border-color bg-bg-tertiary/50">
                    <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                    </span>
                  </div>
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectResult(result)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-tertiary transition-colors text-left border-b border-border-color/50 last:border-0"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeBadge(result.type)}`}>
                        {getResultIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{result.title}</p>
                        <p className="text-xs text-text-muted truncate">{result.subtitle}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getTypeBadge(result.type)}`}>
                        {result.type}
                      </span>
                    </button>
                  ))}
                  <div className="px-4 py-2 bg-bg-tertiary/30 border-t border-border-color">
                    <p className="text-xs text-text-muted">Click a result to jump to that module</p>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center">
                  <Search size={24} className="mx-auto text-text-muted opacity-40 mb-2" />
                  <p className="text-sm text-text-muted">No results for "<strong className="text-text-primary">{searchQuery}</strong>"</p>
                  <p className="text-xs text-text-muted mt-1">Try a tracking ID, driver name, or email</p>
                </div>
              )}
            </div>
          )}
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
