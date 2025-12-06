import React, { useState } from "react";

export default function PhoneLookupModal({ leads, onCreateNew, onEditExisting, onClose }) {
  const [phoneInput, setPhoneInput] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

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

  const normalizePhone = (phone) => {
    return phone.replace(/[^\d]/g, '');
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneInput(formatted);
    setHasSearched(false);
    setLookupResult(null);
  };

  const handleLookup = () => {
    const normalizedInput = normalizePhone(phoneInput);
    
    if (normalizedInput.length < 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    // Search for matching phone number in leads
    const matchingLead = leads.find(lead => {
      const normalizedLeadPhone = normalizePhone(lead.phone || "");
      return normalizedLeadPhone === normalizedInput;
    });

    setLookupResult(matchingLead);
    setHasSearched(true);
  };

  const handleProceed = () => {
    if (lookupResult) {
      // Lead exists - open in edit mode
      onEditExisting(lookupResult);
    } else {
      // Lead doesn't exist - create new with phone pre-filled
      onCreateNew(phoneInput);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6">
          <h2 className="text-2xl font-bold text-white">Phone Number Lookup</h2>
          <p className="text-blue-100 text-sm mt-1">Check if lead already exists</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Phone Number
            </label>
            <input
              type="tel"
              value={phoneInput}
              onChange={handlePhoneChange}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
              autoFocus
            />
          </div>

          {hasSearched && (
            <div className={`p-4 rounded-xl border-2 ${
              lookupResult 
                ? 'bg-yellow-50 border-yellow-400' 
                : 'bg-green-50 border-green-400'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{lookupResult ? '⚠️' : '✅'}</span>
                <div className="flex-1">
                  {lookupResult ? (
                    <>
                      <h4 className="font-bold text-yellow-800 mb-1">Lead Found!</h4>
                      <p className="text-sm text-yellow-700 mb-2">
                        This phone number is already in the system:
                      </p>
                      <div className="bg-white rounded-lg p-3 text-sm">
                        <p className="font-semibold text-gray-900">{lookupResult.name || "No Name"}</p>
                        <p className="text-gray-600">{lookupResult.email || "No Email"}</p>
                        <p className="text-gray-600">{lookupResult.phone}</p>
                        <p className="text-gray-600">Status: <span className="font-medium">{lookupResult.status}</span></p>
                      </div>
                      <p className="text-sm text-yellow-700 mt-2">
                        Click <strong>Continue</strong> to edit this existing lead.
                      </p>
                    </>
                  ) : (
                    <>
                      <h4 className="font-bold text-green-800 mb-1">No Match Found</h4>
                      <p className="text-sm text-green-700">
                        This phone number is not in the system. Click <strong>Continue</strong> to create a new lead.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Cancel
            </button>
            
            {!hasSearched ? (
              <button
                onClick={handleLookup}
                disabled={!phoneInput || normalizePhone(phoneInput).length < 10}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Search
              </button>
            ) : (
              <button
                onClick={handleProceed}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}