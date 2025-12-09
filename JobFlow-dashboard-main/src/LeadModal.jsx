import React, { useState, useEffect } from "react";
import { useCompany } from "./CompanyContext";
import { formatPhoneNumber } from "./utils/formatting";

// Modular Parts
import LeadHeader from "./leadModalParts/LeadHeader.jsx";
import LeadAddressBox from "./leadModalParts/LeadAddressBox.jsx";
import LeadContactSection from "./leadModalParts/LeadContactSection.jsx";
import LeadAppointmentSection from "./leadModalParts/LeadAppointmentSection.jsx";
import LeadDetailsEdit from "./leadModalParts/LeadDetailsEdit.jsx";
import LeadDetailsView from "./leadModalParts/LeadDetailsView.jsx";
import LeadFooter from "./leadModalParts/LeadFooter.jsx";
import LeadModalsWrapper from "./leadModalParts/LeadModalsWrapper.jsx";
import LeadStatusBar from "./leadModalParts/LeadStatusBar.jsx";

// Convert camelCase → snake_case (backend format)
const toBackend = (form) => ({
  id: form.id,
  name: form.name,
  phone: form.phone,
  email: form.email,
  address: form.address,
  city: form.city,
  state: form.state,
  zip: form.zip,

  buyer_type: form.buyerType,
  company_name: form.companyName,
  project_type: form.projectType,
  lead_source: form.leadSource,
  referral_source: form.referralSource,

  status: form.status,
  not_sold_reason: form.notSoldReason,
  contract_price: form.contractPrice,

  appointment_date: form.apptDate,
  preferred_contact: form.preferredContact,
  notes: form.notes,

  install_date: form.installDate,
  install_tentative: form.installTentative,
});

// Split full name
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

  // UI STATE
  const [isEditing, setIsEditing] = useState(!lead?.id);
  const [showDateModal, setShowDateModal] = useState(null);
  const [showApptModal, setShowApptModal] = useState(false);
  const [showNotSoldModal, setShowNotSoldModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Prefill phone for new leads
  useEffect(() => {
    if (!lead?.id && presetPhone) {
      setForm((prev) => ({
        ...prev,
        phone: formatPhoneNumber(presetPhone),
      }));
    }
  }, [presetPhone, lead]);

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handlePhoneChange = (val) =>
    handleChange("phone", formatPhoneNumber(val));

  // SAVE (stay in modal)
  const handleSave = () => {
    const payload = toBackend(form);
    onSave(payload);
    setIsEditing(false);
  };

  // EXIT (save then close)
  const handleExit = () => {
    const payload = toBackend(form);
    onSave(payload);
    onClose({ view: "home" });
  };

  const handleNotSoldSelect = (reason) => {
    const updated = { ...form, status: "not_sold", notSoldReason: reason };
    setForm(updated);
    onSave(toBackend(updated));
  };

  // OPEN MAPS
  const handleMaps = () => {
    const query = `${form.address}, ${form.city}, ${form.state} ${form.zip}`;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      "_blank"
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-auto">
      <div className="bg-[#f5f6f7] rounded-3xl shadow-2xl w-full max-w-3xl my-6 overflow-hidden">

        <LeadHeader
          name={form.name}
          status={form.status}
          phone={form.phone}
          onCall={() =>
            window.open(`tel:${form.phone.replace(/[^\d]/g, "")}`)
          }
          onText={() =>
            window.open(`sms:${form.phone.replace(/[^\d]/g, "")}`)
          }
          onMap={handleMaps}
        />

        <div className="px-6 py-6 space-y-5">
          <LeadStatusBar
            form={form}
            setForm={setForm}
            onOpenNotSold={() => setShowNotSoldModal(true)}
            onOpenApptModal={() => setShowApptModal(true)}
          />

          <LeadAddressBox form={form} onOpenMaps={handleMaps} />

          <LeadContactSection form={form} />

          <LeadAppointmentSection
            form={form}
            setShowApptModal={setShowApptModal}
            setShowDateModal={setShowDateModal}
          />

          {isEditing ? (
            <LeadDetailsEdit
              form={form}
              onChange={handleChange}
              onPhoneChange={handlePhoneChange}
            />
          ) : (
            <LeadDetailsView
              form={form}
              onEdit={() => setIsEditing(true)}
            />
          )}

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
