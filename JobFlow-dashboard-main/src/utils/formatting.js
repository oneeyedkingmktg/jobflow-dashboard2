// ============================================================================
// Formatting Utilities (Frontend Safe)
// ============================================================================

// Format date from "YYYY-MM-DD" → "MM-DD-YYYY"
export const formatDate = (value) => {
  if (!value) return "Not Set";
  const d = new Date(value + "T00:00:00");
  if (isNaN(d)) return "Not Set";

  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${mm}-${dd}-${yyyy}`;
};

// Format time from "HH:mm" → "h:mm AM/PM"
export const formatTime = (value) => {
  if (!value) return "Not Set";

  const [hourStr, minute] = value.split(":");
  let hour = parseInt(hourStr, 10);
  if (isNaN(hour)) return value;

  const ampm = hour >= 12 ? "PM" : "AM";
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute} ${ampm}`;
};
