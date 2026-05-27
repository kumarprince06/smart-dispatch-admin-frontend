import React, { useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { DriverStatsResponse } from '../../types/driver';
import { Users, UserCheck, Clock, AlertTriangle, Activity } from 'lucide-react';

export const DriverManagement: React.FC = () => {
  const { get, data: stats, isLoading } = useApi<DriverStatsResponse>();

  useEffect(() => {
    get('/drivers/stats');
  }, []);

  const StatCard = ({ title, value, icon, colorClass, subtitle }: { title: string, value: number | string, icon: React.ReactNode, colorClass: string, subtitle?: string }) => (
    <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ease-out ${colorClass}`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-text-primary">{value}</h3>
          {subtitle && <p className="text-xs text-text-muted mt-2">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-current`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Driver Management</h1>
          <p className="text-text-secondary mt-1">Manage your fleet, approve drivers, and monitor real-time status.</p>
        </div>
        <button className="px-4 py-2 bg-accent-primary hover:bg-accent-hover text-white rounded-xl text-sm font-semibold shadow-md transition-all active:scale-95 flex items-center gap-2">
          <Users size={16} />
          Onboard Driver
        </button>
      </div>

      {isLoading && !stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-bg-secondary rounded-2xl animate-pulse border border-border-color"></div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Drivers" 
            value={stats.totalDrivers || 0} 
            icon={<Users className="text-accent-primary" size={24} />} 
            colorClass="bg-accent-primary"
            subtitle={`${stats.activeDrivers || stats.totalDrivers} active on platform`}
          />
          <StatCard 
            title="Online & Available" 
            value={stats.availableDrivers || 0} 
            icon={<Activity className="text-status-success" size={24} />} 
            colorClass="bg-status-success"
            subtitle={`${stats.onlineDrivers || 0} total online`}
          />
          <StatCard 
            title="On Delivery / Busy" 
            value={(stats.onDeliveryDrivers || 0) + (stats.busyDrivers || 0)} 
            icon={<Clock className="text-status-warning" size={24} />} 
            colorClass="bg-status-warning"
            subtitle="Currently handling orders"
          />
          <StatCard 
            title="Pending Verification" 
            value={stats.pendingVerification || 0} 
            icon={<UserCheck className="text-status-info" size={24} />} 
            colorClass="bg-status-info"
            subtitle="Action required by admin"
          />
        </div>
      ) : (
        <div className="p-6 bg-status-danger/10 border border-status-danger/20 rounded-xl text-status-danger flex items-center gap-3">
          <AlertTriangle size={20} />
          <p>Failed to load driver statistics. Please try again.</p>
        </div>
      )}

      {/* Placeholder for the table which we will build in the next step */}
      <div className="bg-bg-secondary border border-border-color rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <Users size={48} className="text-text-muted mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-text-primary mb-2">Driver Roster Loading...</h3>
        <p className="text-text-secondary max-w-md">The comprehensive driver table with filtering and pagination will be implemented in the next iteration.</p>
      </div>
    </div>
  );
};
