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
    <div className="w-full pt-6 flex flex-col gap-6">

      {/* TOP ROW — SAVE & EXIT (LEFT) and EDIT (RIGHT) */}
      <div className="flex items-center justify-between w-full flex-wrap gap-4">

        {/* LEFT SIDE — SAVE & EXIT */}
        {isEditing ? (
          <button
            onClick={onExit}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
          >
            Save & Exit
          </button>
        ) : (
          <button
            onClick={onExit}
            className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-400"
          >
            Save & Exit
          </button>
        )}

        {/* RIGHT SIDE — EDIT */}
        {!isEditing && (
          <button
            onClick={onEdit}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 ml-auto"
          >
            Edit
          </button>
        )}

        {isEditing && (
          <button
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 ml-auto"
          >
            Save
          </button>
        )}
      </div>

      {/* DELETE AREA */}
      {!isEditing && (
        <div className="flex justify-center items-center pt-2">
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="text-red-600 text-sm font-semibold hover:underline"
            >
              Delete Contact
            </button>
          ) : (
            <div className="flex gap-3">
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
    </div>
  );
}
