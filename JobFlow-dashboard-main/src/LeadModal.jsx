import React, { useState, useEffect } from "react";

import DateModal from "./DateModal.jsx";
import ApptDateTimeModal from "./ApptDateTimeModal.jsx";
import ReasonNotSoldModal from "./ReasonNotSoldModal.jsx";

import LeadHeader from "./leadModalParts/LeadHeader.jsx";
import LeadInfoCard from "./leadModalParts/LeadInfoCard.jsx";
import LeadEditForm from "./leadModalParts/LeadEditForm.jsx";
import LeadViewDetails from "./leadModalParts/LeadViewDetails.jsx";
import LeadFooter from "./leadModalParts/LeadFooter.jsx";

import { useCompany } from "./CompanyContext";
import { formatPhoneNumber } from "./utils/formatting";

const STATUS_COLORS = {
  lead: "#59687d",
  appointment_set: "#225ce5",
  sold: "#048c63",
  not_sold: "#c72020",
  complete: "#ea8e09",
};

// Split full name → first + last
const splitName = (full) => {
  if (!full || !full.trim()) return { first: "", last: "" };
  const parts = full.trim().split(" ");
  if (parts.length === 1) return { first: parts[0], last: "" };
  return {
    first: parts[0],
    last: parts.slice(1).join(" "),
  };
};

export default function LeadModal({
  lead,
  onClose,
  onSave,
  onDelete,
  presetPhone,
}) {
  const { currentCompany } = useCompany();

  // ------------------------------------
  // FORM STATE
  // ------------------------------------
  const [form, setForm] = useState({
    id: lead?.id || null,
    name: lead?.name || "",
    phone: lead?.phone || "",
    email: lead?.email || "",
    address: lead?.address || "",
    city: lead?.city || "",
    state: lead?.state || "",
    zip: lead?.zip || "",
    buyerType: lead?.buyerType || "",
    companyName: lead?.companyName || "",
    projectType: lead?.projectType || "",
    leadSource: lead?.leadSource || "",
    referralSource: lead?.referralSource || "",
    preferredContact: lead?.preferredContact || "",
    notes: lead?.notes || "",
    contractPrice: lead?.contractPrice || "",
    apptDate: lead?.apptDate || "",
    apptTime: lead?.apptTime || "",
    installDate: lead?.installDate || "",
    installTentative: lead?.installTentative || false,
    notSoldReason: lead?.notSoldReason || "",
    status: lead?.status || "lead",
  });

  const [isEditing, setIsEditing] = useState(!lead?.id);

  // MODALS
  const [showDateModal, setShowDateModal] = useState(null);
  const [showApptModal, setShowApptModal] = useState(false);
  const [showNotSoldModal, setShowNotSoldModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // ------------------------------------
  // PREFILL PHONE ON NEW LEAD
  // ------------------------------------
  useEffect(() => {
    if (!lead?.id && presetPhone) {
      setForm((prev) => ({
        ...prev,
        phone: formatPhoneNumber(presetPhone),
      }));
    }
  }, [presetPhone, lead]);

  // ------------------------------------
  // SAVE (stay inside modal)
  // ------------------------------------
  const handleSaveOnly = () => {
    const { first, last } = splitName(form.name);

    const updated = {
      ...form,
      firstName: first,
      lastName: last,
      full_name: form.name,
    };

    onSave(updated);
    setForm(updated);
    setIsEditing(false);
  };

  // ------------------------------------
  // EXIT (save + close modal)
  // ------------------------------------
  const handleExit = () => {
    const { first, last } = splitName(form.name);

    const updated = {
      ...form,
      firstName: first,
      lastName: last,
      full_name: form.name,
    };

    onSave(updated);
    onClose({ view: "home" });
  };

  // ------------------------------------
  // STATUS PROGRESSION
  // ------------------------------------
  const applyUpdates = (updates) => {
    const { first, last } = splitName(form.name);

    const updated = {
      ...form,
      ...updates,
      firstName: first,
      lastName: last,
      full_name: form.name,
    };

    setForm(updated);
    onSave(updated);
  };

  const handleSoldFromAppt = () => {
    applyUpdates({ status: "sold", notSoldReason: "" });
  };

  const handleNotSoldFromAppt = () => {
    setShowNotSoldModal(true);
  };

  const handleNotSoldReasonSelected = (reason) => {
    applyUpdates({ status: "not_sold", notSoldReason: reason });
    setShowNotSoldModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-auto">
      <div className="bg-[#f5f6f7] rounded-3xl shadow-2xl w-full max-w-3xl my-6 overflow-hidden">

        {/* ---------------- HEADER ---------------- */}
        <LeadHeader
          form={form}
          setForm={setForm}
          handleSoldFromAppt={handleSoldFromAppt}
          handleNotSoldFromAppt={handleNotSoldFromAppt}
        />

        {/* ---------------- MAIN BODY ---------------- */}
        <div className="px-6 py-6 space-y-6">

          {/* Info Cards */}
          <LeadInfoCard
            form={form}
            setShowApptModal={setShowApptModal}
            setShowDateModal={setShowDateModal}
          />

          {/* Edit OR View */}
          {isEditing ? (
            <LeadEditForm form={form} setForm={setForm} />
          ) : (
            <LeadViewDetails form={form} />
          )}

          {/* Footer Buttons */}
          <LeadFooter
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSaveOnly={handleSaveOnly}
            handleExit={handleExit}
            deleteConfirm={deleteConfirm}
            setDeleteConfirm={setDeleteConfirm}
            onDelete={() => onDelete(form)}
          />
        </div>
      </div>

      {/* DATE MODALS */}
      {showDateModal && (
        <DateModal
          initialDate={form[showDateModal]}
          initialTentative={
            showDateModal === "installDate" ? form.installTentative : false
          }
          allowTentative={showDateModal === "installDate"}
          label={showDateModal === "installDate" ? "Set Install Date" : "Select Date"}
          onConfirm={(date, tentative) => {
            setForm((prev) => ({
              ...prev,
              [showDateModal]: date,
              installTentative: tentative || false,
            }));
            setShowDateModal(null);
          }}
          onRemove={() => {
            setForm((prev) => ({
              ...prev,
              [showDateModal]: "",
              installTentative: false,
            }));
            setShowDateModal(null);
          }}
          onClose={() => setShowDateModal(null)}
        />
      )}

      {/* APPOINTMENT MODAL */}
      {showApptModal && (
        <ApptDateTimeModal
          apptDate={form.apptDate}
          apptTime={form.apptTime}
          onConfirm={(date, time) => {
            setForm((prev) => ({ ...prev, apptDate: date, apptTime: time }));
            setShowApptModal(false);
          }}
          onRemove={() => {
            setForm((prev) => ({ ...prev, apptDate: "", apptTime: "" }));
            setShowApptModal(false);
          }}
          onClose={() => setShowApptModal(false)}
        />
      )}

      {/* NOT SOLD MODAL */}
      {showNotSoldModal && (
        <ReasonNotSoldModal
          onSelect={handleNotSoldReasonSelected}
          onCancel={() => setShowNotSoldModal(false)}
        />
      )}
    </div>
  );
}
