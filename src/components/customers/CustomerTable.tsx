import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import type { CustomerResponse, PaginatedCustomerResponse } from '../../types/customer';
import { Search, Filter, Eye, MapPin, User, Activity, AlertCircle, ShoppingBag, ShieldCheck, BanIcon } from 'lucide-react';
import { CustomerDetailsModal } from './CustomerDetailsModal';
import { ConfirmModal } from '../common/ConfirmModal';

interface CustomerTableProps {
  refreshTrigger?: number;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ refreshTrigger = 0 }) => {
  const { get, isLoading, data } = useApi<PaginatedCustomerResponse>();
  const { patch } = useApi<CustomerResponse>();
  
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{ customer: CustomerResponse } | null>(null);

  const fetchCustomers = () => {
    let url = `/admin/customers?page=${page}&size=10&sortBy=createdAt&sortDir=desc`;
    if (search) url += `&search=${search}`;
    if (statusFilter) url += `&status=${statusFilter}`;
    
    get(url);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search, statusFilter, refreshTrigger]);

  const toggleCustomerStatus = async (customerId: number, currentStatus: boolean) => {
    await patch(`/admin/customers/${customerId}/status?active=${!currentStatus}`);
    fetchCustomers();
    setConfirmTarget(null);
  };

  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-border-color flex flex-col sm:flex-row gap-4 justify-between items-center bg-bg-tertiary/30">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search by Name, Email, or Phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full bg-bg-primary border border-border-color rounded-xl pl-10 pr-4 py-2 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="w-full bg-bg-primary border border-border-color rounded-xl pl-9 pr-4 py-2 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-tertiary border-b border-border-color">
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Engagement</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
                    <p>Loading customers...</p>
                  </div>
                </td>
              </tr>
            ) : data?.content && data.content.length > 0 ? (
              data.content.map((customer) => (
                <tr key={customer.id} className="hover:bg-bg-tertiary/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary flex-shrink-0 overflow-hidden">
                        {customer.profilePictureUrl ? (
                          <img src={customer.profilePictureUrl} alt={customer.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary flex items-center gap-1.5">
                          {customer.firstName} {customer.lastName}
                          {customer.emailVerified && <ShieldCheck size={14} className="text-status-success" />}
                        </div>
                        <div className="text-sm text-text-secondary">{customer.email}</div>
                        {customer.phoneNo && <div className="text-xs text-text-muted mt-0.5">{customer.phoneNo}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                      <MapPin size={16} className="text-text-muted flex-shrink-0" />
                      <span>{customer.city ? `${customer.city}, ${customer.state || ''}` : 'No location added'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm">
                        <ShoppingBag size={14} className="text-accent-primary" />
                        <span className="font-medium text-text-primary">{customer.totalOrders} Orders</span>
                      </div>
                      <div className="text-xs text-text-muted">
                        Total Spent: <span className="font-mono text-status-success">₹{customer.totalSpent}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      customer.active 
                        ? 'bg-status-success/10 text-status-success border-status-success/30' 
                        : 'bg-status-danger/10 text-status-danger border-status-danger/30'
                    }`}>
                      {customer.active ? <Activity size={12} /> : <AlertCircle size={12} />}
                      {customer.active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedCustomer(customer)}
                      className="p-2 text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-colors inline-flex items-center justify-center"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => setConfirmTarget({ customer })}
                      className="p-2 text-text-muted hover:text-status-danger hover:bg-status-danger/10 rounded-lg transition-colors inline-flex items-center justify-center ml-1"
                      title={customer.active ? "Suspend Customer" : "Activate Customer"}
                    >
                      <BanIcon size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center text-text-muted mb-2">
                      <User size={32} opacity={0.5} />
                    </div>
                    <p className="text-lg font-medium text-text-primary">No customers found</p>
                    <p className="text-sm">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="p-4 border-t border-border-color flex items-center justify-between bg-bg-tertiary/20">
          <p className="text-sm text-text-secondary">
            Showing <span className="font-medium text-text-primary">{page * 10 + 1}</span> to{' '}
            <span className="font-medium text-text-primary">
              {Math.min((page + 1) * 10, data.totalElements)}
            </span>{' '}
            of <span className="font-medium text-text-primary">{data.totalElements}</span> results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2 border border-border-color rounded-xl text-sm font-medium text-text-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
              disabled={page >= data.totalPages - 1}
              className="px-4 py-2 border border-border-color rounded-xl text-sm font-medium text-text-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedCustomer && (
        <CustomerDetailsModal 
          customer={selectedCustomer} 
          onClose={() => setSelectedCustomer(null)}
          onUpdate={fetchCustomers}
        />
      )}

      {confirmTarget && (
        <ConfirmModal
          title={confirmTarget.customer.active ? 'Suspend Customer' : 'Activate Customer'}
          message={`Are you sure you want to ${confirmTarget.customer.active ? 'suspend' : 'activate'} ${confirmTarget.customer.firstName} ${confirmTarget.customer.lastName}? ${confirmTarget.customer.active ? 'They will lose access to the platform.' : 'They will regain full access.'}`}
          confirmLabel={confirmTarget.customer.active ? 'Suspend' : 'Activate'}
          variant={confirmTarget.customer.active ? 'danger' : 'warning'}
          onConfirm={() => toggleCustomerStatus(confirmTarget.customer.id, confirmTarget.customer.active)}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
};
