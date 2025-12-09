import React from "react";

export default function LeadFooter({
  isEditing,
  onSave,
  onExit,
  deleteConfirm,
  setDeleteConfirm,
  onDelete,
  form,
}) {
  return (
    <>
      {/* FOOTER BUTTONS */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={onExit}
          className="bg-[#3b4250] text-white px-8 py-2 rounded-xl font-semibold shadow hover:shadow-md"
        >
          Exit
        </button>

        <button
          onClick={() => (isEditing ? onSave() : null)}
          className="bg-[#048c63] text-white px-8 py-2 rounded-xl font-semibold shadow hover:shadow-md"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      {/* DELETE CONTACT */}
      <div className="text-center pt-3">
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
                onClick={() => onDelete(form)}
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
    </>
  );
}
