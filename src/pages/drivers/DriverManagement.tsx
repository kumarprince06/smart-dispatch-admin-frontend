import React, { useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import type { DriverStatsResponse } from '../../types/driver';
import { Users, UserCheck, Clock, AlertTriangle, Activity } from 'lucide-react';
import { DriverTable } from '../../components/drivers/DriverTable';
import { OnboardDriverModal } from '../../components/drivers/OnboardDriverModal';

export const DriverManagement: React.FC = () => {
  const { get, data: stats, isLoading } = useApi<DriverStatsResponse>();
  const [showOnboardModal, setShowOnboardModal] = React.useState(false);

  useEffect(() => {
    get('/drivers/stats');
  }, []);

  const StatCard = ({ title, value, icon, bgClass, textClass, subtitle }: { title: string, value: number | string, icon: React.ReactNode, bgClass: string, textClass: string, subtitle?: string }) => (
    <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-500 ease-out ${bgClass.split('/')[0]}`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-text-primary">{value}</h3>
          {subtitle && <p className="text-xs text-text-muted mt-2">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${bgClass} ${textClass}`}>
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
        <button 
          onClick={() => setShowOnboardModal(true)}
          className="px-4 py-2 bg-accent-primary hover:bg-accent-hover text-white rounded-xl text-sm font-semibold shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
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
            icon={<Users size={24} />} 
            bgClass="bg-accent-primary/10"
            textClass="text-accent-primary"
            subtitle={`${stats.verifiedDrivers || 0} verified drivers on platform`}
          />
          <StatCard 
            title="Online & Available" 
            value={stats.availableDrivers || 0} 
            icon={<Activity size={24} />} 
            bgClass="bg-status-success/10"
            textClass="text-status-success"
            subtitle={`${stats.onlineDrivers || 0} total online`}
          />
          <StatCard 
            title="On Delivery / Busy" 
            value={(stats.onDeliveryDrivers || 0) + (stats.busyDrivers || 0)} 
            icon={<Clock size={24} />} 
            bgClass="bg-status-warning/10"
            textClass="text-status-warning"
            subtitle="Currently handling orders"
          />
          <StatCard 
            title="Pending Verification" 
            value={stats.pendingVerification || 0} 
            icon={<UserCheck size={24} />} 
            bgClass="bg-status-info/10"
            textClass="text-status-info"
            subtitle="Action required by admin"
          />
        </div>
      ) : (
        <div className="p-6 bg-status-danger/10 border border-status-danger/20 rounded-xl text-status-danger flex items-center gap-3">
          <AlertTriangle size={20} />
          <p>Failed to load driver statistics. Please try again.</p>
        </div>
      )}

      <DriverTable />

      {showOnboardModal && (
        <OnboardDriverModal 
          onClose={() => setShowOnboardModal(false)} 
          onSuccess={() => {
            setShowOnboardModal(false);
            get('/drivers/stats');
            // We should ideally reload the table too.
            // In a real app we might use a global store or context to trigger a table refresh.
            // For now, refreshing the stats is a good indicator of success.
          }} 
        />
      )}
    </div>
  );
};
