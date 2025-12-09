import React from "react";

export default function LeadDetailsEdit({ form, onChange, onPhoneChange }) {
  const buyerTypes = [
    "Residential",
    "Small Business",
    "Buyer not Owner",
    "Competitive Bid",
  ];

  const projectTypes = [
    "Garage Floor",
    "Basement",
    "Patio",
    "Sidewalk",
    "Pool Deck",
    "Commercial",
  ];

  const preferredContacts = ["Phone", "SMS", "Email"];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-5 py-5 shadow-sm space-y-4">

      {/* NAME */}
      <div>
        <label className="text-xs font-semibold text-gray-600">Name *</label>
        <input
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>

      {/* ADDRESS */}
      <div>
        <label className="text-xs font-semibold text-gray-600">Address</label>
        <input
          value={form.address}
          onChange={(e) => onChange("address", e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>

      {/* CITY / STATE / ZIP */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600">City</label>
          <input
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600">State</label>
          <input
            value={form.state}
            onChange={(e) => onChange("state", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600">Zip</label>
          <input
            value={form.zip}
            onChange={(e) => onChange("zip", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
      </div>

      {/* PHONE */}
      <div>
        <label className="text-xs font-semibold text-gray-600">Phone *</label>
        <input
          value={form.phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>

      {/* EMAIL */}
      <div>
        <label className="text-xs font-semibold text-gray-600">Email</label>
        <input
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>

      {/* BUYER TYPE */}
      <div>
        <label className="text-xs font-semibold text-gray-600">Buyer Type</label>
        <select
          value={form.buyerType}
          onChange={(e) => onChange("buyerType", e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        >
          <option value="">Select Type</option>
          {buyerTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* COMPANY NAME — only when needed */}
      {form.buyerType !== "Residential" && form.buyerType !== "" && (
        <div>
          <label className="text-xs font-semibold text-gray-600">
            Company Name
          </label>
          <input
            value={form.companyName}
            onChange={(e) => onChange("companyName", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
      )}

      {/* PROJECT TYPE */}
      <div>
        <label className="text-xs font-semibold text-gray-600">
          Project Type
        </label>
        <select
          value={form.projectType}
          onChange={(e) => onChange("projectType", e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        >
          <option value="">Choose Project</option>
          {projectTypes.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* CONTRACT PRICE */}
      <div>
        <label className="text-xs font-semibold text-gray-600">
          Contract Price
        </label>
        <input
          value={form.contractPrice}
          onChange={(e) => onChange("contractPrice", e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>

      {/* PREFERRED CONTACT */}
      <div>
        <label className="text-xs font-semibold text-gray-600">
          Preferred Contact
        </label>
        <select
          value={form.preferredContact}
          onChange={(e) => onChange("preferredContact", e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        >
          <option value="">Choose Contact</option>
          {preferredContacts.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* NOTES */}
      <div>
        <label className="text-xs font-semibold text-gray-600">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          className="w-full border px-3 py-2 rounded-lg h-24 resize-none"
        />
      </div>
    </div>
  );
}
