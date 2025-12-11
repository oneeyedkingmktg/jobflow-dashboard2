// File: src/LeadsHome.jsx
// Updated 2025-12-10 – single-file version, no leadComponents imports
// - Mobile tab grid + desktop row
// - Lead cards with colored status bar
// - Phone search normalization
// - Search always uses ALL statuses
// - Search hidden on Calendar tab

import React, { useState, useMemo, useEffect } from "react";
import { apiRequest } from "./api";
import LeadModal from "./LeadModal.jsx";
import CalendarView from "./CalendarView.jsx";
import PhoneLookupModal from "./PhoneLookupModal.jsx";
import SettingsMenu from "./SettingsMenu.jsx";
import { useCompany } from "./CompanyContext.jsx";
import { useAuth } from "./AuthContext.jsx";
import { STATUS_COLORS } from "./leadModalParts/statusConfig.js";

// ===============================
// DATE + DISPLAY HELPERS
// ===============================
const normalizeDate = (d) => {
  if (!d) return "";
  const [datePart] = String(d).split(" ");

  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart;

  if (/^\d{2}-\d{2}-\d{2}$/.test(datePart)) {
    const [yy, mm, dd] = datePart.split("-");
    return `20${yy}-${mm}-${dd}`;
  }

  return datePart;
};

const formatDisplayDate = (d) => {
  if (!d) return "";
  const iso = normalizeDate(d);
  const [y, m, day] = iso.split("-");
  return `${m}/${day}/${y}`;
};

const formatDisplayTime = (t) => {
  if (!t) return "";
  let [h, m] = t.split(":");
  h = parseInt(h, 10);
  return `${h % 12 || 12}:${m} ${h >= 12 ? "PM" : "AM"}`;
};

const getStatusBarText = (lead) => {
  switch (lead.status) {
    case "appointment_set": {
      const d = formatDisplayDate(lead.apptDate);
      const t = formatDisplayTime(lead.apptTime);
      return d || t ? `Appointment: ${d} ${t}` : "Appointment Set";
    }
    case "sold": {
      if (lead.installDate) {
        const ds = formatDisplayDate(lead.installDate);
        return lead.installTentative ? `Install ${ds} (Tentative)` : `Install ${ds}`;
      }
      return "Sold";
    }
    case "not_sold":
      return "Not Sold";
    case "complete":
      return "Completed";
    default:
      return "Lead";
  }
};

// phone normalization for searching
const normalizePhone = (p) => p?.replace(/\D/g, "") || "";

// ===============================
// BACKEND → FRONTEND
// ===============================
const convertLeadFromBackend = (lead) => ({
  id: lead.id,
  companyId: lead.companyId,
  createdByUserId: lead.createdByUserId,

  name: lead.fullName || lead.name || "",
  firstName: lead.firstName || "",
  lastName: lead.lastName || "",

  phone: lead.phone,
  email: lead.email,
  preferredContact: lead.preferredContact,

  address: lead.address,
  city: lead.city,
  state: lead.state,
  zip: lead.zip,

  buyerType: lead.buyerType,
  companyName: lead.companyName,
  projectType: lead.projectType,

  leadSource: lead.leadSource,
  referralSource: lead.referralSource,

  status: lead.status,
  notSoldReason: lead.notSoldReason,
  notes: lead.notes,

  contractPrice: lead.contractPrice,

  apptDate: normalizeDate(lead.appointmentDate),
  apptTime: lead.appointmentTime || "",
  installDate: normalizeDate(lead.installDate),
  installTentative: lead.installTentative,
});

// ===============================
// MAIN COMPONENT
// ===============================
export default function LeadsHome({ currentUser }) {
  const { currentCompany } = useCompany();
  const { user } = useAuth();

  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("Leads");
  const [selectedLead, setSelectedLead] = useState(null);
  const [isNewLead, setIsNewLead] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchArchived, setSearchArchived] = useState(false); // wired later if/when we add Archive

  const [loading, setLoading] = useState(true);
  const [showPhoneLookup, setShowPhoneLookup] = useState(false);

  // ===============================
  // FETCH LEADS
  // ===============================
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await apiRequest("/leads");
        setLeads((res.leads || []).map(convertLeadFromBackend));
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // ===============================
  // TAB LIST + COUNTS
  // ===============================
  const TABS = ["Leads", "Booked Appt", "Sold", "Not Sold", "Completed", "All"];

  const counts = {
    Leads: leads.filter((l) => l.status === "lead").length,
    "Booked Appt": leads.filter((l) => l.status === "appointment_set").length,
    Sold: leads.filter((l) => l.status === "sold").length,
    "Not Sold": leads.filter((l) => l.status === "not_sold").length,
    Completed: leads.filter((l) => l.status === "complete").length,
    All: leads.length,
  };

  // ===============================
  // SEARCH + FILTER
  // ===============================
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // whenever there is a search term, we treat it as "All"
    if (value.trim() !== "" && activeTab !== "All" && activeTab !== "Calendar") {
      setActiveTab("All");
    }
  };

  const filteredLeads = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const termDigits = normalizePhone(searchTerm);

    const matchesSearch = (lead) => {
      if (!term && !termDigits) return true;
      const nameMatch = lead.name?.toLowerCase().includes(term);
      const cityMatch = lead.city?.toLowerCase().includes(term);
      const phoneMatch = normalizePhone(lead.phone || "").includes(termDigits);
      return nameMatch || cityMatch || phoneMatch;
    };

    const effectiveTab = term || termDigits ? "All" : activeTab;

    return leads.filter((lead) => {
      let tabMatch = true;

      switch (effectiveTab) {
        case "Leads":
          tabMatch = lead.status === "lead";
          break;
        case "Booked Appt":
          tabMatch = lead.status === "appointment_set";
          break;
        case "Sold":
          tabMatch = lead.status === "sold";
          break;
        case "Not Sold":
          tabMatch = lead.status === "not_sold";
          break;
        case "Completed":
          tabMatch = lead.status === "complete";
          break;
        case "All":
        default:
          tabMatch = true;
      }

      return tabMatch && matchesSearch(lead);
    });
  }, [leads, activeTab, searchTerm]);

  // ===============================
  // SAVE LEAD
  // ===============================
  const handleSaveLead = async (lead) => {
    const payload = {
      name: lead.name || "",
      full_name: lead.name || "",
      first_name: lead.firstName || "",
      last_name: lead.lastName || "",
      phone: lead.phone || "",
      email: lead.email || "",
      address: lead.address || "",
      city: lead.city || "",
      state: lead.state || "",
      zip: lead.zip || "",
      buyer_type: lead.buyerType || "",
      company_name: lead.companyName || "",
      project_type: lead.projectType || "",
      lead_source: lead.leadSource || "",
      referral_source: lead.referralSource || "",
      preferred_contact: lead.preferredContact || "",
      notes: lead.notes || "",
      status: lead.status || "lead",
      not_sold_reason: lead.notSoldReason || "",
      contract_price: lead.contractPrice || null,
      appointment_date: lead.apptDate || null,
      appointment_time: lead.apptTime || null,
      install_date: lead.installDate || null,
      install_tentative: lead.installTentative || false,
    };

    let response;
    if (isNewLead) {
      response = await apiRequest("/leads", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } else {
      response = await apiRequest(`/leads/${lead.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    }

    const updated = convertLeadFromBackend(response.lead);

    setLeads((prev) =>
      isNewLead ? [...prev, updated] : prev.map((l) => (l.id === updated.id ? updated : l))
    );

    setSelectedLead(updated);
    setIsNewLead(false);
  };

  // ===============================
  // NEW LEAD / PHONE LOOKUP
  // ===============================
  const handleNewLeadClick = () => {
    setSelectedLead(null);
    setIsNewLead(false);
    setShowPhoneLookup(true);
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-[#225ce5] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">CoatingPro360</h1>
            <p className="text-blue-100">{currentCompany?.name || ""}</p>
          </div>
          <SettingsMenu />
        </div>
      </div>

      {/* TABS + ACTION BUTTONS */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div
            className="
              grid grid-cols-2 gap-3
              sm:flex sm:flex-wrap sm:gap-3
            "
          >
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    w-full sm:w-auto
                    px-4 py-3 rounded-xl font-semibold text-sm
                    text-center shadow-sm transition-all
                    ${active
                      ? "bg-[#225ce5] text-white shadow-md"
                      : "bg-white text-gray-800 border"
                    }
                  `}
                >
                  {tab} ({counts[tab]})
                </button>
              );
            })}

            <button
              onClick={handleNewLeadClick}
              className="
                w-full sm:w-auto
                px-4 py-3 rounded-xl font-semibold text-sm text-center
                bg-green-600 text-white shadow-md hover:bg-green-700
              "
            >
              + New Lead
            </button>

            <button
              onClick={() => setActiveTab("Calendar")}
              className="
                w-full sm:w-auto
                px-4 py-3 rounded-xl font-semibold text-sm text-center
                bg-indigo-600 text-white shadow-md hover:bg-indigo-700
              "
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH – hidden on Calendar */}
      {activeTab !== "Calendar" && (
        <div className="max-w-7xl mx-auto px-4 mt-5 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="text"
              placeholder="Search by name, phone or city"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 border rounded-lg shadow-sm"
            />

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={searchArchived}
                onChange={(e) => setSearchArchived(e.target.checked)}
              />
              Also search archived
            </label>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        {activeTab === "Calendar" ? (
          <CalendarView leads={leads} onLeadClick={setSelectedLead} />
        ) : loading ? (
          <div className="py-10 text-center text-gray-600">Loading...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No leads found.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map((lead) => {
              const headerColor = STATUS_COLORS[lead.status] || STATUS_COLORS.lead;
              const cityState = [lead.city, lead.state].filter(Boolean).join(", ");

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="bg-white rounded-xl shadow cursor-pointer hover:shadow-lg transition border overflow-hidden"
                >
                  <div
                    className="px-4 py-2 text-xs font-semibold text-white uppercase tracking-wide"
                    style={{ backgroundColor: headerColor }}
                  >
                    {getStatusBarText(lead)}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-base font-bold text-gray-900 truncate">
                      {lead.name || "Unnamed Lead"}
                    </h3>

                    {(lead.buyerType || lead.projectType) && (
                      <div className="flex items-center gap-2 text-xs mt-1">
                        {lead.buyerType && (
                          <span className="px-2 py-1 bg-blue-100 rounded-full text-blue-700 font-semibold">
                            {lead.buyerType}
                          </span>
                        )}
                        {lead.projectType && (
                          <span className="text-gray-700">
                            Project: <span className="font-semibold">{lead.projectType}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {cityState && (
                      <div className="pt-2 text-xs text-gray-500">{cityState}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODALS */}
      {(selectedLead || isNewLead) && (
        <LeadModal
          lead={selectedLead}
          onClose={() => {
            setSelectedLead(null);
            setIsNewLead(false);
          }}
          onSave={handleSaveLead}
          currentUser={currentUser}
          onDelete={() => {}}
        />
      )}

      {showPhoneLookup && (
        <PhoneLookupModal
          leads={leads}
          onClose={() => setShowPhoneLookup(false)}
          onCreateNew={(phone) => {
            setSelectedLead({ id: null, name: "", phone, status: "lead" });
            setIsNewLead(true);
            setShowPhoneLookup(false);
          }}
          onSelectExisting={(lead) => {
            setSelectedLead(lead);
            setIsNewLead(false);
            setShowPhoneLookup(false);
          }}
        />
      )}
    </div>
  );
}
