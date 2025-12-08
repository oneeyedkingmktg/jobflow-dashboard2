import React from "react";

export default function ReasonNotSoldModal({ onSelect, onCancel }) {
  const reasons = [
    "Too Expensive",
    "Waiting for Another Bid",
    "Thinking About It",
    "Going with Another Contractor",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Reason Not Sold</h2>
        <p className="text-sm text-gray-600 mb-5">
          Select the reason why this lead was not sold:
        </p>

        <div className="space-y-3 mb-4">
          {reasons.map((reason) => (
            <button
              key={reason}
              onClick={() => onSelect(reason)}
              className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 
                         hover:bg-gray-100 hover:border-blue-400 transition text-sm font-medium text-gray-800"
            >
              {reason}
            </button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="w-full text-center text-sm text-gray-500 font-semibold hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
