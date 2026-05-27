import React from 'react';
import { Trash2, Activity, Map, Zap, CircleDashed } from 'lucide-react';
import type { ServiceZone } from '../../types/zone';
import { useApi } from '../../hooks/useApi';

interface ZoneTableProps {
  zones: ServiceZone[];
  isLoading: boolean;
  onUpdate: () => void;
}

export const ZoneTable: React.FC<ZoneTableProps> = ({ zones, isLoading, onUpdate }) => {
  const { delete: deleteZone } = useApi();

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this zone? This might affect ongoing orders in this area.')) {
      await deleteZone(`/zones/${id}`);
      onUpdate();
    }
  };

  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-tertiary border-b border-border-color">
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Zone Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Coverage</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Pricing</th>
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
                    <p>Loading zones...</p>
                  </div>
                </td>
              </tr>
            ) : zones.length > 0 ? (
              zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-bg-tertiary/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                        <Map size={18} />
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">{zone.name}</div>
                        <div className="text-sm text-text-secondary">{zone.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-text-primary font-medium">
                      <CircleDashed size={14} className="text-text-muted" />
                      {zone.radiusKm} km radius
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">
                      Lat: {zone.centerLatitude.toFixed(4)}, Lng: {zone.centerLongitude.toFixed(4)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 text-sm font-medium ${zone.zoneMultiplier > 1.0 ? 'text-status-danger' : 'text-text-primary'}`}>
                      {zone.zoneMultiplier > 1.0 ? <Zap size={14} /> : null}
                      {zone.zoneMultiplier}x Multiplier
                    </div>
                    {zone.zoneMultiplier > 1.0 && <div className="text-xs text-status-danger mt-0.5">Surge Active</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      zone.active 
                        ? 'bg-status-success/10 text-status-success border-status-success/30' 
                        : 'bg-text-muted/10 text-text-muted border-border-color'
                    }`}>
                      <Activity size={12} />
                      {zone.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(zone.id)}
                      className="p-2 text-text-muted hover:text-status-danger hover:bg-status-danger/10 rounded-lg transition-colors inline-flex items-center justify-center"
                      title="Delete Zone"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center text-text-muted mb-2">
                      <Map size={32} opacity={0.5} />
                    </div>
                    <p className="text-lg font-medium text-text-primary">No zones configured</p>
                    <p className="text-sm">Click 'Create Zone' to define a new operational area.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
