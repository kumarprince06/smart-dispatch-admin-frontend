import React, { useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import type { OrderStatsResponse } from '../../types/order';
import { CheckCircle, AlertTriangle, ListOrdered, Navigation, Clock } from 'lucide-react';
import { OrderTable } from '../../components/orders/OrderTable';
import { StatCard } from '../../components/common/StatCard';

export const OrderManagement: React.FC = () => {
  const { get, data: stats, isLoading } = useApi<OrderStatsResponse>();

  useEffect(() => {
    get('/orders/stats');
  }, []);


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
