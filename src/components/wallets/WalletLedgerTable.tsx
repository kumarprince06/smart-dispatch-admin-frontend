import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import type { PaginatedLedgerResponse } from '../../types/wallet';
import { Wallet, ArrowUpRight, ArrowDownLeft, Receipt, History } from 'lucide-react';

interface WalletLedgerTableProps {
  refreshTrigger?: number;
}

export const WalletLedgerTable: React.FC<WalletLedgerTableProps> = ({ refreshTrigger = 0 }) => {
  const { get, isLoading, data } = useApi<PaginatedLedgerResponse>();
  const [page, setPage] = useState(0);

  const fetchLedger = () => {
    get(`/payments/admin/ledger?page=${page}&size=15`);
  };

  useEffect(() => {
    fetchLedger();
  }, [page, refreshTrigger]);

  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-border-color flex items-center gap-2 bg-bg-tertiary/30">
        <Wallet className="text-accent-primary" size={20} />
        <h2 className="font-semibold text-text-primary">Global Wallet Ledger</h2>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-tertiary border-b border-border-color">
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">User ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Type / Source</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
                    <p>Loading ledger entries...</p>
                  </div>
                </td>
              </tr>
            ) : data?.content && data.content.length > 0 ? (
              data.content.map((entry) => (
                <tr key={entry.id} className="hover:bg-bg-tertiary/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-primary">{new Date(entry.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-text-muted">{new Date(entry.createdAt).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-text-secondary">#{entry.userId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                        entry.type === 'CREDIT' ? 'bg-status-success/10 text-status-success' : 'bg-status-danger/10 text-status-danger'
                      }`}>
                        {entry.type === 'CREDIT' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                      </span>
                      <div>
                        <div className={`text-sm font-medium ${entry.type === 'CREDIT' ? 'text-status-success' : 'text-status-danger'}`}>
                          {entry.type}
                        </div>
                        <div className="text-xs text-text-muted uppercase tracking-wide">{entry.source.replace(/_/g, ' ')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-primary">{entry.description || '-'}</div>
                    {entry.referenceId && (
                      <div className="text-xs text-text-muted font-mono mt-0.5 flex items-center gap-1">
                        <Receipt size={12} /> Ref: {entry.referenceId}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`font-bold text-lg ${entry.type === 'CREDIT' ? 'text-status-success' : 'text-text-primary'}`}>
                      {entry.type === 'CREDIT' ? '+' : '-'}₹{entry.amount.toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center text-text-muted mb-2">
                      <History size={32} opacity={0.5} />
                    </div>
                    <p className="text-lg font-medium text-text-primary">No ledger entries found</p>
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
            Showing page <span className="font-medium text-text-primary">{page + 1}</span> of{' '}
            <span className="font-medium text-text-primary">{data.totalPages}</span>
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
