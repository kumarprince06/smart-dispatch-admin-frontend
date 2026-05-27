import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import type { OrderResponse, PaginatedOrderResponse, OrderStatus } from '../../types/order';
import { Search, Filter, Eye, MapPin, Navigation, Clock, CheckCircle, Package } from 'lucide-react';
import { OrderDetailsModal } from './OrderDetailsModal';
import { useSearchParams } from 'react-router-dom';

interface OrderTableProps {
  refreshTrigger?: number;
}

export const OrderTable: React.FC<OrderTableProps> = ({ refreshTrigger = 0 }) => {
  const { get, isLoading, data } = useApi<PaginatedOrderResponse>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

  // Sync search state to URL param on change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
    const params: Record<string, string> = {};
    if (value) params['search'] = value;
    setSearchParams(params, { replace: true });
  };

  const fetchOrders = () => {
    let url = `/orders?page=${page}&size=10&sortBy=createdAt&sortDir=desc`;
    if (search) url += `&search=${search}`;
    if (statusFilter) url += `&status=${statusFilter}`;
    
    get(url);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search, statusFilter, refreshTrigger]);

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED': return 'text-status-success bg-status-success/10 border-status-success/20';
      case 'CANCELLED': 
      case 'FAILED': return 'text-status-danger bg-status-danger/10 border-status-danger/20';
      case 'IN_TRANSIT':
      case 'PICKED_UP': return 'text-status-info bg-status-info/10 border-status-info/20';
      case 'ASSIGNED': return 'text-status-warning bg-status-warning/10 border-status-warning/20';
      default: return 'text-text-muted bg-bg-tertiary border-border-color'; // CREATED
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden shadow-sm">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-border-color flex flex-col sm:flex-row gap-4 justify-between items-center bg-bg-tertiary/30">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search by Tracking ID, Customer..." 
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-bg-primary border border-border-color rounded-xl pl-10 pr-4 py-2 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-bg-primary border border-border-color rounded-xl pl-9 pr-4 py-2 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="CREATED">Pending Dispatch</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="PICKED_UP">Picked Up</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-tertiary border-b border-border-color">
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Tracking / Info</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Route</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Driver</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Price / Dist</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
                    Loading orders...
                  </div>
                </td>
              </tr>
            ) : !data || data.content.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                  <Package className="mx-auto mb-3 opacity-20" size={48} />
                  <p>No orders found matching your criteria.</p>
                </td>
              </tr>
            ) : (
              data.content.map((order) => (
                <tr key={order.orderId} className="hover:bg-bg-tertiary/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-sm font-semibold text-accent-primary">{order.trackingNumber}</span>
                      <span className="text-sm font-medium text-text-primary mt-1">{order.customerName}</span>
                      <span className="text-xs text-text-muted">{order.packageType.replace('_', ' ')} • {order.packageWeightKg}kg</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-[200px]">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-status-warning mt-0.5 shrink-0" />
                        <span className="text-xs text-text-secondary truncate" title={order.pickupAddress}>{order.pickupAddress}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Navigation size={14} className="text-status-success mt-0.5 shrink-0" />
                        <span className="text-xs text-text-secondary truncate" title={order.dropAddress}>{order.dropAddress}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {order.driverId ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary">{order.driverName}</span>
                        <span className="text-xs text-text-muted">{order.vehicleNumber}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-text-muted italic bg-bg-tertiary px-2 py-1 rounded">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-text-primary">{formatCurrency(order.deliveryFee)}</span>
                      <span className="text-xs text-text-muted">{order.distanceKm.toFixed(1)} km</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusStyle(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-colors inline-flex items-center justify-center"
                    >
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors inline-flex items-center justify-center ml-1">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="p-4 border-t border-border-color flex items-center justify-between bg-bg-tertiary/30">
          <p className="text-sm text-text-muted">
            Showing <span className="font-medium text-text-primary">{page * 10 + 1}</span> to <span className="font-medium text-text-primary">{Math.min((page + 1) * 10, data.totalElements)}</span> of <span className="font-medium text-text-primary">{data.totalElements}</span> results
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 rounded-lg border border-border-color bg-bg-primary text-text-secondary hover:text-text-primary hover:bg-bg-tertiary disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
              disabled={page === data.totalPages - 1}
              className="p-2 rounded-lg border border-border-color bg-bg-primary text-text-secondary hover:text-text-primary hover:bg-bg-tertiary disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};
