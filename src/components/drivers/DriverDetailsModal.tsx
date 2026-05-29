import React, { useState } from 'react';
import type { DriverResponse, VerificationStatus, DriverStatus } from '../../types/driver';
import { X, ShieldAlert, AlertTriangle, CheckCircle, Ban, XCircle, Info, MapPin, Truck } from 'lucide-react';

interface DriverDetailsModalProps {
  driver: DriverResponse;
  onClose: () => void;
  onVerify: (id: number, status: VerificationStatus, reason?: string) => Promise<void>;
  onUpdateStatus: (id: number, status: DriverStatus) => Promise<void>;
  isSubmitting?: boolean;
}

export const DriverDetailsModal: React.FC<DriverDetailsModalProps> = ({ 
  driver, 
  onClose, 
  onVerify, 
  onUpdateStatus,
  isSubmitting = false
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const handleApprove = () => {
    onVerify(driver.id, 'VERIFIED');
  };

  const handleReject = () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (!rejectReason.trim()) return;
    onVerify(driver.id, 'REJECTED', rejectReason);
  };

  const handleSuspend = () => {
    onUpdateStatus(driver.id, 'SUSPENDED');
  };

  const handleActivate = () => {
    onUpdateStatus(driver.id, 'OFFLINE');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-secondary border border-border-color rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-color sticky top-0 bg-bg-secondary/95 backdrop-blur z-10">
          <div className="flex items-center gap-4">
            {driver.profilePictureUrl ? (
              <img src={driver.profilePictureUrl} alt={driver.firstName} className="w-16 h-16 rounded-full object-cover border border-border-color" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-bg-tertiary border border-border-color flex items-center justify-center">
                <span className="text-2xl font-bold text-text-muted">{driver.firstName.charAt(0)}</span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-text-primary">{driver.firstName} {driver.lastName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                  driver.verificationStatus === 'VERIFIED' ? 'text-status-success bg-status-success/10 border-status-success/20' :
                  driver.verificationStatus === 'REJECTED' ? 'text-status-danger bg-status-danger/10 border-status-danger/20' :
                  'text-status-warning bg-status-warning/10 border-status-warning/20'
                }`}>
                  {driver.verificationStatus}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                  driver.status === 'ONLINE' ? 'text-status-success bg-status-success/10 border-status-success/20' :
                  driver.status === 'SUSPENDED' ? 'text-status-danger bg-status-danger/10 border-status-danger/20' :
                  'text-text-muted bg-bg-tertiary border-border-color'
                }`}>
                  {driver.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary rounded-lg transition-colors bg-bg-primary hover:bg-bg-tertiary">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          
          {/* Action Panel for Pending Drivers */}
          {driver.verificationStatus === 'PENDING' && (
            <div className="bg-status-warning/10 border border-status-warning/30 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-status-warning shrink-0 mt-0.5" size={20} />
                <div className="w-full">
                  <h4 className="text-status-warning font-medium">Verification Action Required</h4>
                  <p className="text-text-secondary text-sm mt-1 mb-4">Please review the driver's details and documents below before approving their account.</p>
                  
                  {showRejectInput ? (
                    <div className="flex flex-col gap-3 animate-fade-in">
                      <textarea 
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Provide a reason for rejection..."
                        className="w-full bg-bg-primary border border-status-danger/50 rounded-lg p-3 text-sm text-text-primary outline-none focus:border-status-danger transition-colors resize-none h-24"
                      />
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={handleReject}
                          disabled={!rejectReason.trim() || isSubmitting}
                          className="px-4 py-2 bg-status-danger text-white rounded-lg text-sm font-medium hover:bg-status-danger/90 disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Confirm Rejection
                        </button>
                        <button 
                          onClick={() => setShowRejectInput(false)}
                          disabled={isSubmitting}
                          className="px-4 py-2 text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleApprove}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-status-success text-white rounded-lg text-sm font-medium hover:bg-status-success/90 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Approve Driver
                      </button>
                      <button 
                        onClick={handleReject}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-bg-primary border border-border-color text-text-primary rounded-lg text-sm font-medium hover:bg-status-danger/10 hover:text-status-danger hover:border-status-danger/30 transition-colors flex items-center gap-2"
                      >
                        <Ban size={16} />
                        Reject Application
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Rejection Reason Display */}
          {driver.verificationStatus === 'REJECTED' && driver.rejectionReason && (
            <div className="bg-status-danger/10 border border-status-danger/30 rounded-xl p-5 flex items-start gap-3">
              <ShieldAlert className="text-status-danger shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-status-danger font-medium">Application Rejected</h4>
                <p className="text-status-danger/80 text-sm mt-1">{driver.rejectionReason}</p>
                <button 
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="mt-4 px-4 py-2 bg-status-success/20 text-status-success rounded-lg text-sm font-medium hover:bg-status-success hover:text-white transition-colors"
                >
                  Override & Approve
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2 border-b border-border-color pb-2">
                <Info size={16} />
                Personal Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-muted">Email</p>
                  <p className="text-sm text-text-primary font-medium">{driver.email}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Phone Number</p>
                  <p className="text-sm text-text-primary font-medium">{driver.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Date of Birth</p>
                  <p className="text-sm text-text-primary font-medium">{driver.dateOfBirth || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Tier</p>
                  <p className="text-sm text-text-primary font-medium">{driver.tier}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2 border-b border-border-color pb-2">
                <Truck size={16} />
                Vehicle & License
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-muted">Vehicle Type</p>
                  <p className="text-sm text-text-primary font-medium">{driver.vehicleType}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Vehicle Info</p>
                  <p className="text-sm text-text-primary font-medium">
                    {driver.vehicleYear} {driver.vehicleColor} {driver.vehicleModel || 'Unknown Model'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">License Plate / Registration</p>
                  <p className="text-sm text-text-primary font-medium bg-bg-tertiary px-2 py-1 rounded inline-block mt-1 font-mono">
                    {driver.vehicleNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">License Number</p>
                  <p className="text-sm text-text-primary font-medium">{driver.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Capacity</p>
                  <p className="text-sm text-text-primary font-medium">{driver.vehicleCapacityKg ? `${driver.vehicleCapacityKg} kg` : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Location & Preferences */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2 border-b border-border-color pb-2">
                <MapPin size={16} />
                Location & Delivery Preferences
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-bg-tertiary rounded-xl p-4 border border-border-color">
                  <p className="text-xs text-text-muted mb-1">Service Area</p>
                  <p className="text-sm text-text-primary font-medium">{driver.city}, {driver.state}</p>
                  <p className="text-xs text-text-muted mt-1">{driver.address}</p>
                </div>
                <div className="bg-bg-tertiary rounded-xl p-4 border border-border-color">
                  <p className="text-xs text-text-muted mb-1">Preferred Zone</p>
                  <p className="text-sm text-text-primary font-medium">{driver.preferredZone || 'Any'}</p>
                </div>
                <div className="bg-bg-tertiary rounded-xl p-4 border border-border-color">
                  <p className="text-xs text-text-muted mb-1">Service Radius</p>
                  <p className="text-sm text-text-primary font-medium">{driver.serviceRadiusKm ? `${driver.serviceRadiusKm} km` : 'N/A'}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Footer Actions for existing active/suspended drivers */}
        {driver.verificationStatus === 'VERIFIED' && (
          <div className="p-6 border-t border-border-color bg-bg-tertiary/30 flex justify-end gap-3 mt-auto">
            {driver.status === 'SUSPENDED' ? (
              <button 
                onClick={handleActivate}
                disabled={isSubmitting}
                className="px-4 py-2 bg-status-success text-white rounded-lg text-sm font-medium hover:bg-status-success/90 transition-colors"
              >
                Reactivate Driver
              </button>
            ) : (
              <button 
                onClick={handleSuspend}
                disabled={isSubmitting}
                className="px-4 py-2 bg-status-danger text-white rounded-lg text-sm font-medium hover:bg-status-danger/90 transition-colors flex items-center gap-2"
              >
                <Ban size={16} />
                Suspend Account
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
