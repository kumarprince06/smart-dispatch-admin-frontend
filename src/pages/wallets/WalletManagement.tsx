import React, { useState } from 'react';
import { WalletLedgerTable } from '../../components/wallets/WalletLedgerTable';
import { RefreshCw, Wallet } from 'lucide-react';

export const WalletManagement: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Wallet className="text-accent-primary" /> Wallet Ledger
          </h1>
          <p className="text-text-secondary mt-1">Audit trail for all double-entry wallet transactions across the platform.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-bg-secondary border border-border-color rounded-xl hover:bg-bg-tertiary transition-all duration-200 text-sm font-medium text-text-primary flex-1 sm:flex-none shadow-sm"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <WalletLedgerTable refreshTrigger={refreshTrigger} />
    </div>
  );
};
