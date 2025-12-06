import React from "react";

export default function InputRow({ label, value, onChange, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
        required={required}
      />
    </div>
  );
}