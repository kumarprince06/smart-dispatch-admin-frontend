import React, { useEffect, useState } from 'react';
import { X, MapPin, Navigation, Clock, Package, User, Phone, CheckCircle, AlertTriangle, Truck } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { OrderResponse, OrderStatus } from '../../types/order';

// Fix for default Leaflet marker icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const dropIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface OrderDetailsModalProps {
  order: OrderResponse;
  onClose: () => void;
  onStatusChange?: (id: number, newStatus: OrderStatus) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose, onStatusChange }) => {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const ORS_API_KEY = '5b3ce3597851110001cf62482d8a30b2452a445883bb9fe53d4220f4'; // OpenRouteService Key (extracted from base64)

  useEffect(() => {
    // Fetch route from OpenRouteService
    const fetchRoute = async () => {
      try {
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${order.pickupLongitude},${order.pickupLatitude}&end=${order.dropLongitude},${order.dropLatitude}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const coords = data.features[0].geometry.coordinates;
          // ORS returns [lon, lat], Leaflet expects [lat, lon]
          const leafletCoords: [number, number][] = coords.map((c: [number, number]) => [c[1], c[0]]);
          setRouteCoordinates(leafletCoords);
        }
      } catch (error) {
        console.error('Failed to fetch route:', error);
      }
    };

    if (order.pickupLatitude && order.dropLatitude) {
      fetchRoute();
    }
  }, [order]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'CREATED': return 'bg-bg-tertiary text-text-primary border-border-color';
      case 'ASSIGNED': return 'bg-status-warning/10 text-status-warning border-status-warning/30';
      case 'PICKED_UP': return 'bg-status-info/10 text-status-info border-status-info/30';
      case 'IN_TRANSIT': return 'bg-accent-primary/10 text-accent-primary border-accent-primary/30';
      case 'DELIVERED': return 'bg-status-success/10 text-status-success border-status-success/30';
      case 'CANCELLED': 
      case 'FAILED': return 'bg-status-danger/10 text-status-danger border-status-danger/30';
      default: return 'bg-bg-tertiary text-text-primary border-border-color';
    }
  };

  const centerPosition: [number, number] = [
    (order.pickupLatitude + order.dropLatitude) / 2,
    (order.pickupLongitude + order.dropLongitude) / 2
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-secondary border border-border-color rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-color bg-bg-tertiary/30">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-3">
              Order <span className="text-accent-primary font-mono">{order.trackingNumber}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusColor(order.status)}`}>
                {order.status.replace('_', ' ')}
              </span>
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Created on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto">
          
          {/* Left Column: Details */}
          <div className="flex-1 p-6 space-y-6 lg:border-r border-border-color">
            
            {/* Customer & Package */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-primary p-4 rounded-xl border border-border-color">
                <div className="flex items-center gap-2 text-text-muted mb-3">
                  <User size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Customer Details</span>
                </div>
                <p className="font-medium text-text-primary">{order.customerName}</p>
                <p className="text-sm text-text-secondary mt-1">{order.customerEmail}</p>
                <div className="flex items-center gap-1.5 text-sm text-text-secondary mt-1">
                  <Phone size={14} /> {order.customerPhone}
                </div>
              </div>

              <div className="bg-bg-primary p-4 rounded-xl border border-border-color">
                <div className="flex items-center gap-2 text-text-muted mb-3">
                  <Package size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Package Info</span>
                </div>
                <p className="font-medium text-text-primary">{order.packageType.replace('_', ' ')} <span className="text-text-muted font-normal">({order.packageWeightKg} kg)</span></p>
                <p className="text-sm text-text-secondary mt-1">{order.packageDescription}</p>
                <div className="mt-2 pt-2 border-t border-border-color flex justify-between text-sm">
                  <span className="text-text-muted">Delivery Fee</span>
                  <span className="font-semibold text-text-primary font-mono">₹{order.deliveryFee.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div className="relative pl-6 space-y-6">
              {/* Vertical Line */}
              <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-border-color"></div>

              {/* Pickup */}
              <div className="relative">
                <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-status-warning border-4 border-bg-secondary"></div>
                <div className="bg-bg-primary p-4 rounded-xl border border-border-color">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-status-warning uppercase tracking-wider mb-1">Pickup Location</p>
                      <p className="font-medium text-text-primary">{order.pickupAddress}</p>
                    </div>
                    {order.pickupOtp && (
                      <div className="text-right">
                        <p className="text-xs text-text-muted">OTP</p>
                        <p className="font-mono font-bold text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded">{order.pickupOtp}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 mt-3 pt-3 border-t border-border-color text-sm text-text-secondary">
                    <span className="flex items-center gap-1"><User size={14} /> {order.pickupContactName}</span>
                    <span className="flex items-center gap-1"><Phone size={14} /> {order.pickupContactPhone}</span>
                  </div>
                </div>
              </div>

              {/* Dropoff */}
              <div className="relative">
                <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-status-success border-4 border-bg-secondary"></div>
                <div className="bg-bg-primary p-4 rounded-xl border border-border-color">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-status-success uppercase tracking-wider mb-1">Delivery Location</p>
                      <p className="font-medium text-text-primary">{order.dropAddress}</p>
                    </div>
                    {order.deliveryOtp && (
                      <div className="text-right">
                        <p className="text-xs text-text-muted">OTP</p>
                        <p className="font-mono font-bold text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded">{order.deliveryOtp}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 mt-3 pt-3 border-t border-border-color text-sm text-text-secondary">
                    <span className="flex items-center gap-1"><User size={14} /> {order.dropContactName}</span>
                    <span className="flex items-center gap-1"><Phone size={14} /> {order.dropContactPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Assignment */}
            <div className="bg-bg-primary p-4 rounded-xl border border-border-color">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-text-muted">
                  <Truck size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Driver Assignment</span>
                </div>
                {order.status === 'CREATED' && (
                  <button className="text-xs font-medium bg-accent-primary text-white px-3 py-1.5 rounded-lg hover:bg-accent-primary/90 transition-colors">
                    Assign Manually
                  </button>
                )}
              </div>
              
              {order.driverId ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-bg-tertiary rounded-full flex items-center justify-center text-text-muted">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{order.driverName}</p>
                    <div className="flex items-center gap-3 text-sm text-text-secondary mt-1">
                      <span className="flex items-center gap-1"><Phone size={14} /> {order.driverPhone}</span>
                      <span className="bg-bg-tertiary px-2 py-0.5 rounded text-xs font-mono">{order.vehicleNumber}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-text-muted">
                  <p className="text-sm">No driver assigned to this order yet.</p>
                  <p className="text-xs mt-1">The automated dispatch engine is actively searching.</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Map */}
          <div className="w-full lg:w-[45%] h-[400px] lg:h-auto bg-bg-primary relative z-0">
            <MapContainer 
              center={centerPosition} 
              zoom={13} 
              style={{ width: '100%', height: '100%', zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              
              <Marker position={[order.pickupLatitude, order.pickupLongitude]} icon={pickupIcon}>
                <Popup>
                  <strong>Pickup</strong><br/>{order.pickupAddress}
                </Popup>
              </Marker>
              
              <Marker position={[order.dropLatitude, order.dropLongitude]} icon={dropIcon}>
                <Popup>
                  <strong>Dropoff</strong><br/>{order.dropAddress}
                </Popup>
              </Marker>

              {routeCoordinates.length > 0 && (
                <Polyline 
                  positions={routeCoordinates} 
                  color="#4F46E5" 
                  weight={4} 
                  opacity={0.7} 
                  dashArray="10, 10" 
                />
              )}
            </MapContainer>
          </div>
          
        </div>
      </div>
    </div>
  );
};
