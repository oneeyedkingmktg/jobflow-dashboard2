import React, { useState } from 'react';
import { useCompany } from './CompanyContext';

export default function CompanyWizard({ onComplete, onCancel }) {
  const { createCompany } = useCompany();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    address: '',
    ml_apiKey: '',
    ml_groups: {
      lead: '',
      appointment_set: '',
      sold: '',
      not_sold: '',
      complete: ''
    }
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGroupChange = (groupKey, value) => {
    setFormData(prev => ({
      ...prev,
      ml_groups: { ...prev.ml_groups, [groupKey]: value }
    }));
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (value) => {
    const formatted = formatPhoneNumber(value);
    handleChange('ownerPhone', formatted);
  };

  const validateStep1 = () => {
    return formData.name && formData.ownerName && formData.ownerEmail && formData.ownerPhone && formData.address;
  };

  const validateStep2 = () => {
    return formData.ml_apiKey && 
           formData.ml_groups.lead && 
           formData.ml_groups.appointment_set && 
           formData.ml_groups.sold && 
           formData.ml_groups.not_sold && 
           formData.ml_groups.complete;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    if (validateStep2()) {
      createCompany(formData);
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50 overflow-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6">
            <h2 className="text-3xl font-bold text-white">Create New Company</h2>
            <p className="text-blue-100 text-sm mt-1">Step {step} of 2</p>
          </div>

          <div className="p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-semibold ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  Company Info
                </span>
                <span className={`text-sm font-semibold ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  MailerLite Setup
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 2) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Company Information */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="ABC Contracting"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Owner Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleChange('ownerName', e.target.value)}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Owner Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => handleChange('ownerEmail', e.target.value)}
                    placeholder="john@abccontracting.com"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Owner Phone <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Address <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="123 Main St, City, State 12345"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
                  />
                </div>
              </div>
            )}

            {/* Step 2: MailerLite Setup */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    MailerLite API Key <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ml_apiKey}
                    onChange={(e) => handleChange('ml_apiKey', e.target.value)}
                    placeholder="mlpat_xxxxxxxxxxxxx"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base font-mono"
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">MailerLite Group IDs</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Lead Group ID <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.ml_groups.lead}
                        onChange={(e) => handleGroupChange('lead', e.target.value)}
                        placeholder="123456789"
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Appointment Set Group ID <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.ml_groups.appointment_set}
                        onChange={(e) => handleGroupChange('appointment_set', e.target.value)}
                        placeholder="123456789"
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sold Group ID <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.ml_groups.sold}
                        onChange={(e) => handleGroupChange('sold', e.target.value)}
                        placeholder="123456789"
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Not Sold Group ID <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.ml_groups.not_sold}
                        onChange={(e) => handleGroupChange('not_sold', e.target.value)}
                        placeholder="123456789"
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Complete Group ID <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.ml_groups.complete}
                        onChange={(e) => handleGroupChange('complete', e.target.value)}
                        placeholder="123456789"
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              {step === 1 ? (
                <button
                  onClick={onCancel}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  ← Back
                </button>
              )}

              {step === 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!validateStep1()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!validateStep2()}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Company
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}