import React, { useState, useEffect } from "react";
import InputRow from "./InputRow.jsx";
import LeadDetails from "./LeadDetails.jsx";
import DateModal from "./DateModal.jsx";
import ApptDateTimeModal from "./ApptDateTimeModal.jsx";
import { LeadsAPI } from "./api";
import { useAuth } from "./AuthContext";
import { useCompany } from "./CompanyContext";

export default function LeadModal({
  lead,
  onClose,
  onSave,
  onDelete,
  fromView,
  leadSource,
}) {
  const { user } = useAuth();
  const { currentCompany } = useCompany();

  /* =========================================================================
     FORM MODEL — MATCHES DATABASE 1:1
     ========================================================================= */
  const [form, setForm] = useState({
    id: lead?.id || null,
    company_id: lead?.company_id || currentCompany?.id || null,
    created_by_user_id: lead?.created_by_user_id || user?.id || null,

    // Core identity
    name: lead?.name || "",
    full_name: lead?.full_name || "",
    first_name: lead?.first_name || "",
    last_name: lead?.last_name || "",

    // Contact info
    phone: lead?.phone || "",
    email: lead?.email || "",

    // Address
    address: lead?.address || "",
    city: lead?.city || "",
    state: lead?.state || "",
    zip: lead?.zip || "",

    // Buyer/company
    buyer_type: lead?.buyer_type || "",
    company_name: lead?.company_name || "",
    project_type: lead?.project_type || "",

    lead_source: lead?.lead_source || leadSource || "",
    referral_source: lead?.referral_source || "",

    // Status
    status: lead?.status || "Lead",
    not_sold_reason: lead?.not_sold_reason || "",
    contract_price: lead?.contract_price || "",
    preferred_contact: lead?.preferred_contact || "",
    notes: lead?.notes || "",

    // Appointment (split into date + time for UI)
    apptDate: lead?.appointment_date
      ? lead.appointment_date.split("T")[0]
      : "",
    apptTime: lead?.appointment_date
      ? lead.appointment_date.split("T")[1]?.substring(0, 5)
      : "",

    // Install fields
    install_date: lead?.install_date || "",
    install_tentative: lead?.install_tentative || false,
  });

  /* =========================================================================
     STATE
     ========================================================================= */
  const [isEditing, setIsEditing] = useState(lead?.isNew || false);
  const [showDateModal, setShowDateModal] = useState(null);
  const [showApptModal, setShowApptModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showNotSoldModal, setShowNotSoldModal] = useState(false);
  const [previousStatus, setPreviousStatus] = useState(lead?.status || "Lead");

  /* =========================================================================
     EFFECTS
     ========================================================================= */
  useEffect(() => {
    if (form.status !== previousStatus) {
      if (form.status === "Appointment Set" && previousStatus !== "Appointment Set") {
        setShowApptModal(true);
      } else if (form.status === "Sold" && previousStatus !== "Sold") {
        setShowDateModal("install_date");
      }
      setPreviousStatus(form.status);
    }
  }, [form.status, previousStatus]);

  /* =========================================================================
     STATIC VALUES
     ========================================================================= */
  const statuses = ["Lead", "Appointment Set", "Sold", "Not Sold", "Completed"];
  const statusColors = {
    Lead: "bg-slate-500",
    "Appointment Set": "bg-blue-600",
    Sold: "bg-emerald-600",
    "Not Sold": "bg-red-600",
    Completed: "bg-amber-500",
  };

  const notSoldReasons = [
    "Too Expensive",
    "Waiting for Another Bid",
    "Thinking About It",
    "Going with Another Contractor",
  ];

  /* =========================================================================
     HELPERS
     ========================================================================= */
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const formatDate = (value) => {
    if (!value) return "Not Set";
    const d = new Date(value + "T00:00:00");
    if (isNaN(d)) return "Not Set";
    return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const formatTime = (value) => {
    if (!value) return "Not Set";
    const [h, m] = value.split(":");
    let hour = Number(h);
    if (isNaN(hour)) return value;
    const ampm = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${hour}:${m} ${ampm}`;
  };

  const parseName = (fullName) => {
    if (!fullName) return { first_name: "", last_name: "" };
    const parts = fullName.trim().split(" ");
    return {
      first_name: parts.shift() || "",
      last_name: parts.join(" "),
    };
  };

  /* =========================================================================
     SAVE → DB ONLY
     ========================================================================= */
  const handleSave = async () => {
    if (!form.name || !form.phone) {
      setShowValidationModal(true);
      return;
    }

    // Build appointment timestamp
    let appointment_date = null;
    if (form.apptDate) {
      appointment_date =
        form.apptDate + (form.apptTime ? `T${form.apptTime}:00` : "T00:00:00");
    }

    const parsed = parseName(form.name);

    const outgoing = {
      ...form,
      ...parsed,
      appointment_date,
      install_date: form.install_date || null,
    };

    await onSave(outgoing);
    setIsEditing(false);
  };

  /* =========================================================================
     EXIT
     ========================================================================= */
  const handleExit = async () => {
    if (form.name && form.phone) {
      await handleSave();
    }
    onClose({ view: "home" });
  };

  /* =========================================================================
     RENDER
     ========================================================================= */
  const nextProgression =
    form.status === "Lead"
      ? "Appointment Set"
      : form.status === "Appointment Set"
      ? "Sold"
      : form.status === "Sold"
      ? "Completed"
      : null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative animate-slide-up">
        
        {/* HEADER */}
        <div className={`${statusColors[form.status]} rounded-t-2xl p-5 text-white`}>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold break-words">
              {form.name || "New Lead"}
            </h2>

            {form.company_name && form.buyer_type !== "Residential" && (
              <p className="text-lg font-semibold text-white/90">
                {form.company_name}
              </p>
            )}

            <div className="flex gap-2">
              <a
                href={`tel:${form.phone}`}
                className="bg-white hover:bg-gray-100 text-gray-900 text-base px-6 py-2.5 rounded-lg font-semibold shadow flex-1 text-center"
              >
                Call
              </a>
              <a
                href={`sms:${form.phone}`}
                className="bg-white hover:bg-gray-100 text-gray-900 text-base px-6 py-2.5 rounded-lg font-semibold shadow flex-1 text-center"
              >
                Text
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${form.address}, ${form.city}, ${form.state} ${form.zip}`
                )}`}
                target="_blank"
                className="bg-white hover:bg-gray-100 text-gray-900 text-base px-6 py-2.5 rounded-lg font-semibold shadow flex-1 text-center"
              >
                Maps
              </a>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          
          {/* STATUS */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <div className="relative">
              <button
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className={`${statusColors[form.status]} text-white px-5 py-2 rounded-full font-bold text-sm`}
              >
                {form.status}
              </button>

              {statusDropdownOpen && (
                <div className="absolute bg-white shadow rounded-xl mt-2 overflow-hidden">
                  {statuses.map((s) => (
                    <div
                      key={s}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        if (s === "Not Sold") {
                          setShowNotSoldModal(true);
                        } else {
                          setForm((prev) => ({ ...prev, status: s }));
                        }
                        setStatusDropdownOpen(false);
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {nextProgression && (
              <button
                onClick={() =>
                  setForm((prev) => ({ ...prev, status: nextProgression }))
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold"
              >
                {nextProgression}
              </button>
            )}
          </div>

          {/* DETAILS */}
          <LeadDetails
            form={form}
            isEditing={isEditing}
            formatDate={formatDate}
            formatTime={formatTime}
            setShowApptModal={setShowApptModal}
            setShowDateModal={setShowDateModal}
          />

          {/* EDIT MODE */}
          {isEditing && (
            <div className="space-y-4">
              <InputRow label="Name" value={form.name} onChange={(v) => handleChange("name", v)} />
              <InputRow label="Phone" value={form.phone} onChange={(v) => handleChange("phone", v)} />
              <InputRow label="Email" value={form.email} onChange={(v) => handleChange("email", v)} />
              <InputRow label="Address" value={form.address} onChange={(v) => handleChange("address", v)} />
              <InputRow label="City" value={form.city} onChange={(v) => handleChange("city", v)} />
              <InputRow label="State" value={form.state} onChange={(v) => handleChange("state", v)} />
              <InputRow label="Zip" value={form.zip} onChange={(v) => handleChange("zip", v)} />
              <InputRow label="Buyer Type" value={form.buyer_type} onChange={(v) => handleChange("buyer_type", v)} />
              <InputRow label="Company Name" value={form.company_name} onChange={(v) => handleChange("company_name", v)} />
              <InputRow label="Project Type" value={form.project_type} onChange={(v) => handleChange("project_type", v)} />
              <InputRow label="Lead Source" value={form.lead_source} onChange={(v) => handleChange("lead_source", v)} />
              <InputRow label="Referral Source" value={form.referral_source} onChange={(v) => handleChange("referral_source", v)} />
              <InputRow label="Contract Price" value={form.contract_price} onChange={(v) => handleChange("contract_price", v)} />
              <InputRow label="Preferred Contact" value={form.preferred_contact} onChange={(v) => handleChange("preferred_contact", v)} />
              <InputRow label="Notes" value={form.notes} onChange={(v) => handleChange("notes", v)} />
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <button
              onClick={handleExit}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-bold"
            >
              Exit
            </button>

            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
              >
                Edit
              </button>
            )}
          </div>

          {/* DELETE */}
          <div className="text-center pt-4">
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700"
              >
                Delete Contact
              </button>
            ) : (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => onDelete(form)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* MODALS */}
      {showDateModal && (
        <DateModal
          initialDate={form[showDateModal]}
          initialTentative={showDateModal === "install_date" ? form.install_tentative : false}
          allowTentative={showDateModal === "install_date"}
          label={showDateModal === "install_date" ? "Set Install Date" : "Select Date"}
          onConfirm={(d, t) => handleChange(showDateModal, d)}
          onRemove={() => handleChange(showDateModal, "")}
          onClose={() => setShowDateModal(null)}
        />
      )}

      {showApptModal && (
        <ApptDateTimeModal
          apptDate={form.apptDate}
          apptTime={form.apptTime}
          onConfirm={(d, t) => {
            setForm((prev) => ({
              ...prev,
              apptDate: d,
              apptTime: t,
            }));
          }}
          onRemove={() => {
            setForm((prev) => ({
              ...prev,
              apptDate: "",
              apptTime: "",
            }));
          }}
          onClose={() => setShowApptModal(false)}
        />
      )}

      {showNotSoldModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[999]">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-2">Reason Not Sold</h3>

            <div className="space-y-2">
              {notSoldReasons.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      not_sold_reason: r,
                      status: "Not Sold",
                    }));
                    setShowNotSoldModal(false);
                  }}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg text-left hover:bg-gray-200"
                >
                  {r}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNotSoldModal(false)}
              className="mt-4 w-full text-gray-600 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
