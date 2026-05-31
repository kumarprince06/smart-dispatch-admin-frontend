import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import type { ServiceZone } from '../../types/zone';
import 'leaflet/dist/leaflet.css';
import { Zap } from 'lucide-react';

interface ZoneMapProps {
  zones: ServiceZone[];
}

export const ZoneMap: React.FC<ZoneMapProps> = ({ zones }) => {
  // Center India roughly if no zones
  const center: [number, number] = zones.length > 0 
    ? [zones[0].centerLatitude, zones[0].centerLongitude] 
    : [20.5937, 78.9629];
  
  const zoom = zones.length > 0 ? 10 : 4;

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-border-color relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ width: '100%', height: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {zones.map((zone) => (
          <Circle 
            key={zone.id}
            center={[zone.centerLatitude, zone.centerLongitude]} 
            radius={zone.radiusKm * 1000} // Leaflet needs meters
            pathOptions={{ 
              color: zone.active ? '#2563eb' : '#64748b', 
              fillColor: zone.active ? (zone.zoneMultiplier > 1.0 ? '#ef4444' : '#2563eb') : '#64748b', 
              fillOpacity: 0.15, 
              weight: 2 
            }} 
          >
            <Popup>
              <div className="font-sans">
                <strong className="text-sm">{zone.name}</strong>
                <p className="text-xs text-gray-500 m-0 mb-2">{zone.city}</p>
                <div className="text-xs flex flex-col gap-1">
                  <span>Radius: {zone.radiusKm} km</span>
                  <span className={`font-semibold flex items-center gap-1 ${zone.zoneMultiplier > 1 ? 'text-red-500' : ''}`}>
                    {zone.zoneMultiplier > 1 && <Zap size={10} />}
                    Surge: {zone.zoneMultiplier}x
                  </span>
                  <span>Status: {zone.active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};
