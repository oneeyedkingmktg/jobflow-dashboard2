// File: src/LeadsHome.jsx
// Updated: 2025-12-11 — ISO date fix + compatible with existing leadComponents folder

import React, { useState, useMemo, useEffect } from "react";
import { apiRequest } from "./api";

import LeadModal from "./LeadModal.jsx";
import CalendarView from "./CalendarView.jsx";
import PhoneLookupModal from "./PhoneLookupModal.jsx";
import SettingsMenu from "./SettingsMenu.jsx";

import { useCompany } from "./CompanyContext.jsx";
import { useAuth } from "./AuthContext.jsx";

// FIXED: correct filename = LeadHeader.jsx
import LeadsHeader from "./leadComponents/LeadHeader.jsx"; 

import LeadTabs from "./leadComponents/LeadTabs.jsx";
import LeadSearchBar from "./leadComponents/LeadSearchBar.jsx";
import LeadCard from "./leadComponents/LeadCard.jsx";

import {
  STATUS_COLORS,
  getStatusBarText,
  normalizePhone,
} from "./leadComponents/leadHelpers.js";

// ==================================================
// DATE NORMALIZATION — UPDATED FOR ISO TIMESTAMPS
// ==================================================
const normalizeDate = (d) => {
  if (!d) return "";

  let str = String(d).trim();

  // Handle ISO timestamp: "2025-12-16T00:00:00.000Z"
  if (str.includes("T")) {
    str = str.split("T")[0];
  }

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

  // YY-MM-DD → convert to 20YY-MM-DD
  if (/^\d{2}-\d{2}-\d{2}$/.test(str)) {
    const [yy, mm, dd] = str.split("-");
    return `20${yy}-${mm}-${dd}`;
  }

  return str;
};

// ==================================================
// Convert backend → frontend
// ==================================================
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

  // Dates normalized correctly
  apptDate: normalizeDate(lead.appointmentDate),
  apptTime: lead.appointmentTime || "",
  installDate: normalizeDate(lead.installDate),
  installTentative: lead.installTentative,
});

// ==================================================
// MAIN COMPONENT
// ==================================================
export default function LeadsHome({ currentUser }) {
  const { currentCompany } = useCompany();
  const { user } = useAuth();

  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("Leads");

  const [selectedLead, setSelectedLead] = useState(null);
  const [isNewLead, setIsNewLead] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchArchived, setSearchArchived] = useState(false);

  const [loading, setLoading] = useState(true);
  const [showPhoneLookup, setShowPhoneLookup] = useState(false);

  // Load leads
  useEffect(() => {
    const loadLeads = async () => {
      try {
        const res = await apiRequest("/leads");
        setLeads((res.leads || []).map(convertLeadFromBackend));
      } finally {
        setLoading(false);
      }
    };
    loadLeads();
  }, []);

  // ==================================================
  // Search filtering
  // ==================================================
  const filteredLeads = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const digits = normalizePhone(searchTerm);

    const matchesSearch = (lead) => {
      const nameMatch = lead.name?.toLowerCase().includes(term);
      const cityMatch = lead.city?.toLowerCase().includes(term);
      const phoneMatch = normalizePhone(lead.phone || "").includes(digits);

      return nameMatch || cityMatch || phoneMatch;
    };

    return leads.filter((lead) => {
      let m = true;

      switch (activeTab) {
        case "Leads": m = lead.status === "lead"; break;
        case "Booked Appt": m = lead.status === "appointment_set"; break;
        case "Sold": m = lead.status === "sold"; break;
        case "Not Sold": m = lead.status === "not_sold"; break;
        case "Completed": m = lead.status === "complete"; break;
        case "All": m = true; break;
        case "Calendar": m = false; break;
      }

      return m && matchesSearch(lead);
    });
  }, [leads, activeTab, searchTerm]);

  // Counts for tabs
  const counts = {
    Leads: leads.filter((l) => l.status === "lead").length,
    "Booked Appt": leads.filter((l) => l.status === "appointment_set").length,
    Sold: leads.filter((l) => l.status === "sold").length,
    "Not Sold": leads.filter((l) => l.status === "not_sold").length,
    Completed: leads.filter((l) => l.status === "complete").length,
    All: leads.length,
  };

  // ============================================
  // SAVE lead
  // ============================================
  const handleSaveLead = async (lead) => {
    const body = {
      name: lead.name,
      full_name: lead.name,
      first_name: lead.firstName,
      last_name: lead.lastName,
      phone: lead.phone,
      email: lead.email,
      address: lead.address,
      city: lead.city,
      state: lead.state,
      zip: lead.zip,
      buyer_type: lead.buyerType,
      company_name: lead.companyName,
      project_type: lead.projectType,
      lead_source: lead.leadSource,
      referral_source: lead.referralSource,
      preferred_contact: lead.preferredContact,
      notes: lead.notes,
      status: lead.status,
      not_sold_reason: lead.notSoldReason,
      contract_price: lead.contractPrice,
      appointment_date: lead.apptDate,
      appointment_time: lead.apptTime,
      install_date: lead.installDate,
      install_tentative: lead.installTentative,
    };

    let resp;
    if (isNewLead) {
      resp = await apiRequest("/leads", { method: "POST", body: JSON.stringify(body) });
    } else {
      resp = await apiRequest(`/leads/${lead.id}`, { method: "PUT", body: JSON.stringify(body) });
    }

    const updated = convertLeadFromBackend(resp.lead);

    setLeads((prev) =>
      isNewLead ? [...prev, updated] : prev.map((l) => (l.id === updated.id ? updated : l))
    );

    setSelectedLead(updated);
    setIsNewLead(false);
  };

  // ============================================
  // UI Rendering
  // ============================================
  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <LeadsHeader companyName={currentCompany?.name} />

      {/* TABS */}
      <LeadTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
        onAddLead={() => {
          setSelectedLead(null);
          setIsNewLead(true);
          setShowPhoneLookup(true);
        }}
      />

      {/* SEARCH BAR (hidden in Calendar) */}
      {activeTab !== "Calendar" && (
        <LeadSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchArchived={searchArchived}
          setSearchArchived={setSearchArchived}
        />
      )}

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 pb-10">

        {activeTab === "Calendar" ? (
          <CalendarView leads={leads} onLeadClick={setSelectedLead} />
        ) : loading ? (
          <div className="py-10 text-center text-gray-600">Loading...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No leads found.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => setSelectedLead(lead)}
              />
            ))}
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
