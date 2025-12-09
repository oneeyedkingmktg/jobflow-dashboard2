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
    <div className="pt-4 flex flex-col gap-3">
      {/* TOP ROW — EDIT / SAVE + EXIT */}
      <div className="flex items-center justify-end gap-3">
        {isEditing ? (
          <>
            <button
              onClick={onSave}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={onExit}
              className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-400"
            >
              Exit
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onEdit}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={onExit}
              className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-400"
            >
              Exit
            </button>
          </>
        )}
      </div>

      {/* BOTTOM ROW — CENTERED DELETE LINK + CONFIRM INLINE */}
      {!isEditing && (
        <div className="flex flex-col items-center gap-2">
          {!deleteConfirm ? (
            <button
              type="button"
              onClick={() => setDeleteConfirm(true)}
              className="text-xs font-semibold text-red-600 underline-offset-2 hover:underline"
            >
              Delete Contact
            </button>
          ) : (
            <div className="flex items-center gap-3 text-xs">
              <span className="text-gray-700">Confirm delete?</span>
              <button
                type="button"
                onClick={onDelete}
                className="px-3 py-1 rounded-md bg-red-600 text-white font-semibold shadow"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(false)}
                className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
