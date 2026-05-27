import React, { useState, useEffect } from 'react';
import { CustomerTable } from '../../components/customers/CustomerTable';
import { RefreshCw, Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { useApi } from '../../hooks/useApi';

export const CustomerManagement: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { get, data: stats, isLoading } = useApi<any>();

  useEffect(() => {
    get('/admin/customers/stats');
  }, []);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    get('/admin/customers/stats');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Customer Management</h1>
          <p className="text-text-secondary mt-1">View customer profiles, engagement metrics, and manage access.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-bg-secondary border border-border-color rounded-xl hover:bg-bg-tertiary transition-all duration-200 text-sm font-medium text-text-primary shadow-sm"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {isLoading && !stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-bg-secondary rounded-2xl animate-pulse border border-border-color"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Customers"
            value={stats?.totalCustomers || 0}
            icon={<Users size={24} />}
            bgClass="bg-accent-primary/10"
            textClass="text-accent-primary"
            subtitle="Registered on platform"
          />
          <StatCard
            title="Active"
            value={stats?.activeCustomers || 0}
            icon={<UserCheck size={24} />}
            bgClass="bg-status-success/10"
            textClass="text-status-success"
            subtitle="Currently active accounts"
          />
          <StatCard
            title="Suspended"
            value={stats?.suspendedCustomers || 0}
            icon={<UserX size={24} />}
            bgClass="bg-status-danger/10"
            textClass="text-status-danger"
            subtitle="Access restricted"
          />
          <StatCard
            title="New This Week"
            value={stats?.newThisWeek || 0}
            icon={<TrendingUp size={24} />}
            bgClass="bg-status-info/10"
            textClass="text-status-info"
            subtitle="Registered in last 7 days"
          />
        </div>
      )}

      <CustomerTable refreshTrigger={refreshTrigger} />
    </div>
  );
};
