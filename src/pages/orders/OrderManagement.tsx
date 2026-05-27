import React, { useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import type { OrderStatsResponse } from '../../types/order';
import { Package, Truck, CheckCircle, AlertTriangle, ListOrdered, Navigation, Clock } from 'lucide-react';
import { OrderTable } from '../../components/orders/OrderTable';

export const OrderManagement: React.FC = () => {
  const { get, data: stats, isLoading } = useApi<OrderStatsResponse>();

  useEffect(() => {
    get('/orders/stats');
  }, []);

  const StatCard = ({ title, value, icon, bgClass, textClass, subtitle }: any) => (
    <div className="bg-bg-secondary p-6 rounded-2xl border border-border-color shadow-sm relative overflow-hidden group hover:border-accent-primary/50 transition-colors">
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">{title}</p>
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
          <h1 className="text-2xl font-bold text-text-primary">Order Management</h1>
          <p className="text-text-secondary mt-1">Track live deliveries, assign drivers, and manage active dispatching.</p>
        </div>
      </div>

      {isLoading && !stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-bg-secondary h-32 rounded-2xl border border-border-color animate-pulse" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Orders" 
            value={stats.totalOrders || 0} 
            icon={<ListOrdered size={24} />} 
            bgClass="bg-accent-primary/10"
            textClass="text-accent-primary"
            subtitle="All time platform orders"
          />
          <StatCard 
            title="Active / Unassigned" 
            value={stats.createdOrders || 0} 
            icon={<Clock size={24} />} 
            bgClass="bg-status-warning/10"
            textClass="text-status-warning"
            subtitle="Requires immediate dispatch"
          />
          <StatCard 
            title="In Transit" 
            value={(stats.pickedUpOrders || 0) + (stats.inTransitOrders || 0)} 
            icon={<Navigation size={24} />} 
            bgClass="bg-status-info/10"
            textClass="text-status-info"
            subtitle="Currently on the road"
          />
          <StatCard 
            title="Successfully Delivered" 
            value={stats.deliveredOrders || 0} 
            icon={<CheckCircle size={24} />} 
            bgClass="bg-status-success/10"
            textClass="text-status-success"
            subtitle="Completed lifecycle"
          />
        </div>
      ) : (
        <div className="p-6 bg-status-danger/10 border border-status-danger/20 rounded-xl text-status-danger flex items-center gap-3">
          <AlertTriangle size={20} />
          <p>Failed to load order statistics. Please try again.</p>
        </div>
      )}

      <OrderTable />
    </div>
  );
};
