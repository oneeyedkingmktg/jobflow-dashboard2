// ============================================================================
// File: src/LeadsHome.jsx
// Version: v2.2 - Robust field handling with empty string defaults and error handling
// ============================================================================

import React, { useState, useMemo, useEffect } from "react";
import { apiRequest } from "./api";

import LeadModal from "./LeadModal.jsx";
import CalendarView from "./CalendarView.jsx";
import PhoneLookupModal from "./PhoneLookupModal.jsx";
import SettingsMenu from "./SettingsMenu.jsx";

import { useCompany } from "./CompanyContext.jsx";
import { useAuth } from "./AuthContext.jsx";

// Header component (correct case for Vercel)
import LeadHeader from "./leadComponents/LeadHeader.jsx";

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

  if (str.includes("T")) {
    str = str.split("T")[0];
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

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
  // AUTO SWITCH TO "ALL" TAB WHEN SEARCHING
  // ==================================================
  useEffect(() => {
    if (searchTerm && activeTab !== "All") {
      setActiveTab("All");
    }
  }, [searchTerm]);

  // ==================================================
  // Filtering
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

    // Filter by currentCompany first
    const companyFiltered = currentCompany 
      ? leads.filter((lead) => lead.companyId === currentCompany.id)
      : leads;

    return companyFiltered.filter((lead) => {
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
  }, [leads, activeTab, searchTerm, currentCompany]);

  // Tab counts - filter by currentCompany
  const companyLeads = currentCompany 
    ? leads.filter((l) => l.companyId === currentCompany.id)
    : leads;

  const counts = {
    Leads: companyLeads.filter((l) => l.status === "lead").length,
    "Booked Appt": companyLeads.filter((l) => l.status === "appointment_set").length,
    Sold: companyLeads.filter((l) => l.status === "sold").length,
    "Not Sold": companyLeads.filter((l) => l.status === "not_sold").length,
    Completed: companyLeads.filter((l) => l.status === "complete").length,
    All: companyLeads.length,
  };

  // ==================================================
  // Save lead (NOW RETURNS updated lead)
  // ==================================================
  const handleSaveLead = async (lead) => {
    console.log("handleSaveLead called with:", lead);
    console.log("isNewLead:", isNewLead);
    console.log("currentCompany:", currentCompany);

    // Build body with all fields in snake_case format
    const body = {
      // Name fields - send both formats to work with any backend version
      name: lead.name || "",
      full_name: lead.name || "",
      
      // Contact
      phone: lead.phone || "",
      email: lead.email || "",
      preferred_contact: lead.preferredContact || "",
      
      // Address
      address: lead.address || "",
      city: lead.city || "",
      state: lead.state || "",
      zip: lead.zip || "",
      
      // Business info
      buyer_type: lead.buyerType || "",
      company_name: lead.companyName || "",
      project_type: lead.projectType || "",
      
      // Lead tracking
      lead_source: lead.leadSource || "",
      referral_source: lead.referralSource || "",
      
      // Status and notes
      status: lead.status || "lead",
      not_sold_reason: lead.notSoldReason || "",
      notes: lead.notes || "",
      contract_price: lead.contractPrice || "",
      
      // Appointments
      appointment_date: lead.apptDate || null,
      appointment_time: lead.apptTime || "",
      install_date: lead.installDate || null,
      install_tentative: lead.installTentative || false,
      
      // Company assignment
      company_id: lead.companyId || currentCompany?.id,
    };

    console.log("Body to send:", body);

    let resp;
    try {
      if (isNewLead || !lead.id) {
        console.log("Creating new lead (POST)");
        resp = await apiRequest("/leads", {
          method: "POST",
          body: JSON.stringify(body),
        });
      } else {
        console.log("Updating existing lead (PUT)", lead.id);
        resp = await apiRequest(`/leads/${lead.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      }

      console.log("API response:", resp);

      const updated = convertLeadFromBackend(resp.lead);

      setLeads((prev) =>
        isNewLead || !lead.id ? [...prev, updated] : prev.map((l) => (l.id === updated.id ? updated : l))
      );

      setSelectedLead(updated);
      setIsNewLead(false);

      // IMPORTANT FIX — required for Save & Exit
      return updated;
    } catch (error) {
      console.error("handleSaveLead error:", error);
      throw error;
    }
  };

  // ==================================================
  // UI
  // ==================================================
  return (
    <div className="min-h-screen bg-gray-100">

      <LeadHeader companyName={currentCompany?.name} />

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

      {activeTab !== "Calendar" && (
        <LeadSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchArchived={searchArchived}
          setSearchArchived={setSearchArchived}
        />
      )}

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
