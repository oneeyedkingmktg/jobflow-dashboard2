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
  const [selectedResult, setSelectedResult] = useState(null); // NEW

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

    const localMatches = leads.filter((lead) =>
      lead.phone_number?.replace(/[^\d]/g, "").includes(cleaned)
    );

    let ghlMatch = null;
    try {
      if (activeCompany?.id) {
        const response = await GHLAPI.searchByPhone(cleaned, activeCompany.id);
        if (response?.contacts?.length > 0) {
          ghlMatch = response.contacts[0];
        }
      }
    } catch (_) {}

    setLookupResult({
      localMatches,
      ghlMatch,
    });

    setSelectedResult(null);
    setLoading(false);
  };

  const handleProceed = () => {
    if (!lookupResult) return;

    if (lookupResult.localMatches?.length > 0) {
      onEditExisting(lookupResult.localMatches[0]);
      return;
    }

    if (lookupResult.ghlMatch) {
      const c = lookupResult.ghlMatch;
      const newLeadData = {
        first_name: c.firstName || "",
        last_name: c.lastName || "",
        phone_number: c.phone || "",
        email: c.email || "",
        address: c.address1 || "",
        city: c.city || "",
        state: c.state || "",
        zip: c.postalCode || "",
        source: "Imported from GHL",
      };
      onCreateNew(newLeadData);
      return;
    }

    onCreateNew({ phone_number: phoneInput });
  };

  const renderGHLPreview = (c) => {
    if (!selectedResult) return null;

    return (
      <div className="mt-3 p-3 border rounded-lg bg-white shadow-inner animate-fade-in">
        <p className="font-bold text-gray-800 mb-2">Details</p>

        {c.email && <p className="text-sm"><span className="font-semibold">Email:</span> {c.email}</p>}
        {c.address1 && <p className="text-sm"><span className="font-semibold">Address:</span> {c.address1}</p>}
        {c.city && <p className="text-sm"><span className="font-semibold">City:</span> {c.city}</p>}
        {c.state && <p className="text-sm"><span className="font-semibold">State:</span> {c.state}</p>}
        {c.postalCode && <p className="text-sm"><span className="font-semibold">ZIP:</span> {c.postalCode}</p>}

        {Array.isArray(c.tags) && c.tags.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold text-sm mb-1">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {c.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
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
              <div
                className="p-3 border rounded-lg bg-emerald-50 cursor-pointer"
                onClick={() => {
                  setSelectedResult(null);
                }}
              >
                <p className="font-semibold">Existing Lead Found</p>
                <p>
                  {lookupResult.localMatches[0].first_name}{" "}
                  {lookupResult.localMatches[0].last_name}
                </p>
                <p>{lookupResult.localMatches[0].phone_number}</p>
              </div>
            ) : (
              <div className="p-3 border rounded-lg bg-gray-50">
                <p>No existing leads found.</p>
              </div>
            )}

            {/* GHL Result */}
            {lookupResult?.ghlMatch ? (
              <div
                className="p-3 border rounded-lg bg-indigo-50 cursor-pointer"
                onClick={() =>
                  setSelectedResult(
                    selectedResult ? null : lookupResult.ghlMatch
                  )
                }
              >
                <p className="font-semibold">GHL Contact Found</p>
                <p>
                  {lookupResult.ghlMatch.firstName}{" "}
                  {lookupResult.ghlMatch.lastName}
                </p>
                <p>{lookupResult.ghlMatch.phone}</p>
                {lookupResult.ghlMatch.email && (
                  <p className="text-sm text-gray-700">
                    {lookupResult.ghlMatch.email}
                  </p>
                )}

                {selectedResult && renderGHLPreview(lookupResult.ghlMatch)}
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
