import React from 'react';
import { Bell, Search, User, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/useAuthStore';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const user = useAuthStore(state => state.user);

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
            placeholder="Search orders, drivers, or customers..." 
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

        <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-text-secondary transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-status-danger rounded-full ring-2 ring-bg-primary"></span>
        </button>
        
        <div className="flex items-center gap-3 cursor-pointer p-1 pl-2 rounded-md transition-colors duration-200 hover:bg-bg-tertiary border border-transparent hover:border-border-color">
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
      </div>
    </header>
  );
};
