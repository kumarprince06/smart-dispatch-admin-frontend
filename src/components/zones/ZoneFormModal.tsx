import React, { useState, useEffect } from 'react';
import { X, Map, MapPin } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import type { ServiceZone } from '../../types/zone';
import { MapContainer, TileLayer, Circle, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface ZoneFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const LocationPicker = ({ position, setPosition }: { position: [number, number], setPosition: (p: [number, number]) => void }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position[0] !== 0 ? <Circle center={position} radius={50} color="#2563eb" fillOpacity={0.8} /> : null;
};

const MapUpdater = ({ position }: { position: [number, number] }) => {
  const leafletMap = useMap();
  
  React.useEffect(() => {
    leafletMap.flyTo(position, leafletMap.getZoom());
  }, [position, leafletMap]);
  
  return null;
};

export const ZoneFormModal: React.FC<ZoneFormModalProps> = ({ onClose, onSuccess }) => {
  const { post, isLoading } = useApi<ServiceZone>();

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    radiusKm: 5,
    zoneMultiplier: 1.0,
    active: true
  });
  
  const [position, setPosition] = useState<[number, number]>([20.5937, 78.9629]); // Default to center of India
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.warn("Could not get user location:", err);
        }
      );
    }
  }, []);

  const geocodeCity = async () => {
    if (!formData.city) return;
    setIsGeocoding(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.city)}&format=json&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (error) {
      console.error("Failed to geocode city", error);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.city) {
      alert("Name and City are required");
      return;
    }
    
    const payload = {
      ...formData,
      centerLatitude: position[0],
      centerLongitude: position[1]
    };

    await post('/zones', payload);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-secondary border border-border-color rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-color bg-bg-tertiary/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
              <Map size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">Create Service Zone</h2>
              <p className="text-sm text-text-secondary">Define operational geofence and surge pricing.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Form */}
          <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-border-color">
            <form id="zone-form" onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Zone Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. South Delhi Hub"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-bg-primary border border-border-color rounded-xl px-4 py-2.5 text-text-primary focus:border-accent-primary outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. New Delhi"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  onBlur={geocodeCity}
                  className="w-full bg-bg-primary border border-border-color rounded-xl px-4 py-2.5 text-text-primary focus:border-accent-primary outline-none transition-colors"
                />
                {isGeocoding && <p className="text-xs text-accent-primary mt-1">Finding city on map...</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Radius (km)</label>
                  <input 
                    type="number" 
                    min="1" max="100" step="0.1"
                    required
                    value={formData.radiusKm}
                    onChange={e => setFormData({...formData, radiusKm: parseFloat(e.target.value)})}
                    className="w-full bg-bg-primary border border-border-color rounded-xl px-4 py-2.5 text-text-primary focus:border-accent-primary outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Surge Multiplier</label>
                  <input 
                    type="number" 
                    min="1" max="5" step="0.1"
                    required
                    value={formData.zoneMultiplier}
                    onChange={e => setFormData({...formData, zoneMultiplier: parseFloat(e.target.value)})}
                    className="w-full bg-bg-primary border border-border-color rounded-xl px-4 py-2.5 text-text-primary focus:border-accent-primary outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border-color mt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.active}
                    onChange={e => setFormData({...formData, active: e.target.checked})}
                    className="w-5 h-5 rounded text-accent-primary focus:ring-accent-primary bg-bg-primary border-border-color cursor-pointer"
                  />
                  <span className="text-text-primary font-medium">Zone is currently active</span>
                </label>
              </div>

            </form>
          </div>

          {/* Map */}
          <div className="w-full md:w-1/2 h-[300px] md:h-auto bg-bg-primary relative">
            <div className="absolute top-4 left-4 right-4 z-[1000] bg-bg-secondary/90 backdrop-blur border border-border-color p-3 rounded-xl shadow-lg flex items-center gap-3 pointer-events-none">
              <MapPin className="text-accent-primary flex-shrink-0" />
              <p className="text-sm font-medium">Click on the map to set the zone center.</p>
            </div>
            <MapContainer 
              center={position} 
              zoom={11} 
              style={{ width: '100%', height: '100%', zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker position={position} setPosition={setPosition} />
              {/* @ts-ignore */}
              <MapUpdater position={position} />
              
              {/* Preview Circle */}
              <Circle 
                center={position} 
                radius={formData.radiusKm * 1000} 
                pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.1, weight: 2, dashArray: '5, 5' }} 
              />
            </MapContainer>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-color bg-bg-tertiary/30 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="zone-form"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl text-sm font-medium bg-accent-primary hover:bg-accent-hover text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-accent-primary/20"
          >
            {isLoading ? 'Creating...' : 'Create Zone'}
          </button>
        </div>

      </div>
    </div>
  );
};
