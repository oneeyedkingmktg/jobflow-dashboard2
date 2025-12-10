import React from "react";

export default function LeadDetailsView({ form, onEdit }) {
  return (
    <div
      className="bg-[#f5f6f7] rounded-2xl border border-gray-200 px-5 py-5 shadow-sm text-sm text-gray-800 space-y-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onEdit}
    >

      {/* EMAIL */}
      <div className="flex justify-between gap-4">
        <span className="text-gray-500">Email</span>
        <span className="font-semibold text-right break-words">
          {form.email || "Not Set"}
        </span>
      </div>

      {/* BUYER TYPE */}
      <div className="flex justify-between gap-4">
        <span className="text-gray-500">Buyer Type</span>
        <span className="font-semibold text-right break-words">
          {form.buyerType || "Not Set"}
        </span>
      </div>

      {/* COMPANY NAME */}
      {form.companyName ? (
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Company</span>
          <span className="font-semibold text-right break-words">
            {form.companyName}
          </span>
        </div>
      ) : null}

      {/* PROJECT TYPE */}
      <div className="flex justify-between gap-4">
        <span className="text-gray-500">Project Type</span>
        <span className="font-semibold text-right break-words">
          {form.projectType || "Not Set"}
        </span>
      </div>

      {/* CONTRACT PRICE */}
      <div className="flex justify-between gap-4">
        <span className="text-gray-500">Contract Price</span>
        <span className="font-semibold text-right break-words">
          {form.contractPrice
            ? `$${Number(form.contractPrice).toLocaleString()}`
            : "Not Set"}
        </span>
      </div>

      {/* PREFERRED CONTACT */}
      <div className="flex justify-between gap-4">
        <span className="text-gray-500">Preferred Contact</span>
        <span className="font-semibold text-right break-words">
          {form.preferredContact || "Not Set"}
        </span>
      </div>

      {/* NOTES */}
      <div>
        <span className="text-gray-500 block">Notes</span>
        <p className="font-semibold whitespace-pre-line mt-1 break-words">
          {form.notes?.trim() ? form.notes : "No notes added"}
        </p>
      </div>

      {/* LEAD SOURCE (VIEW ONLY) */}
      <div className="flex justify-between gap-4">
        <span className="text-gray-500">Lead Source</span>
        <span className="font-semibold text-right break-words">
          {form.leadSource || "Not Set"}
        </span>
      </div>

    </div>
  );
}
