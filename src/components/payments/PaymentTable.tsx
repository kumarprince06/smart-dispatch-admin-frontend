import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import type { PaymentResponse, PaginatedPaymentResponse } from '../../types/payment';
import { Filter, CreditCard, AlertCircle, CheckCircle, Clock, Undo2 } from 'lucide-react';

interface PaymentTableProps {
  refreshTrigger?: number;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({ refreshTrigger = 0 }) => {
  const { get, isLoading, data } = useApi<PaginatedPaymentResponse>();
  const { post: refundPayment, isLoading: isRefunding } = useApi<PaymentResponse>();
  
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchPayments = () => {
    let url = `/payments/admin/all?page=${page}&size=10`;
    if (statusFilter) url += `&status=${statusFilter}`;
    get(url);
  };

  useEffect(() => {
    fetchPayments();
  }, [page, statusFilter, refreshTrigger]);

  const handleRefund = async (orderId: number) => {
    if (window.confirm('Are you sure you want to refund this payment? This action cannot be undone.')) {
      await refundPayment(`/payments/${orderId}/refund`, {});
      fetchPayments();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-status-success/10 text-status-success border-status-success/30';
      case 'FAILED': return 'bg-status-danger/10 text-status-danger border-status-danger/30';
      case 'REFUNDED': return 'bg-text-muted/10 text-text-muted border-border-color';
      case 'PENDING': 
      case 'PROCESSING': 
      case 'INITIATED': return 'bg-status-warning/10 text-status-warning border-status-warning/30';
      default: return 'bg-bg-tertiary text-text-primary border-border-color';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle size={14} />;
      case 'FAILED': return <AlertCircle size={14} />;
      case 'REFUNDED': return <Undo2 size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-border-color flex flex-col sm:flex-row gap-4 justify-between items-center bg-bg-tertiary/30">
        <div className="flex items-center gap-2">
          <CreditCard className="text-accent-primary" size={20} />
          <h2 className="font-semibold text-text-primary">All Transactions</h2>
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
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending / Processing</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-tertiary border-b border-border-color">
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Order / Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Method</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
                    <p>Loading transactions...</p>
                  </div>
                </td>
              </tr>
            ) : data?.content && data.content.length > 0 ? (
              data.content.map((payment) => (
                <tr key={payment.paymentId} className="hover:bg-bg-tertiary/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm font-medium text-text-primary">{payment.transactionId}</div>
                    {payment.providerTransactionId && (
                      <div className="text-xs text-text-muted mt-0.5">Ref: {payment.providerTransactionId}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-text-primary">₹{payment.amount.toFixed(2)}</div>
                    <div className="text-xs text-accent-primary font-mono mt-0.5">Order #{payment.orderId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-secondary bg-bg-tertiary px-2 py-1 rounded">
                      {payment.method.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-primary">{new Date(payment.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-text-muted">{new Date(payment.createdAt).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {payment.status === 'SUCCESS' && payment.method !== 'CASH_ON_DELIVERY' && (
                      <button 
                        onClick={() => handleRefund(payment.orderId)}
                        disabled={isRefunding}
                        className="text-xs font-medium bg-status-danger/10 text-status-danger px-3 py-1.5 rounded-lg hover:bg-status-danger/20 transition-colors disabled:opacity-50"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center text-text-muted mb-2">
                      <CreditCard size={32} opacity={0.5} />
                    </div>
                    <p className="text-lg font-medium text-text-primary">No transactions found</p>
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
    </div>
  );
};
