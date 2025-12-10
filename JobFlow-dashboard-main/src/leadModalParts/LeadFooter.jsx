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
    <div className="mt-6">

      
      {/* DELETE CONFIRMATION */}
      {deleteConfirm ? (
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <div className="flex-1">
            <button
              onClick={() => setDeleteConfirm(false)}
              className="w-full px-4 py-3 rounded-lg bg-gray-300 text-gray-800 font-semibold shadow"
            >
              Cancel
            </button>
          </div>

          <div className="flex-1">
            <button
              onClick={onDelete}
              className="w-full px-4 py-3 rounded-lg bg-red-600 text-white font-bold shadow hover:bg-red-700"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* NORMAL BUTTON ROW */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

            {/* LEFT SIDE — SAVE & EXIT */}
            <div className="flex-1 sm:flex-none">
              <button
                onClick={onExit}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gray-800 text-white 
                font-semibold shadow hover:bg-gray-900 transition-all"
              >
                Save & Exit
              </button>
            </div>

            {/* RIGHT SIDE — EDIT / SAVE / DELETE */}
            <div className="flex flex-1 sm:flex-none justify-end gap-3">

              {isEditing ? (
                <button
                  onClick={onSave}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold 
                  shadow hover:bg-blue-700 transition-all"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={onEdit}
                  className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold 
                  shadow hover:bg-indigo-700 transition-all"
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => setDeleteConfirm(true)}
                className="px-6 py-3 rounded-lg bg-red-600 text-white font-semibold 
                shadow hover:bg-red-700 transition-all"
              >
                Delete
              </button>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
