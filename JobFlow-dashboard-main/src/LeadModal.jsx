import React, { useState, useEffect } from "react";
import DateModal from "./DateModal.jsx";
import ApptDateTimeModal from "./ApptDateTimeModal.jsx";
import ReasonNotSoldModal from "./ReasonNotSoldModal.jsx";
import { useCompany } from "./CompanyContext";
import { formatPhoneNumber } from "./utils/formatting";

const STATUS_LABELS = {
  lead: "Lead",
  appointment_set: "Appointment Set",
  sold: "Sold",
  not_sold: "Not Sold",
  complete: "Completed",
};

const STATUS_COLORS = {
  lead: "#59687d",
  appointment_set: "#225ce5",
  sold: "#048c63",
  not_sold: "#c72020",
  complete: "#ea8e09",
};

const STATUS_PROGRESS = {
  lead: "appointment_set",
  sold: "complete",
  not_sold: "sold",
  complete: null,
  appointment_set: null,
};

// NEW — Split the full name
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

  const [isEditing, setIsEditing] = useState(!lead?.id);
  const [showDateModal, setShowDateModal] = useState(null);
  const [showApptModal, setShowApptModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showNotSoldModal, setShowNotSoldModal] = useState(false);

  useEffect(() => {
    if (!lead?.id && presetPhone) {
      setForm((prev) => ({
        ...prev,
        phone: formatPhoneNumber(presetPhone),
      }));
    }
  }, [presetPhone, lead]);

  const formatDate = (value) => {
    if (!value) return "Not Set";
    const d = new Date(value);
    if (isNaN(d)) return "Not Set";
    return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const formatTime = (value) => {
    if (!value) return "";
    const parts = String(value).split(":");
    let hour = parseInt(parts[0], 10);
    const minutes = parts[1] || "00";
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minutes.padStart(2, "0")} ${ampm}`;
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhoneChange = (val) => {
    handleChange("phone", formatPhoneNumber(val));
  };

  // ----------------------
  // SAVE (stay on screen)
  // ----------------------
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

  // ----------------------
  // EXIT (save + close)
  // ----------------------
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

  // CALL, TEXT, MAPS
  const call = () => {
    if (!form.phone) return;
    window.open(`tel:${form.phone.replace(/[^\d]/g, "")}`);
  };

  const text = () => {
    if (!form.phone) return;
    window.open(`sms:${form.phone.replace(/[^\d]/g, "")}`);
  };

  const maps = () => {
    const query = `${form.address}, ${form.city}, ${form.state} ${form.zip}`;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        query
      )}`,
      "_blank"
    );
  };

  const currentStatus = form.status;
  const nextStatus = STATUS_PROGRESS[currentStatus] || null;
  const nextStatusLabel = nextStatus ? STATUS_LABELS[nextStatus] : null;
  const nextStatusColor = nextStatus ? STATUS_COLORS[nextStatus] : "#ccc";

  const statusOptions = [
    "lead",
    "appointment_set",
    "sold",
    "not_sold",
    "complete",
  ];

  const buyerTypes = [
    "Residential",
    "Small Business",
    "Buyer not Owner",
    "Competitive Bid",
  ];

  const preferredContacts = ["Phone", "SMS", "Email"];

  const projectTypes = [
    "Garage Floor",
    "Basement",
    "Patio",
    "Sidewalk",
    "Pool Deck",
    "Commercial",
  ];

  // ----------------------
  // Progress helpers
  // ----------------------
  const saveWithUpdates = (updates) => {
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

  const handleProgressNext = () => {
    if (!nextStatus) return;
    if (currentStatus === "not_sold" && nextStatus === "sold") {
      saveWithUpdates({ status: "sold", notSoldReason: "" });
    } else {
      saveWithUpdates({ status: nextStatus });
    }
  };

  const handleProgressSoldFromAppt = () => {
    saveWithUpdates({ status: "sold", notSoldReason: "" });
  };

  const handleProgressNotSoldFromAppt = () => {
    setShowNotSoldModal(true);
  };

  const handleNotSoldReasonSelected = (reason) => {
    saveWithUpdates({ status: "not_sold", notSoldReason: reason });
    setShowNotSoldModal(false);
  };

  const handleNotSoldCancel = () => {
    setShowNotSoldModal(false);
  };

  return (
    <>
      {/* (UNCHANGED RENDER CODE — OMITTED FOR BREVITY) */}
      {/* You keep ALL your UI exactly as it already was. */}
      {/* The full file here contains NO changes except name-handling above. */}

      {/* ...PASTE YOUR RENDER CODE EXACTLY AS IS... */}

      {/* NOT SOLD REASON MODAL */}
      {showNotSoldModal && (
        <ReasonNotSoldModal
          onSelect={handleNotSoldReasonSelected}
          onCancel={handleNotSoldCancel}
        />
      )}
    </>
  );
}
