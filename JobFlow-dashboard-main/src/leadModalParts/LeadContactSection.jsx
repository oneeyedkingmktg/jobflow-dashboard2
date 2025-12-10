import React from "react";

export default function LeadContactSection({ form }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-4 py-4 shadow-sm text-sm">
      <div className="space-y-3">

        {/* EMAIL */}
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Email
          </div>
          <div className="mt-1 font-semibold text-gray-900 break-words">
            {form.email || "Not provided"}
          </div>
        </div>

        {/* PREFERRED CONTACT */}
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Preferred Contact
          </div>
          <div className="mt-1 font-semibold text-gray-900 break-words">
            {form.preferredContact || "Not Set"}
          </div>
        </div>
      </div>
    </div>
  );
}
