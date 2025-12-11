// File: src/LeadsHome.jsx
// Updated: 2025-12-10 — Modular layout, search forces "All", hides in Calendar, phone search normalized

import React, { useState, useMemo, useEffect } from "react";
import { apiRequest } from "./api";
import LeadModal from "./LeadModal.jsx";
import CalendarView from "./CalendarView.jsx";
import PhoneLookupModal from "./PhoneLookupModal.jsx";
import { useCompany } from "./CompanyContext.jsx";
import { useAuth } from "./AuthContext.jsx";

// Home layout parts
import LeadsHeader from "./leadComponents/LeadsHeader.jsx";
import LeadsTabs from "./leadComponents/LeadsTabs.jsx";
import LeadsSearchBar from "./leadComponents/LeadsSearchBar.jsx";
import LeadsCardGrid from "./leadComponents/LeadsCardGrid.jsx";


// ===============================
// DATE NORMALIZATION
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

// ===============================
// CONVERT BACKEND → FRONTEND
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

  createdAt: lead.createdAt,
  updatedAt: lead.updatedAt,
});

// ===============================
// PHONE NORMALIZATION (for search)
// ===============================
const normalizePhone = (p) => (p ? p.replace(/\D/g, "") : "");

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
  const [searchArchived, setSearchArchived] = useState(false); // reserved for future

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
  // FILTERED LEADS
  // ===============================
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

    return leads.filter((lead) => {
      let tabMatch = true;

      switch (activeTab) {
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
          tabMatch = true;
          break;
        case "Calendar":
          tabMatch = false;
          break;
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
      isNewLead
        ? [...prev, updated]
        : prev.map((l) => (l.id === updated.id ? updated : l))
    );

    setSelectedLead(updated);
    setIsNewLead(false);
  };

  // ===============================
  // HANDLERS
  // ===============================
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    // All searches use ALL statuses
    if (value && activeTab !== "All") {
      setActiveTab("All");
    }
  };

  const handleNewLeadClick = () => {
    setSelectedLead(null);
    setIsNewLead(false);
    setShowPhoneLookup(true);
  };

  const handleCalendarClick = () => {
    setActiveTab("Calendar");
  };

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setIsNewLead(false);
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER (CoatingPro360, company name, settings) */}
      <LeadsHeader currentCompany={currentCompany} />

      {/* TABS + ACTION BUTTONS */}
      <LeadsTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={counts}
        onNewLeadClick={handleNewLeadClick}
        onCalendarClick={handleCalendarClick}
      />

      {/* SEARCH AREA (hidden in Calendar mode) */}
      {activeTab !== "Calendar" && (
        <LeadsSearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          searchArchived={searchArchived}
          onToggleArchived={setSearchArchived}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        {activeTab === "Calendar" ? (
          <CalendarView leads={leads} onLeadClick={handleLeadClick} />
        ) : loading ? (
          <div className="py-10 text-center text-gray-600">Loading...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No leads found.</div>
        ) : (
          <LeadsCardGrid leads={filteredLeads} onLeadClick={handleLeadClick} />
        )}
      </div>

      {/* LEAD MODAL */}
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

      {/* PHONE LOOKUP MODAL */}
      {showPhoneLookup && (
        <PhoneLookupModal
          leads={leads}
          onClose={() => setShowPhoneLookup(false)}
          onCreateNew={(phone) => {
            setSelectedLead({
              id: null,
              name: "",
              phone,
              status: "lead",
            });
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
