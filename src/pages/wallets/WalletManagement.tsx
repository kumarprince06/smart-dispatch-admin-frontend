import React, { useState, useEffect } from 'react';
import { WalletLedgerTable } from '../../components/wallets/WalletLedgerTable';
import { RefreshCw, Wallet, ArrowUpCircle, ArrowDownCircle, RotateCcw } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { useApi } from '../../hooks/useApi';

export const WalletManagement: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { get: getRevenue, data: revenue, isLoading } = useApi<any>();

  useEffect(() => {
    getRevenue('/payments/stats/revenue');
  }, []);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    getRevenue('/payments/stats/revenue');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Wallet Ledger</h1>
          <p className="text-text-secondary mt-1">Audit trail for all double-entry wallet transactions across the platform.</p>
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

      {isLoading && !revenue ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-bg-secondary rounded-2xl animate-pulse border border-border-color"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Platform Revenue"
            value={`₹${Number(revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={<Wallet size={24} />}
            bgClass="bg-accent-primary/10"
            textClass="text-accent-primary"
            subtitle="All successful transactions"
          />
          <StatCard
            title="Top-ups"
            value="—"
            icon={<ArrowUpCircle size={24} />}
            bgClass="bg-status-success/10"
            textClass="text-status-success"
            subtitle="Wallet credits"
          />
          <StatCard
            title="Payments"
            value="—"
            icon={<ArrowDownCircle size={24} />}
            bgClass="bg-status-warning/10"
            textClass="text-status-warning"
            subtitle="Wallet debits"
          />
          <StatCard
            title="Refunds"
            value="—"
            icon={<RotateCcw size={24} />}
            bgClass="bg-status-info/10"
            textClass="text-status-info"
            subtitle="Reversed transactions"
          />
        </div>
      )}

      <WalletLedgerTable refreshTrigger={refreshTrigger} />
    </div>
  );
};
