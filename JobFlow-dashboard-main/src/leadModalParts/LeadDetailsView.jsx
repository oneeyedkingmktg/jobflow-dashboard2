import React from "react";

export default function LeadDetailsView({ form }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-5 py-5 shadow-sm text-sm text-gray-800 space-y-2">

      {/* EMAIL */}
      <div className="flex justify-between">
        <span className="text-gray-500">Email</span>
        <span className="font-semibold">{form.email || "Not Set"}</span>
      </div>

      {/* BUYER TYPE */}
      <div className="flex justify-between">
        <span className="text-gray-500">Buyer Type</span>
        <span className="font-semibold">{form.buyerType || "Not Set"}</span>
      </div>

      {/* COMPANY NAME */}
      {form.companyName && (
        <div className="flex justify-between">
          <span className="text-gray-500">Company</span>
          <span className="font-semibold">{form.companyName}</span>
        </div>
      )}

      {/* PROJECT TYPE */}
      <div className="flex justify-between">
        <span className="text-gray-500">Project Type</span>
        <span className="font-semibold">
          {form.projectType || "Not Set"}
        </span>
      </div>

      {/* CONTRACT PRICE */}
      <div className="flex justify-between">
        <span className="text-gray-500">Contract Price</span>
        <span className="font-semibold">
          {form.contractPrice ? `$${form.contractPrice}` : "Not Set"}
        </span>
      </div>

      {/* PREFERRED CONTACT */}
      <div className="flex justify-between">
        <span className="text-gray-500">Preferred Contact</span>
        <span className="font-semibold">
          {form.preferredContact || "Not Set"}
        </span>
      </div>

      {/* NOTES */}
      <div>
        <span className="text-gray-500 block">Notes</span>
        <p className="font-semibold whitespace-pre-line mt-1">
          {form.notes?.trim() ? form.notes : "No notes added"}
        </p>
      </div>
    </div>
  );
}
