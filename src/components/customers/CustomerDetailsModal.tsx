import React from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, CreditCard, ShoppingBag, Award, Activity, AlertTriangle } from 'lucide-react';
import type { CustomerResponse } from '../../types/customer';

interface CustomerDetailsModalProps {
  customer: CustomerResponse;
  onClose: () => void;
  onUpdate?: () => void;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({ customer, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-secondary border border-border-color rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-color bg-bg-tertiary/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary overflow-hidden border-2 border-bg-secondary shadow-sm">
              {customer.profilePictureUrl ? (
                <img src={customer.profilePictureUrl} alt={customer.firstName} className="w-full h-full object-cover" />
              ) : (
                <User size={24} />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                {customer.firstName} {customer.lastName}
                {!customer.active && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-status-danger/10 text-status-danger border border-status-danger/30 uppercase tracking-wider font-semibold">
                    Suspended
                  </span>
                )}
              </h2>
              <p className="text-sm text-text-secondary mt-0.5">
                Customer since {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-bg-primary p-4 rounded-xl border border-border-color">
              <div className="flex items-center gap-2 text-text-muted mb-2">
                <ShoppingBag size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">{customer.totalOrders}</p>
            </div>
            <div className="bg-bg-primary p-4 rounded-xl border border-border-color">
              <div className="flex items-center gap-2 text-text-muted mb-2">
                <CreditCard size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Total Spent</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">₹{customer.totalSpent}</p>
            </div>
            <div className="bg-bg-primary p-4 rounded-xl border border-border-color">
              <div className="flex items-center gap-2 text-text-muted mb-2">
                <Award size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Loyalty Points</span>
              </div>
              <p className="text-2xl font-bold text-accent-primary">{customer.loyaltyPoints}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider border-b border-border-color pb-2">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-text-muted mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{customer.email}</p>
                    <p className="text-xs text-text-secondary">{customer.emailVerified ? 'Verified' : 'Unverified'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-text-muted mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{customer.phoneNo || 'Not provided'}</p>
                    <p className="text-xs text-text-secondary">{customer.phoneVerified ? 'Verified' : 'Unverified'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-text-muted mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {customer.city ? `${customer.city}, ${customer.state || ''}` : 'Location unknown'}
                    </p>
                    {customer.pincode && <p className="text-xs text-text-secondary">{customer.pincode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile & Wallet */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider border-b border-border-color pb-2">Account Details</h3>
              <div className="bg-bg-primary p-4 rounded-xl border border-border-color space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Wallet Balance</span>
                  <span className="font-mono font-medium text-text-primary">₹{customer.walletBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Gender</span>
                  <span className="font-medium text-text-primary capitalize">{customer.gender || 'Not specified'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Date of Birth</span>
                  <span className="font-medium text-text-primary">{customer.dateOfBirth || 'Not specified'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Last Login</span>
                  <span className="font-medium text-text-primary">
                    {customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
