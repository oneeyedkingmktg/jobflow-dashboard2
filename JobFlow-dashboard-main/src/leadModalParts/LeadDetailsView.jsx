import React from "react";

export default function LeadDetailsView({ form, onEdit }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-5 py-5 shadow-sm text-sm text-gray-800 space-y-4">

      {/* FULL NAME */}
      <div>
        <div className="text-gray-500 text-xs">Full Name</div>
        <div className="font-semibold">{form.name || "—"}</div>
      </div>

      {/* EMAIL */}
      <div>
        <div className="text-gray-500 text-xs">Email</div>
        <div>{form.email || "—"}</div>
      </div>

      {/* PHONE */}
      <div>
        <div className="text-gray-500 text-xs">Phone</div>
        <div>{form.phone || "—"}</div>
      </div>

      {/* ADDRESS */}
      <div>
        <div className="text-gray-500 text-xs">Address</div>
        <div>
          {form.address || "—"}
          <br />
          {[form.city, form.state, form.zip].filter(Boolean).join(", ")}
        </div>
      </div>

      {/* BUYER TYPE */}
      <div>
        <div className="text-gray-500 text-xs">Buyer Type</div>
        <div>{form.buyerType || "—"}</div>
      </div>

      {/* COMPANY NAME */}
      <div>
        <div className="text-gray-500 text-xs">Company Name</div>
        <div>{form.companyName || "—"}</div>
      </div>

      {/* PROJECT TYPE */}
      <div>
        <div className="text-gray-500 text-xs">Project Type</div>
        <div>{form.projectType || "—"}</div>
      </div>

      {/* CONTRACT PRICE */}
      <div>
        <div className="text-gray-500 text-xs">Contract Price</div>
        <div>{form.contractPrice ? `$${form.contractPrice}` : "—"}</div>
      </div>

      {/* PREFERRED CONTACT */}
      <div>
        <div className="text-gray-500 text-xs">Preferred Contact</div>
        <div>{form.preferredContact || "—"}</div>
      </div>

      {/* NOTES */}
      <div>
        <div className="text-gray-500 text-xs">Notes</div>
        <div className="whitespace-pre-line">{form.notes || "—"}</div>
      </div>

      {/* LEAD SOURCE — VIEW MODE ONLY */}
      <div>
        <div className="text-gray-500 text-xs">Lead Source</div>
        <div>{form.leadSource || "—"}</div>
      </div>

      {/* EDIT BUTTON */}
      <div className="pt-3">
        <button
          onClick={onEdit}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm shadow hover:bg-blue-700"
        >
          Edit Details
        </button>
      </div>

    </div>
  );
}
