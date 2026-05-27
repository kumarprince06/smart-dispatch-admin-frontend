import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import type { ServiceZone } from '../../types/zone';
import { Map, Plus, RefreshCw } from 'lucide-react';
import { ZoneMap } from '../../components/zones/ZoneMap';
import { ZoneTable } from '../../components/zones/ZoneTable';
import { ZoneFormModal } from '../../components/zones/ZoneFormModal';

export const ZoneManagement: React.FC = () => {
  const { get, isLoading, data: zones } = useApi<ServiceZone[]>();
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchZones = () => {
    get('/zones');
  };

  useEffect(() => {
    fetchZones();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    handleRefresh();
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Map className="text-accent-primary" /> Service Zones
          </h1>
          <p className="text-text-secondary mt-1">Manage operational geofences and configure regional surge pricing.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-bg-secondary border border-border-color rounded-xl hover:bg-bg-tertiary transition-all duration-200 text-sm font-medium text-text-primary flex-1 sm:flex-none shadow-sm"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-hover text-white rounded-xl transition-all duration-200 text-sm font-medium flex-1 sm:flex-none shadow-lg shadow-accent-primary/20"
          >
            <Plus size={18} />
            Create Zone
          </button>
        </div>
      </div>

      {/* Map View */}
      <div className="grid grid-cols-1 gap-6">
        <ZoneMap zones={zones || []} />
      </div>

      {/* Data Table */}
      <ZoneTable zones={zones || []} isLoading={isLoading} onUpdate={handleRefresh} />

      {/* Modal */}
      {isModalOpen && (
        <ZoneFormModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleSuccess} 
        />
      )}
    </div>
  );
};
