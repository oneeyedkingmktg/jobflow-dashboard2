import React from "react";

export default function LeadDetailsEdit({ form, onChange, onPhoneChange }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-5 py-5 shadow-sm text-sm text-gray-800 space-y-4">

      {/* NAME */}
      <div>
        <label className="text-gray-500 block mb-1">Full Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* PHONE */}
      <div>
        <label className="text-gray-500 block mb-1">Phone</label>
        <input
          type="text"
          value={form.phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* EMAIL */}
      <div>
        <label className="text-gray-500 block mb-1">Email</label>
        <input
          type="text"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* ADDRESS */}
      <div>
        <label className="text-gray-500 block mb-1">Address</label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => onChange("address", e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-gray-500 block mb-1">City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-gray-500 block mb-1">State</label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => onChange("state", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-gray-500 block mb-1">ZIP</label>
          <input
            type="text"
            value={form.zip}
            onChange={(e) => onChange("zip", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* PROJECT TYPE */}
      <div>
        <label className="text-gray-500 block mb-1">Project Type</label>
        <input
          type="text"
          value={form.projectType}
          onChange={(e) => onChange("projectType", e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* CONTRACT PRICE */}
      <div>
        <label className="text-gray-500 block mb-1">Contract Price</label>
        <input
          type="number"
          value={form.contractPrice}
          onChange={(e) => onChange("contractPrice", e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* NOTES */}
      <div>
        <label className="text-gray-500 block mb-1">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          rows={4}
        />
      </div>
    </div>
  );
}
