import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import type { DriverResponse, PaginatedResponse, DriverStatus, VerificationStatus } from '../../types/driver';
import { Search, Filter, MoreVertical, Eye, ShieldCheck, ShieldAlert, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { DriverDetailsModal } from './DriverDetailsModal';

export const DriverTable: React.FC = () => {
  const { get, isLoading, data } = useApi<PaginatedResponse<DriverResponse>>();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const { patch, isLoading: isPatching } = useApi<DriverResponse>();
  const [selectedDriver, setSelectedDriver] = useState<DriverResponse | null>(null);
  
  const fetchDrivers = () => {
    let url = `/drivers?page=${page}&size=10&sortBy=createdAt&sortDir=desc`;
    if (search) url += `&search=${search}`;
    if (statusFilter) url += `&status=${statusFilter}`;
    
    get(url);
  };

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchDrivers();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search, statusFilter]);

  const handleVerify = async (id: number, status: VerificationStatus, reason?: string) => {
    let url = `/drivers/${id}/verify?status=${status}`;
    if (reason) url += `&rejectionReason=${encodeURIComponent(reason)}`;
    
    await patch(url);
    setSelectedDriver(null);
    fetchDrivers();
  };

  const handleStatusUpdate = async (id: number, status: DriverStatus) => {
    await patch(`/drivers/${id}/status`, { status });
    setSelectedDriver(null);
    fetchDrivers();
  };

  const getStatusColor = (status: DriverStatus) => {
    switch (status) {
      case 'ONLINE': return 'text-status-success bg-status-success/10 border-status-success/20';
      case 'OFFLINE': return 'text-text-muted bg-bg-tertiary border-border-color';
      case 'ON_DELIVERY': return 'text-status-info bg-status-info/10 border-status-info/20';
      case 'BUSY': return 'text-status-warning bg-status-warning/10 border-status-warning/20';
      case 'SUSPENDED': return 'text-status-danger bg-status-danger/10 border-status-danger/20';
      default: return 'text-text-secondary bg-bg-tertiary border-border-color';
    }
  };

  const getVerificationIcon = (status: VerificationStatus) => {
    switch (status) {
      case 'VERIFIED': return <ShieldCheck size={16} className="text-status-success" />;
      case 'REJECTED': return <ShieldAlert size={16} className="text-status-danger" />;
      case 'PENDING': return <ShieldAlert size={16} className="text-status-warning" />;
      default: return null;
    }
  };

  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Table Header & Filters */}
      <div className="p-6 border-b border-border-color flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-semibold text-text-primary">Driver Roster</h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by name, email, or vehicle..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full bg-bg-primary border border-border-color rounded-lg py-2 pl-9 pr-4 text-sm text-text-primary outline-none focus:border-accent-primary transition-colors placeholder:text-text-muted"
            />
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="w-full sm:w-auto appearance-none bg-bg-primary border border-border-color rounded-lg py-2 pl-9 pr-8 text-sm text-text-primary outline-none focus:border-accent-primary transition-colors cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
              <option value="ON_DELIVERY">On Delivery</option>
              <option value="BUSY">Busy</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-tertiary/50 border-b border-border-color text-xs uppercase tracking-wider text-text-secondary font-medium">
              <th className="px-6 py-4">Driver</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Verification</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {isLoading && !data ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                  <div className="flex justify-center mb-2">
                    <div className="w-6 h-6 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin"></div>
                  </div>
                  Loading drivers...
                </td>
              </tr>
            ) : data?.content && data.content.length > 0 ? (
              data.content.map((driver) => (
                <tr key={driver.id} className="hover:bg-bg-tertiary/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-bg-primary border border-border-color flex items-center justify-center overflow-hidden shrink-0">
                        {driver.profilePictureUrl ? (
                          <img src={driver.profilePictureUrl} alt={driver.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <User size={18} className="text-text-muted" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                          {driver.firstName} {driver.lastName}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">Tier: {driver.tier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-text-primary">{driver.phoneNumber}</p>
                    <p className="text-xs text-text-muted mt-0.5">{driver.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-text-primary">{driver.vehicleType}</p>
                    <p className="text-xs text-text-muted mt-0.5">{driver.vehicleNumber || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(driver.status)}`}>
                      {driver.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getVerificationIcon(driver.verificationStatus)}
                      <span className="text-sm text-text-primary capitalize">{driver.verificationStatus.toLowerCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedDriver(driver)}
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
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                  No drivers found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border-color flex items-center justify-between bg-bg-tertiary/30">
          <p className="text-sm text-text-secondary">
            Showing <span className="font-medium text-text-primary">{data.pageable.offset + 1}</span> to <span className="font-medium text-text-primary">{Math.min(data.pageable.offset + data.size, data.totalElements)}</span> of <span className="font-medium text-text-primary">{data.totalElements}</span> drivers
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={data.first}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              className="p-1.5 rounded-lg border border-border-color text-text-secondary hover:bg-bg-tertiary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={data.last}
              onClick={() => setPage(p => p + 1)}
              className="p-1.5 rounded-lg border border-border-color text-text-secondary hover:bg-bg-tertiary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Details & Action Modal */}
      {selectedDriver && (
        <DriverDetailsModal 
          driver={selectedDriver} 
          onClose={() => setSelectedDriver(null)}
          onVerify={handleVerify}
          onUpdateStatus={handleStatusUpdate}
          isSubmitting={isPatching}
        />
      )}
    </div>
  );
};
