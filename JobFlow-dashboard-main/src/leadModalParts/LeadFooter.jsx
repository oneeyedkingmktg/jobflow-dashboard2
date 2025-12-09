import React from "react";

export default function LeadFooter({
  isEditing,
  onSave,
  onEdit,
  onExit,
  deleteConfirm,
  setDeleteConfirm,
  onDelete,
}) {
  return (
    <div className="pt-6 border-t border-gray-300">
      {/* TOP ROW: Save & Exit (left) — Edit (right) */}
      <div className="flex items-center justify-between mb-5">

        {/* SAVE & EXIT */}
        <button
          onClick={onExit}
          className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
          text-white rounded-xl font-semibold shadow-md 
          hover:shadow-lg transition-all text-sm"
        >
          Save & Exit
        </button>

        {/* EDIT BUTTON (only if NOT in edit mode) */}
        {!isEditing && (
          <button
            onClick={onEdit}
            className="px-5 py-3 bg-white border border-gray-300 
            text-gray-700 rounded-xl font-semibold shadow-sm 
            hover:bg-gray-100 transition-all text-sm"
          >
            Edit
          </button>
        )}
      </div>

      {/* SAVE BUTTON (only while editing) */}
      {isEditing && (
        <button
          onClick={onSave}
          className="w-full px-5 py-3 bg-green-600 text-white rounded-xl 
          font-semibold shadow-md hover:shadow-lg transition-all mb-4 text-sm"
        >
          Save Changes
        </button>
      )}

      {/* DELETE BUTTON */}
      {!deleteConfirm ? (
        <button
          onClick={() => setDeleteConfirm(true)}
          className="w-full px-5 py-3 bg-red-500 text-white rounded-xl font-semibold 
          shadow-sm hover:bg-red-600 transition-all text-sm"
        >
          Delete Lead
        </button>
      ) : (
        <div className="space-y-3">
          <div className="text-center text-gray-700 font-semibold">
            Confirm Delete?
          </div>
          <div className="flex gap-3">
            <button
              onClick={onDelete}
              className="flex-1 px-5 py-3 bg-red-600 text-white rounded-xl font-semibold shadow"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setDeleteConfirm(false)}
              className="flex-1 px-5 py-3 bg-gray-300 text-gray-800 rounded-xl font-semibold shadow"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
