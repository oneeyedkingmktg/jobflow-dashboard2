import React from "react";
import DateModal from "../DateModal.jsx";
import ApptDateTimeModal from "../ApptDateTimeModal.jsx";
import ReasonNotSoldModal from "../ReasonNotSoldModal.jsx";

export default function LeadModalsWrapper({
  form,
  setForm,
  showDateModal,
  setShowDateModal,
  showApptModal,
  setShowApptModal,
  showNotSoldModal,
  setShowNotSoldModal,
  onNotSoldSelect,
}) {
  return (
    <>
      {/* DATE MODAL (Install / Appointment Date) */}
      {showDateModal && (
        <DateModal
          initialDate={form[showDateModal]}
          initialTentative={
            showDateModal === "installDate" ? form.installTentative : false
          }
          allowTentative={showDateModal === "installDate"}
          label={
            showDateModal === "installDate"
              ? "Set Install Date"
              : "Select Date"
          }
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

      {/* APPOINTMENT DATE/TIME MODAL */}
      {showApptModal && (
        <ApptDateTimeModal
          apptDate={form.apptDate}
          apptTime={form.apptTime}
          onConfirm={(date, time) => {
            setForm((prev) => ({
              ...prev,
              apptDate: date,
              apptTime: time,
            }));
            setShowApptModal(false);
          }}
          onRemove={() => {
            setForm((prev) => ({
              ...prev,
              apptDate: "",
              apptTime: "",
            }));
            setShowApptModal(false);
          }}
          onClose={() => setShowApptModal(false)}
        />
      )}

      {/* NOT SOLD REASON MODAL */}
      {showNotSoldModal && (
        <ReasonNotSoldModal
          onSelect={(reason) => {
            onNotSoldSelect(reason);
            setShowNotSoldModal(false);
          }}
          onCancel={() => setShowNotSoldModal(false)}
        />
      )}
    </>
  );
}
