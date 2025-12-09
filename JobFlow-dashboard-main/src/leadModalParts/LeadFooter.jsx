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
    <div className="flex items-center justify-between pt-4">

      {/* LEFT SIDE — DELETE */}
      {!isEditing && (
        <div>
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-400 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={onDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 border rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* RIGHT SIDE — SAVE / EXIT */}
      <div className="flex items-center gap-3 ml-auto">
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
    </div>
  );
}
