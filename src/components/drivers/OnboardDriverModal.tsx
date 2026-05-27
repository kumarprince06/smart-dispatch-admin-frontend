import React, { useState } from 'react';
import { X, User, Truck, MapPin, ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import type { AdminOnboardDriverRequest, DriverResponse } from '../../types/driver';

interface OnboardDriverModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const OnboardDriverModal: React.FC<OnboardDriverModalProps> = ({ onClose, onSuccess }) => {
  const { post, isLoading, error } = useApi<DriverResponse>();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AdminOnboardDriverRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    vehicleType: 'BIKE',
    vehicleNumber: '',
    licenseNumber: '',
    vehicleCapacityKg: 10,
    city: '',
    state: '',
    preferredZone: '',
    maxConcurrentOrders: 3,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleNext = () => setStep(s => Math.min(3, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNext();
      return;
    }

    const res = await post('/drivers/admin/onboard', formData);
    if (res?.success) {
      onSuccess();
    }
  };

  // Step Validation logic to disable the 'Next' button if required fields are missing
  const isStepValid = () => {
    if (step === 1) return formData.firstName && formData.lastName && formData.email && formData.phoneNo;
    if (step === 2) return formData.vehicleType && formData.vehicleNumber && formData.licenseNumber;
    return true; // Step 3 fields are mostly optional or have defaults
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-secondary border border-border-color rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-color">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Onboard New Driver</h2>
            <p className="text-sm text-text-secondary mt-1">Add a new driver directly to the platform</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary rounded-lg transition-colors bg-bg-primary hover:bg-bg-tertiary">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-bg-tertiary/30 border-b border-border-color flex justify-between items-center relative">
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-border-color z-0"></div>
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-accent-primary z-0 transition-all duration-300" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          
          {[
            { num: 1, icon: User, label: 'Personal' },
            { num: 2, icon: Truck, label: 'Vehicle' },
            { num: 3, icon: MapPin, label: 'Setup' }
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                step > s.num ? 'bg-accent-primary border-accent-primary text-white' :
                step === s.num ? 'bg-bg-primary border-accent-primary text-accent-primary' :
                'bg-bg-primary border-border-color text-text-muted'
              }`}>
                {step > s.num ? <Check size={14} strokeWidth={3} /> : <s.icon size={14} />}
              </div>
              <span className={`text-xs font-medium ${step >= s.num ? 'text-text-primary' : 'text-text-muted'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-status-danger/10 border border-status-danger/30 flex items-start gap-3">
              <AlertCircle size={18} className="text-status-danger shrink-0 mt-0.5" />
              <p className="text-sm text-status-danger">{error.message}</p>
            </div>
          )}

          <div className="min-h-[250px]">
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">First Name *</label>
                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full bg-bg-primary border border-border-color rounded-lg px-4 py-2 text-text-primary focus:border-accent-primary outline-none transition-colors" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Last Name *</label>
                    <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full bg-bg-primary border border-border-color rounded-lg px-4 py-2 text-text-primary focus:border-accent-primary outline-none transition-colors" placeholder="Doe" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Email Address *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-bg-primary border border-border-color rounded-lg px-4 py-2 text-text-primary focus:border-accent-primary outline-none transition-colors" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Phone Number *</label>
                    <input type="tel" name="phoneNo" required value={formData.phoneNo} onChange={handleChange} className="w-full bg-bg-primary border border-border-color rounded-lg px-4 py-2 text-text-primary focus:border-accent-primary outline-none transition-colors" placeholder="+1234567890" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Details */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Vehicle Type *</label>
                    <select name="vehicleType" required value={formData.vehicleType} onChange={handleChange} className="w-full bg-bg-primary border border-border-color rounded-lg px-4 py-2 text-text-primary focus:border-accent-primary outline-none transition-colors appearance-none">
                      <option value="BICYCLE">Bicycle</option>
                      <option value="BIKE">Motorbike</option>
                      <option value="CAR">Car</option>
                      <option value="VAN">Van</option>
                      <option value="TRUCK">Truck</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Vehicle License Plate *</label>
                    <input type="text" name="vehicleNumber" required value={formData.vehicleNumber} onChange={handleChange} className="w-full bg-bg-primary border border-border-color rounded-lg px-4 py-2 text-text-primary focus:border-accent-primary outline-none transition-colors uppercase" placeholder="ABC-1234" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Driver's License No. *</label>
                    <input type="text" name="licenseNumber" required value={formData.licenseNumber} onChange={handleChange} className="w-full bg-bg-primary border border-border-color rounded-lg px-4 py-2 text-text-primary focus:border-accent-primary outline-none transition-colors" placeholder="DL-98765432" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Max Capacity (Kg)</label>
                    <input type="number" name="vehicleCapacityKg" min="1" value={formData.vehicleCapacityKg} onChange={handleChange} className="w-full bg-bg-primary border border-border-color rounded-lg px-4 py-2 text-text-primary focus:border-accent-primary outline-none transition-colors" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location & Preferences */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-bg-primary border border-border-color rounded-lg px-4 py-2 text-text-primary focus:border-accent-primary outline-none transition-colors" placeholder="New York" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-bg-primary border border-border-color rounded-lg px-4 py-2 text-text-primary focus:border-accent-primary outline-none transition-colors" placeholder="NY" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Preferred Zone</label>
                    <input type="text" name="preferredZone" value={formData.preferredZone} onChange={handleChange} className="w-full bg-bg-primary border border-border-color rounded-lg px-4 py-2 text-text-primary focus:border-accent-primary outline-none transition-colors" placeholder="Downtown" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Max Concurrent Orders</label>
                    <input type="number" name="maxConcurrentOrders" min="1" max="10" value={formData.maxConcurrentOrders} onChange={handleChange} className="w-full bg-bg-primary border border-border-color rounded-lg px-4 py-2 text-text-primary focus:border-accent-primary outline-none transition-colors" />
                  </div>
                </div>
                <div className="p-4 bg-status-info/10 border border-status-info/30 rounded-xl mt-4">
                  <p className="text-sm text-status-info flex items-center gap-2">
                    <Info size={16} />
                    The driver will receive a temporary password (Welcome@123) and will be required to change it on their first login.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-4 border-t border-border-color flex justify-between items-center">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1 || isLoading}
              className="px-4 py-2 text-text-secondary hover:text-text-primary font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              Back
            </button>
            
            <button
              type="submit"
              disabled={!isStepValid() || isLoading}
              className="px-6 py-2.5 bg-accent-primary hover:bg-accent-light text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>Processing...</>
              ) : step === 3 ? (
                <>
                  <Check size={18} />
                  Onboard Driver
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Required for the Info icon that was missed in imports
import { Info } from 'lucide-react';
