
import React, { useState, useEffect } from "react";

export default function CompanyDetails({ company, onBack, onSave, saving }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    timezone: "",
    sales_calendar: "",
    install_calendar: "",
    ghl_api_key: "",
    ghl_location_id: "",
    suspended: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!company) return;

    setFormData({
      name: company.name || "",
      phone: company.phone || "",
      email: company.email || "",
      address: company.address || "",
      timezone: company.timezone || "",
      sales_calendar: company.sales_calendar || "",
      install_calendar: company.install_calendar || "",
      ghl_api_key: company.ghl_api_key || "",
      ghl_location_id: company.ghl_location_id || "",
      suspended: !!company.suspended,
    });
    setError("");
    setSuccess("");
  }, [company]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleCheckbox = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
    setError("");
  };

  const handleSaveClick = async () => {
    setError("");
    setSuccess("");

    try {
      await onSave(company.id, formData);
      setSuccess("Company updated successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to save company.");
    }
  };

  const isSuspended = !!formData.suspended;

  return (
    <>
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {company?.name || "Company Details"}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Edit configuration for this company.
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-white/80 hover:text-white text-sm font-semibold underline"
        >
          Back
        </button>
      </div>

      {/* BODY */}
      <div className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-600 text-red-800 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border-l-4 border-green-600 text-green-800 rounded">
            {success}
          </div>
        )}

        {/* STATUS BADGE */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                isSuspended
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-emerald-100 text-emerald-700 border border-emerald-300"
              }`}
            >
              {isSuspended ? "Suspended" : "Active"}
            </span>

            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.suspended}
                onChange={() => handleCheckbox("suspended")}
              />
              <span>Suspended</span>
            </label>
          </div>

          {saving && (
            <span className="text-xs text-gray-500">Saving company…</span>
          )}
        </div>

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="font-semibold text-gray-700 mb-1 block">
              Company Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
              placeholder="Company Name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="font-semibold text-gray-700 mb-1 block">
              Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
              placeholder="555-123-4567"
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-semibold text-gray-700 mb-1 block">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
              placeholder="company@email.com"
            />
          </div>

          {/* Timezone */}
          <div>
            <label className="font-semibold text-gray-700 mb-1 block">
              Timezone
            </label>
            <input
              type="text"
              value={formData.timezone}
              onChange={(e) => handleChange("timezone", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
              placeholder="America/Chicago"
            />
          </div>
        </div>

        {/* ADDRESS */}
        <div>
          <label className="font-semibold text-gray-700 mb-1 block">
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg h-24"
            placeholder="123 Main St, City, State"
          />
        </div>

        {/* CALENDARS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-700 mb-1 block">
              Sales Calendar
            </label>
            <input
              type="text"
              value={formData.sales_calendar}
              onChange={(e) => handleChange("sales_calendar", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
              placeholder="Sales calendar ID or name"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">
              Install Calendar
            </label>
            <input
              type="text"
              value={formData.install_calendar}
              onChange={(e) => handleChange("install_calendar", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
              placeholder="Install calendar ID or name"
            />
          </div>
        </div>

        {/* GHL FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <div>
            <label className="font-semibold text-gray-700 mb-1 block">
              Company GHL Location Code (ghl_api_key)
            </label>
            <input
              type="text"
              value={formData.ghl_api_key}
              onChange={(e) => handleChange("ghl_api_key", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-sm"
              placeholder="GHL API key / location code"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">
              GHL Location ID (ghl_location_id)
            </label>
            <input
              type="text"
              value={formData.ghl_location_id}
              onChange={(e) =>
                handleChange("ghl_location_id", e.target.value)
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-sm"
              placeholder="GHL location ID"
            />
          </div>
        </div>

        {/* USERS LIST (READ ONLY LIST FOR NOW) */}
        {Array.isArray(company.users) && company.users.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Users for this company
            </h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {company.users.map((u) => (
                <li key={u.id}>
                  • {u.name || u.email}{" "}
                  <span className="text-xs text-gray-500">
                    ({u.role || "user"})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-between items-center pt-4 border-t gap-3">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl shadow-lg"
          >
            Back
          </button>
          <button
            onClick={handleSaveClick}
            disabled={saving}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl shadow-lg"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}
