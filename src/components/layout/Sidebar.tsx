import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Package, 
  CreditCard, 
  Wallet, 
  Map, 
  Settings,
  LogOut,
  X
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../../store/useAuthStore';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/orders', label: 'Orders', icon: Package },
  { path: '/drivers', label: 'Drivers', icon: Car },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/payments', label: 'Payments', icon: CreditCard },
  { path: '/wallets', label: 'Wallets', icon: Wallet },
  { path: '/zones', label: 'Service Zones', icon: Map },
  { path: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const logout = useAuthStore(state => state.logout);

  return (
    <aside className={clsx(
      "fixed inset-y-0 left-0 z-50 w-[260px] bg-bg-primary flex flex-col glass-panel !rounded-none !border-l-0 !border-t-0 !border-b-0 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-6 flex items-center justify-between border-b border-border-color">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="FataFat Logo" className="w-8 h-8 rounded-md shadow-sm border border-border-color shrink-0" />
          <span className="font-bold text-xl tracking-tight text-gradient whitespace-nowrap">FataFat</span>
        </div>
        <button onClick={onClose} className="lg:hidden text-text-secondary hover:text-text-primary p-1">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <nav className="flex flex-col gap-1">
          <div className="text-xs font-semibold text-text-muted tracking-wider mb-3 pl-3">MAIN MENU</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => clsx(
                'group flex items-center gap-3 p-3 rounded-md font-medium transition-all duration-200 w-full',
                isActive 
                  ? 'bg-accent-light text-accent-primary' 
                  : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
              )}
            >
              <item.icon size={20} className="transition-transform duration-200 group-hover:scale-110 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-6 border-t border-border-color shrink-0">
        <button 
          onClick={logout}
          className="group flex items-center gap-3 p-3 rounded-md font-medium transition-all duration-200 w-full text-text-secondary hover:text-status-danger hover:bg-status-danger/10"
        >
          <LogOut size={20} className="transition-transform duration-200 group-hover:scale-110 shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};
