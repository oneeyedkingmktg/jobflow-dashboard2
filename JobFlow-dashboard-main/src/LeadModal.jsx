import React, { useState, useEffect } from "react";
import { useCompany } from "./CompanyContext";
import { formatPhoneNumber } from "./utils/formatting";

// Modular Parts
import LeadHeader from "./leadModalParts/LeadHeader.jsx";
import LeadStatusBar from "./leadModalParts/LeadStatusBar.jsx";
import LeadAddressBox from "./leadModalParts/LeadAddressBox.jsx";
import LeadContactSection from "./leadModalParts/LeadContactSection.jsx";
import LeadAppointmentSection from "./leadModalParts/LeadAppointmentSection.jsx";
import LeadDetailsEdit from "./leadModalParts/LeadDetailsEdit.jsx";
import LeadDetailsView from "./leadModalParts/LeadDetailsView.jsx";
import LeadFooter from "./leadModalParts/LeadFooter.jsx";
import LeadModalsWrapper from "./leadModalParts/LeadModalsWrapper.jsx";

// Constants
const STATUS_COLORS = {
  lead: "#59687d",
  appointment_set: "#225ce5",
  sold: "#048c63",
  not_sold: "#c72020",
  complete: "#ea8e09",
};

// Split "Full Name" into first + last
const splitName = (full) => {
  if (!full || !full.trim()) return { first: "", last: "" };
  const parts = full.trim().split(" ");
  if (parts.length === 1) return { first: parts[0], last: "" };
  return {
    first: parts[0],
    last: parts.slice(1).join(" "),
  };
};

export default function LeadModal({ lead, onClose, onSave, onDelete, presetPhone }) {
  const { currentCompany } = useCompany();

  // Form State
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

  // UI State
  const [isEditing, setIsEditing] = useState(!lead?.id);
  const [showDateModal, setShowDateModal] = useState(null);
  const [showApptModal, setShowApptModal] = useState(false);
  const [showNotSoldModal, setShowNotSoldModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Prefill phone if new lead
  useEffect(() => {
    if (!lead?.id && presetPhone) {
      setForm((prev) => ({
        ...prev,
        phone: formatPhoneNumber(presetPhone),
      }));
    }
  }, [presetPhone, lead]);

  // Update helper
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhoneChange = (val) => {
    handleChange("phone", formatPhoneNumber(val));
  };

  // SAVE (Stay open)
  const handleSave = () => {
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

  // EXIT (Save + close)
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

  // Not Sold → Reason modal selection
  const handleNotSoldSelect = (reason) => {
    const updated = {
      ...form,
      status: "not_sold",
      notSoldReason: reason,
    };
    setForm(updated);
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-auto">
      <div className="bg-[#f5f6f7] rounded-3xl shadow-2xl w-full max-w-3xl my-6 overflow-hidden">

        {/* HEADER */}
        <LeadHeader
          name={form.name}
          status={form.status}
          phone={form.phone}
          onCall={() => window.open(`tel:${form.phone.replace(/[^\d]/g, "")}`)}
          onText={() => window.open(`sms:${form.phone.replace(/[^\d]/g, "")}`)}
          onMap={() => {
            const query = `${form.address}, ${form.city}, ${form.state} ${form.zip}`;
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                query
              )}`,
              "_blank"
            );
          }}
        />

        {/* BODY */}
        <div className="px-6 py-6 space-y-5">

          {/* STATUS BAR */}
          <LeadStatusBar
            form={form}
            setForm={setForm}
            onOpenNotSold={() => setShowNotSoldModal(true)}
          />

          {/* ADDRESS BOX */}
          <LeadAddressBox form={form} onMapClick={() => {}} />

          {/* PHONE + LEAD SOURCE */}
          <LeadContactSection form={form} />

          {/* APPOINTMENTS */}
          <LeadAppointmentSection
            form={form}
            setShowApptModal={setShowApptModal}
            setShowDateModal={setShowDateModal}
          />

          {/* EDIT MODE or VIEW MODE */}
          {isEditing ? (
            <LeadDetailsEdit
              form={form}
              onChange={handleChange}
              onPhoneChange={handlePhoneChange}
            />
          ) : (
            <LeadDetailsView form={form} />
          )}

          {/* FOOTER BUTTONS */}
          <LeadFooter
            isEditing={isEditing}
            onSave={handleSave}
            onEdit={() => setIsEditing(true)}
            onExit={handleExit}
            deleteConfirm={deleteConfirm}
            setDeleteConfirm={setDeleteConfirm}
            onDelete={() => onDelete(form)}
          />
        </div>
      </div>

      {/* MODALS */}
      <LeadModalsWrapper
        form={form}
        setForm={setForm}
        showDateModal={showDateModal}
        setShowDateModal={setShowDateModal}
        showApptModal={showApptModal}
        setShowApptModal={setShowApptModal}
        showNotSoldModal={showNotSoldModal}
        setShowNotSoldModal={setShowNotSoldModal}
        onNotSoldSelect={handleNotSoldSelect}
      />
    </div>
  );
}
