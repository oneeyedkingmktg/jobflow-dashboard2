import React from "react";

export default function LeadContactInfo({ form }) {
  return (
    <div className="space-y-2">
      {/* PHONE */}
      <div className="text-gray-900 font-semibold">
        {form.phone}
      </div>

      {/* LEAD SOURCE BADGE */}
      {form.leadSource && (
        <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
          Lead Source: {form.leadSource}
        </div>
      )}
    </div>
  );
}
