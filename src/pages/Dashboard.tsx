import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const initialChartData = [
  { name: 'Mon', orders: 0, revenue: 0 },
  { name: 'Tue', orders: 0, revenue: 0 },
  { name: 'Wed', orders: 0, revenue: 0 },
  { name: 'Thu', orders: 0, revenue: 0 },
  { name: 'Fri', orders: 0, revenue: 0 },
  { name: 'Sat', orders: 0, revenue: 0 },
  { name: 'Sun', orders: 0, revenue: 0 },
];

export const Dashboard: React.FC = () => {
  const { get: getOrders } = useApi<any>();
  const { get: getDrivers } = useApi<any>();
  const { get: getRevenue } = useApi<any>();
  const { get: getChart } = useApi<any>();
  const { get: getAlerts } = useApi<any>();

  const [orderStats, setOrderStats] = useState<any>(null);
  const [driverStats, setDriverStats] = useState<any>(null);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>(initialChartData);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    getOrders('/orders/stats').then(res => res && setOrderStats(res.data));
    getDrivers('/drivers/stats').then(res => res && setDriverStats(res.data));
    getRevenue('/payments/stats/revenue').then(res => res && setTotalRevenue(res.data));
    getChart('/payments/stats/chart').then(res => {
      if (res && res.data && res.data.length > 0) {
        setChartData(res.data);
      }
    });
    getAlerts('/notifications?size=5').then(res => {
      if (res && res.data) {
        setAlerts(res.data.content);
      }
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
          <p className="text-sm text-text-muted">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-secondary">Download Report</button>
          <button className="btn btn-primary">Create Order</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent-primary/30">
          <div className="flex justify-between items-center text-sm font-medium text-text-secondary">
            <span>Total Revenue</span>
            <div className="p-2 rounded-md bg-accent-light text-accent-primary flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">
            ₹{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="inline-flex items-center gap-1 text-sm font-medium text-status-success">
            <span>Lifetime</span> <span className="text-text-muted font-normal">earnings</span>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent-primary/30">
          <div className="flex justify-between items-center text-sm font-medium text-text-secondary">
            <span>Active Drivers</span>
            <div className="p-2 rounded-md bg-status-info/15 text-status-info flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">
            {driverStats ? (driverStats.onlineDrivers || driverStats.totalDrivers || 0) : '...'}
          </div>
          <div className="inline-flex items-center gap-1 text-sm font-medium text-status-success">
            <span>{driverStats?.availableDrivers || 0}</span> <span className="text-text-muted font-normal">Available</span>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent-primary/30">
          <div className="flex justify-between items-center text-sm font-medium text-text-secondary">
            <span>Total Orders</span>
            <div className="p-2 rounded-md bg-status-success/15 text-status-success flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">
            {orderStats ? (orderStats.totalOrders || 0) : '...'}
          </div>
          <div className="inline-flex items-center gap-1 text-sm font-medium text-status-success">
            <span>{orderStats?.deliveredOrders || 0}</span> <span className="text-text-muted font-normal">Delivered</span>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent-primary/30">
          <div className="flex justify-between items-center text-sm font-medium text-text-secondary">
            <span>In-Transit / Delayed</span>
            <div className="p-2 rounded-md bg-status-warning/15 text-status-warning flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">
            {orderStats ? (orderStats.inTransitOrders || 0) : '...'}
          </div>
          <div className="inline-flex items-center gap-1 text-sm font-medium text-status-danger">
            <span>{orderStats?.failedOrders || 0}</span> <span className="text-text-muted font-normal">Failed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex flex-col lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6 text-text-primary">Revenue & Orders Overview</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color, rgba(255,255,255,0.08))" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131722', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px' }}
                  itemStyle={{ color: '#F3F4F6' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 text-text-primary">Recent Alerts</h3>
          <div className="flex flex-col gap-5">
            {alerts.length > 0 ? alerts.map((alert) => (
              <div key={alert.id} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-status-warning/15 text-status-warning flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={16} />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-text-secondary">{alert.message}</p>
                  <span className="text-xs text-text-muted">{new Date(alert.createdAt).toLocaleString()}</span>
                </div>
              </div>
            )) : (
              <div className="text-sm text-text-muted">No recent alerts.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
