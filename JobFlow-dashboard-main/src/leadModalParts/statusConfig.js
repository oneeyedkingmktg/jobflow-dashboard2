// ===============================
// STATUS LABELS
// ===============================
export const STATUS_LABELS = {
  lead: "Lead",
  appointment_set: "Appointment Set",
  sold: "Sold",
  not_sold: "Not Sold",
  complete: "Completed",
};

// ===============================
// STATUS COLORS (From Your Spec)
// ===============================
export const STATUS_COLORS = {
  lead: "#59687d",          // Lead
  appointment_set: "#225ce5", // Booked Appt
  sold: "#048c63",          // Sold
  not_sold: "#c72020",      // Not Sold
  complete: "#ea8e09",      // Completed
};

// ===============================
// DEFAULT STATUS PROGRESSION
// (Appointment Set handled separately)
// ===============================
export const STATUS_PROGRESS = {
  lead: "appointment_set",
  sold: "complete",
  not_sold: "sold",
  complete: null,
  appointment_set: null,
};
