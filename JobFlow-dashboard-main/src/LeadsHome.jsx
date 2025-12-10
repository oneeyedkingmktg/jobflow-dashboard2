// File: src/LeadsHome.jsx - updated 2025-12-10

// === BACKEND API INTEGRATION - Connected to PostgreSQL ===
import React, { useState, useMemo, useEffect } from "react";
import { apiRequest } from "./api";
import LeadModal from "./LeadModal.jsx";
import CalendarView from "./CalendarView.jsx";
import PhoneLookupModal from "./PhoneLookupModal.jsx";
import SettingsMenu from "./SettingsMenu.jsx";
import { useCompany } from "./CompanyContext.jsx";
import { useAuth } from "./AuthContext.jsx";
import { STATUS_COLORS } from "./leadModalParts/statusConfig.js";

// =============================================
// Normalize DB/TinyTable dates → YYYY-MM-DD
// Handles:
//  - "2025-12-12"
//  - "2025-12-12 00:00:00"
//  - "25-12-16" (YY-MM-DD → 2025-12-16)
// =============================================
const normalizeDate = (d) => {
  if (!d) return "";

  let str = typeof d === "string" ? d : String(d);

  // Strip time if present (e.g. "2025-12-12 00:00:00")
  const [datePart] = str.split(" ");

  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    return datePart;
  }

  // YY-MM-DD → assume 20YY-MM-DD (25-12-16 → 2025-12-16)
  if (/^\d{2}-\d{2}-\d{2}$/.test(datePart)) {
    const [yy, mm, dd] = datePart.split("-");
    const year = `20${yy}`;
    return `${year}-${mm}-${dd}`;
  }

  // Fallback
  return datePart;
};

// Display date as MM/DD/YYYY
const formatDisplayDate = (d) => {
  if (!d) return "";
  const iso = normalizeDate(d);
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const [y, m, day] = parts;
  return `${m}/${day}/${y}`;
};

// Display time as h:mm AM/PM from "HH:mm"
const formatDisplayTime = (t) => {
  if (!t) return "";
  let [h, m] = t.split(":");
  h = parseInt(h, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

// Get status bar text for the card header
const getStatusBarText = (lead) => {
  const status = lead.status || "lead";

  if (status === "appointment_set") {
    const date = lead.apptDate ? formatDisplayDate(lead.apptDate) : "";
    const time = lead.apptTime ? formatDisplayTime(lead.apptTime) : "";
    if (!date && !time) return "Appointment Set";
    if (date && time) return `Appointment: ${date} ${time}`;
    if (date) return `Appointment: ${date}`;
    return "Appointment Set";
  }

  if (status === "sold") {
    if (lead.installDate) {
      const base = `Install ${formatDisplayDate(lead.installDate)}`;
      return lead.installTentative ? `${base} (Tentative)` : base;
    }
    return "Sold";
  }

  if (status === "not_sold") return "Not Sold";
  if (status === "complete") return "Completed";

  // default for 'lead' and any other
  return "Lead";
};

// Convert backend → frontend
const convertLeadFromBackend = (lead) => {
  if (!lead) return null;

  return {
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

    // dates
    apptDate: normalizeDate(lead.appointmentDate) || "",
    apptTime: lead.appointmentTime || "",
    installDate: normalizeDate(lead.installDate) || "",
    installTentative: lead.installTentative,

    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
};

export default function LeadsHome({ leads: initialLeads = [], currentUser }) {
  const { currentCompany } = useCompany();
  const { user } = useAuth();

  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("Leads");
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewLead, setIsNewLead] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPhoneLookup, setShowPhoneLookup] = useState(false);

  const tabColorClasses = {
    blue: "bg-gradient-to-r from-blue-500 to-blue-600",
    purple: "bg-gradient-to-r from-purple-500 to-purple-600",
    green: "bg-gradient-to-r from-green-500 to-green-600",
    red: "bg-gradient-to-r from-red-500 to-red-600",
    gray: "bg-gradient-to-r from-gray-500 to-gray-600",
    indigo: "bg-gradient-to-r from-indigo-500 to-indigo-600",
  };

  // FETCH LEADS
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/leads");
        const converted = (response.leads || []).map(convertLeadFromBackend);
        setLeads(converted);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setIsNewLead(false);
  };

  const handleAddLead = () => {
    setSelectedLead(null);
    setIsNewLead(false);
    setShowPhoneLookup(true);
  };

  const handlePhoneLookupCreateNew = (phone) => {
    const mapped = {
      id: null,
      companyId: currentCompany?.id || null,
      createdByUserId: user?.id || null,

      name: "",
      firstName: "",
      lastName: "",

      phone: phone || "",
      email: "",
      preferredContact: "",

      address: "",
      city: "",
      state: "",
      zip: "",

      buyerType: "",
      companyName: "",
      projectType: "",

      leadSource: "",
      referralSource: "",

      status: "lead",
      notSoldReason: "",
      notes: "",

      contractPrice: "",

      apptDate: "",
      apptTime: "",
      installDate: "",
      installTentative: false,
    };

    setSelectedLead(mapped);
    setIsNewLead(true);
    setShowPhoneLookup(false);
  };

  const handlePhoneLookupSelectExisting = (lead) => {
    if (!lead) return;
    setSelectedLead(lead);
    setIsNewLead(false);
    setShowPhoneLookup(false);
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
    setIsNewLead(false);
  };

  // SAVE LEAD
  const handleSaveLead = async (lead) => {
    try {
      const backendLead = {
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
          body: JSON.stringify(backendLead),
        });
      } else {
        response = await apiRequest(`/leads/${lead.id}`, {
          method: "PUT",
          body: JSON.stringify(backendLead),
        });
      }

      const converted = convertLeadFromBackend(response.lead);

      setLeads((prev) =>
        isNewLead
          ? [...prev, converted]
          : prev.map((l) => (l.id === converted.id ? converted : l))
      );

      setSelectedLead(converted);
      setIsNewLead(false);
    } catch (error) {
      console.error("Error saving lead:", error);
    }
  };

  const handleDeleteLead = async (leadToDelete) => {
    try {
      await apiRequest(`/leads/${leadToDelete.id}`, { method: "DELETE" });
      setLeads((prev) => prev.filter((l) => l.id !== leadToDelete.id));
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const tabMatch =
        activeTab === "Leads"
          ? lead.status === "lead"
          : activeTab === "Appointment Set"
          ? lead.status === "appointment_set"
          : activeTab === "Sold"
          ? lead.status === "sold"
          : activeTab === "Not Sold"
          ? lead.status === "not_sold"
          : activeTab === "Complete"
          ? lead.status === "complete"
          : true;

      const searchMatch =
        !searchTerm ||
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase());

      return tabMatch && searchMatch;
    });
  }, [leads, activeTab, searchTerm]);

  const leadCount = leads.filter((l) => l.status === "lead").length;
  const appointmentCount = leads.filter((l) => l.status === "appointment_set").length;
  const soldCount = leads.filter((l) => l.status === "sold").length;
  const notSoldCount = leads.filter((l) => l.status === "not_sold").length;
  const completeCount = leads.filter((l) => l.status === "complete").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Lead Pipeline</h1>
              <p className="text-blue-100 mt-1">
                {currentCompany?.name || "Loading..."}
              </p>
            </div>
            <SettingsMenu />
          </div>
        </div>
      </div>

      {/* STATUS TABS */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {[
              { name: "Leads", count: leadCount, color: "blue" },
              { name: "Appointment Set", count: appointmentCount, color: "purple" },
              { name: "Sold", count: soldCount, color: "green" },
              { name: "Not Sold", count: notSoldCount, color: "red" },
              { name: "Complete", count: completeCount, color: "gray" },
              { name: "Calendar", count: null, color: "indigo" },
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-6 py-3 rounded-lg font-semibold text-sm whitespace-nowrap
                  transition-all duration-200 transform hover:scale-105
                  ${
                    activeTab === tab.name
                      ? `${tabColorClasses[tab.color]} text-white shadow-lg`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {tab.name}
                {tab.count !== null && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white bg-opacity-30">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "Calendar" ? (
          <CalendarView leads={leads} onLeadClick={handleLeadClick} />
        ) : (
          <>
            {/* SEARCH BAR */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="🔍 Search leads by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                    transition-all duration-200 shadow-sm"
                />
              </div>

              <button
                onClick={() => setShowPhoneLookup(true)}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 
                  text-white rounded-xl font-semibold shadow-lg hover:shadow-xl 
                  transform hover:scale-105 transition-all duration-200"
              >
                Phone Lookup
              </button>

              <button
                onClick={handleAddLead}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 
                  text-white rounded-xl font-semibold shadow-lg hover:shadow-xl 
                  transform hover:scale-105 transition-all duration-200"
              >
                + Add Lead
              </button>
            </div>

            {/* LEAD LIST */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
                <p className="mt-4 text-gray-600">Loading leads...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                <h3 className="mt-4 text-xl font-semibold text-gray-700">
                  No leads yet
                </h3>
                <p className="mt-2 text-gray-500">
                  Click "Add Lead" to create your first lead
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredLeads.map((lead) => {
                  const headerColor =
                    STATUS_COLORS[lead.status] || STATUS_COLORS.lead;
                  const statusText = getStatusBarText(lead);

                  const cityState = [
                    lead.city || "",
                    lead.state || "",
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <div
                      key={lead.id}
                      onClick={() => handleLeadClick(lead)}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl 
                        transform hover:scale-105 transition-all duration-200 
                        cursor-pointer border-2 border-transparent hover:border-blue-300 overflow-hidden"
                    >
                      {/* STATUS BAR HEADER */}
                      <div
                        className="px-4 py-2 text-xs font-semibold text-white uppercase tracking-wide"
                        style={{
                          backgroundColor: headerColor,
                        }}
                      >
                        {statusText}
                      </div>

                      {/* CARD BODY */}
                      <div className="p-4 space-y-2">
                        {/* NAME */}
                        <h3 className="text-base font-bold text-gray-900 truncate">
                          {lead.name || "Unnamed Lead"}
                        </h3>

                        {/* BUYER TYPE + PROJECT LINE */}
                        {(lead.buyerType || lead.projectType) && (
                          <div className="flex items-center gap-2 text-xs mt-1">
                            {lead.buyerType && (
                              <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                                {lead.buyerType}
                              </span>
                            )}
                            {lead.projectType && (
                              <span className="text-gray-700 truncate">
                                Project:{" "}
                                <span className="font-semibold">
                                  {lead.projectType}
                                </span>
                              </span>
                            )}
                          </div>
                        )}

                        {/* CITY / STATE */}
                        {cityState && (
                          <div className="pt-2 text-xs text-gray-500">
                            {cityState}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      {(selectedLead || isNewLead) && (
        <LeadModal
          lead={selectedLead}
          onClose={handleCloseModal}
          onSave={handleSaveLead}
          onDelete={handleDeleteLead}
          currentUser={currentUser}
        />
      )}

      {showPhoneLookup && (
        <PhoneLookupModal
          leads={leads}
          onClose={() => setShowPhoneLookup(false)}
          onCreateNew={handlePhoneLookupCreateNew}
          onSelectExisting={handlePhoneLookupSelectExisting}
        />
      )}
    </div>
  );
}
