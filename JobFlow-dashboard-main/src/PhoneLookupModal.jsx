import React, { useState, useContext } from "react";
import { GHLAPI } from "./api";
import { AuthContext } from "./AuthContext";

export default function PhoneLookupModal({
  leads,
  onCreateNew,
  onEditExisting,
  onClose,
}) {
  const { activeCompany } = useContext(AuthContext);
  const [phoneInput, setPhoneInput] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const len = phoneNumber.length;
    if (len < 4) return phoneNumber;
    if (len < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const cleanPhone = (value) => {
    if (!value) return "";
    return value.replace(/[^\d]/g, "");
  };

  const handleSearch = async () => {
    const cleaned = cleanPhone(phoneInput);
    if (!cleaned) return;

    setLoading(true);
    setHasSearched(true);

    // Local search of existing JobFlow leads
    const localMatches = leads.filter((lead) =>
      lead.phone_number?.replace(/[^\d]/g, "").includes(cleaned)
    );

    // If no local result, call GHL API
    let ghlMatch = null;
    try {
      if (activeCompany?.id) {
        const response = await GHLAPI.searchByPhone(cleaned, activeCompany.id);
        if (response?.contacts?.length > 0) {
          ghlMatch = response.contacts[0];
        }
      }
    } catch (_) {
      // silent fail — UI still works
    }

    setLookupResult({
      localMatches,
      ghlMatch,
    });

    setLoading(false);
  };

  const handleProceed = () => {
    if (!lookupResult) return;

    // Prefer local match first
    if (lookupResult.localMatches?.length > 0) {
      onEditExisting(lookupResult.localMatches[0]);
      return;
    }

    // GHL match → prefill new lead
    if (lookupResult.ghlMatch) {
      const c = lookupResult.ghlMatch;
      const newLeadData = {
        first_name: c.firstName || "",
        last_name: c.lastName || "",
        phone_number: c.phone || "",
        email: c.email || "",
        source: "Imported from GHL",
      };
      onCreateNew(newLeadData);
      return;
    }

    // No match anywhere → new blank lead
    onCreateNew({ phone_number: phoneInput });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Phone Lookup</h2>

        <input
          type="text"
          value={phoneInput}
          placeholder="Enter phone number"
          onChange={(e) => setPhoneInput(formatPhoneNumber(e.target.value))}
          className="w-full border rounded-lg p-3 shadow-inner mb-4"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg shadow hover:bg-emerald-700"
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {hasSearched && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-lg">Results</h3>

            {/* Local Results */}
            {lookupResult?.localMatches?.length > 0 ? (
              <div className="p-3 border rounded-lg bg-emerald-50">
                <p className="font-semibold">Existing Lead Found</p>
                <p>{lookupResult.localMatches[0].first_name} {lookupResult.localMatches[0].last_name}</p>
                <p>{lookupResult.localMatches[0].phone_number}</p>
              </div>
            ) : (
              <div className="p-3 border rounded-lg bg-gray-50">
                <p>No existing leads found.</p>
              </div>
            )}

            {/* GHL Result */}
            {lookupResult?.ghlMatch ? (
              <div className="p-3 border rounded-lg bg-indigo-50">
                <p className="font-semibold">GHL Contact Found</p>
                <p>{lookupResult.ghlMatch.firstName} {lookupResult.ghlMatch.lastName}</p>
                <p>{lookupResult.ghlMatch.phone}</p>
                <p>{lookupResult.ghlMatch.email}</p>
              </div>
            ) : (
              <div className="p-3 border rounded-lg bg-gray-50">
                <p>No GHL contact found.</p>
              </div>
            )}
          </div>
        )}

        {hasSearched && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded shadow hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleProceed}
              className="flex-1 bg-emerald-600 text-white py-2 rounded shadow hover:bg-emerald-700"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
