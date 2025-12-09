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
    <div className="pt-4 border-t border-gray-200">
      {/* EXIT + SAVE/EDIT BUTTONS */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onExit}
          className="bg-[#3b4250] text-white px-8 py-2 rounded-xl font-semibold shadow hover:shadow-md"
        >
          Exit
        </button>

        <button
          onClick={isEditing ? onSave : onEdit}
          className="bg-[#048c63] text-white px-8 py-2 rounded-xl font-semibold shadow hover:shadow-md"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      {/* DELETE CONTACT */}
      <div className="text-center">
        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="text-red-600 text-sm font-semibold"
          >
            Delete Contact
          </button>
        ) : (
          <div className="inline-block bg-red-50 border border-red-300 rounded-xl p-3">
            <p className="text-red-700 text-sm font-semibold mb-2">
              Are you sure you want to delete this contact?
            </p>

            <div className="flex gap-3 justify-center text-sm font-semibold">
              <button
                onClick={onDelete}
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                Yes, Delete
              </button>

              <button
                onClick={() => setDeleteConfirm(false)}
                className="bg-gray-200 px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
