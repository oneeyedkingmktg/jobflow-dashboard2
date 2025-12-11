// File: src/leadComponents/leadHelpers.js
// Created: 2025-12-10

// Normalizes DB dates including strange formats
export const normalizeDate = (d) => {
  if (!d) return "";
  const [datePart] = String(d).split(" ");

  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart;

  if (/^\d{2}-\d{2}-\d{2}$/.test(datePart)) {
    const [yy, mm, dd] = datePart.split("-");
    return `20${yy}-${mm}-${dd}`;
  }
  return datePart;
};

export const formatDisplayDate = (d) => {
  if (!d) return "";
  const [y, m, day] = normalizeDate(d).split("-");
  return `${m}/${day}/${y}`;
};

export const formatDisplayTime = (t) => {
  if (!t) return "";
  let [h, m] = t.split(":");
  h = parseInt(h, 10);
  return `${h % 12 || 12}:${m} ${h >= 12 ? "PM" : "AM"}`;
};

export const getStatusBarText = (lead) => {
  switch (lead.status) {
    case "appointment_set":
      const d = formatDisplayDate(lead.apptDate);
      const tm = formatDisplayTime(lead.apptTime);
      return d || tm ? `Appointment: ${d} ${tm}` : "Appointment Set";

    case "sold":
      if (lead.installDate) {
        const ds = formatDisplayDate(lead.installDate);
        return lead.installTentative
          ? `Install ${ds} (Tentative)`
          : `Install ${ds}`;
      }
      return "Sold";

    case "not_sold":
      return "Not Sold";

    case "complete":
      return "Completed";

    default:
      return "Lead";
  }
};
