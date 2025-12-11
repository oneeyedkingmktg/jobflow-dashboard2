// File: src/LeadsHome.jsx
// Converted to modular components — 2025-12-10

import React, { useState, useMemo, useEffect } from "react";
import { apiRequest } from "./api";

import LeadModal from "./LeadModal.jsx";
import CalendarView from "./CalendarView.jsx";
import PhoneLookupModal from "./PhoneLookupModal.jsx";
import SettingsMenu from "./SettingsMenu.jsx";

import { useCompany } from "./CompanyContext.jsx";
import { useAuth } from "./AuthContext.jsx";

import LeadTabs from "./leadComponents/LeadTabs.jsx";
import LeadSearchBar from "./leadComponents/LeadSearchBar.jsx";
import LeadCard from "./leadComponents/LeadCard.jsx";

import { normalizePhone } from "./leadComponents/leadHelpers.js";

// Convert backend → frontend
import {
  normalizeDate,
} from "./leadComponents/leadHelpers.js";

// ---------------------------------------------
// Backend → frontend mapping
// ---------------------------------------------
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

// ---------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------
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

  // ---------------------------------------------
  // Fetch Leads
  // ---------------------------------------------
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

  // ---------------------------------------------
  // Tabs
  // ---------------------------------------------
  const TABS = ["Leads", "Booked Appt", "Sold", "Not Sold", "Completed", "All"];

  const counts = {
    Leads: leads.filter((l) => l.status === "lead").length,
    "Booked Appt": leads.filter((l) => l.status === "appointment_set").length,
    Sold: leads.filter((l) => l.status === "sold").length,
    "Not Sold": leads.filter((l) => l.status === "not_sold").length,
    Completed: leads.filter((l) => l.status === "complete").length,
    All: leads.length,
  };

  // ---------------------------------------------
  // Search + Filtering
  // ---------------------------------------------
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
      let match = true;

      switch (activeTab) {
        case "Leads": match = lead.status === "lead"; break;
        case "Booked Appt": match = lead.status === "appointment_set"; break;
        case "Sold": match = lead.status === "sold"; break;
        case "Not Sold": match = lead.status === "not_sold"; break;
        case "Completed": match = lead.status === "complete"; break;
        case "All": match = true; break;
        case "Calendar": match = false; break;
      }

      return match && matchesSearch(lead);
    });
  }, [leads, activeTab, searchTerm]);

  // ---------------------------------------------
  // SAVE LEAD
  // ---------------------------------------------
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
      response = await apiRequest("/leads", { method: "POST", body: JSON.stringify(payload) });
    } else {
      response = await apiRequest(`/leads/${lead.id}`, { method: "PUT", body: JSON.stringify(payload) });
    }

    const updated = convertLeadFromBackend(response.lead);

    setLeads((prev) =>
      isNewLead ? [...prev, updated] : prev.map((l) => (l.id === updated.id ? updated : l))
    );

    setSelectedLead(updated);
    setIsNewLead(false);
  };

  // ---------------------------------------------
  // UI
  // ---------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER — CoatingPro360 */}
      <div className="bg-[#225ce5] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">CoatingPro360</h1>
            <p className="text-blue-100">{currentCompany?.name || ""}</p>
          </div>
          <SettingsMenu />
        </div>
      </div>

      {/* TABS */}
      <LeadTabs
        TABS={TABS}
        activeTab={activeTab}
        counts={counts}
        onTabChange={(tab) => setActiveTab(tab)}
        onAddLead={() => {
          setSelectedLead(null);
          setIsNewLead(false);
          setShowPhoneLookup(true);
        }}
        onOpenCalendar={() => setActiveTab("Calendar")}
      />

      {/* SEARCH BAR */}
      <LeadSearchBar
        searchTerm={searchTerm}
        setSearchTerm={(v) => {
          setSearchTerm(v);
          setActiveTab("All");
        }}
        searchArchived={searchArchived}
        setSearchArchived={setSearchArchived}
      />

      {/* MAIN CONTENT */}
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
