import React, { useState, useMemo, useEffect, useRef } from "react";
import { apiRequest } from "./api";
import LeadModal from "./LeadModal.jsx";
import CalendarView from "./CalendarView.jsx";
import PhoneLookupModal from "./PhoneLookupModal.jsx";
import SettingsMenu from "./SettingsMenu.jsx";
import { useCompany } from "./CompanyContext.jsx";
import { useAuth } from "./AuthContext.jsx";

// Convert backend snake_case → frontend camelCase
const convertLeadFromBackend = (lead) => {
  if (!lead) return null;

  return {
    id: lead.id,
    companyId: lead.company_id,
    createdByUserId: lead.created_by_user_id,

    name: lead.full_name || lead.name || "",
    firstName: lead.first_name || "",
    lastName: lead.last_name || "",

    phone: lead.phone,
    email: lead.email,
    preferredContact: lead.preferred_contact,

    address: lead.address,
    city: lead.city,
    state: lead.state,
    zip: lead.zip,

    buyerType: lead.buyer_type,
    companyName: lead.company_name,
    projectType: lead.project_type,

    leadSource: lead.lead_source,
    referralSource: lead.referral_source,

    status: lead.status,
    notSoldReason: lead.not_sold_reason,
    notes: lead.notes,

    contractPrice: lead.contract_price,

    apptDate: lead.appointment_date,
    apptTime: lead.appointment_time,
    installDate: lead.install_date,
    installTentative: lead.install_tentative,

    ghlContactId: lead.ghl_contact_id,
    ghlAppointmentId: lead.ghl_appointment_id,
    ghlLastSynced: lead.ghl_last_synced,
    ghlSyncStatus: lead.ghl_sync_status,

    createdAt: lead.created_at,
    updatedAt: lead.updated_at,
    needsSync: lead.needs_sync
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

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('/leads');
        const convertedLeads = (response.leads || []).map(convertLeadFromBackend);
        setLeads(convertedLeads);
      } catch (error) {
        console.error('Error fetching leads:', error);
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
    setIsNewLead(true);
  };

  const handleCreateNewFromLookup = (d) => {
    const mapped = {
      id: null,
      name: `${d.first_name || ""} ${d.last_name || ""}`.trim(),
      phone: d.phone_number || "",
      email: d.email || "",
      address: d.address || "",
      city: d.city || "",
      state: d.state || "",
      zip: d.zip || "",
      buyerType: "",
      companyName: "",
      projectType: "",
      leadSource: d.source || "",
      referralSource: d.referral_source || "",
      status: "lead",
      notSoldReason: "",
      contractPrice: "",
      apptDate: "",
      apptTime: "",
      installDate: "",
      installTentative: false,
      preferredContact: "",
      notes: ""
    };

    setSelectedLead(mapped);
    setIsNewLead(true);
    setShowPhoneLookup(false);
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
    setIsNewLead(false);
  };

  const handleSaveLead = async (lead) => {
    try {
      const backendLead = {
        name: lead.name || "",
        first_name: lead.firstName || "",
        last_name: lead.lastName || "",
        full_name: lead.name || "",

        phone: lead.phone || "",
        email: lead.email || "",
        address: lead.address || "",
        city: lead.city || "",
        state: lead.state || "",
        zip: lead.zip || "",

        buyer_type: lead.buyerType || "",
        company_name: lead.companyName || "",
        project_type: lead.projectType || "",

        // B2 RULE:
        lead_source:
          lead.leadSource && lead.leadSource.trim() !== ""
            ? lead.leadSource
            : null,

        referral_source: lead.referralSource || "",

        status: lead.status || "lead",
        not_sold_reason: lead.notSoldReason || "",

        contract_price: lead.contractPrice || null,

        appointment_date: lead.apptDate || null,
        appointment_time: lead.apptTime || null,
        install_date: lead.installDate || null,
        install_tentative: lead.installTentative || false,

        preferred_contact: lead.preferredContact || "",
        notes: lead.notes || ""
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
        isNewLead ? [...prev, converted] : prev.map((l) => (l.id === converted.id ? converted : l))
      );

      handleCloseModal();
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Failed to save lead: " + error.message);
    }
  };

  const handleDeleteLead = async (leadToDelete) => {
    try {
      await apiRequest(`/leads/${leadToDelete.id}`, { method: "DELETE" });
      setLeads((prev) => prev.filter((l) => l.id !== leadToDelete.id));
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert("Failed to delete lead: " + error.message);
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
                {currentCompany ? currentCompany : "Loading..."}
              </p>
            </div>
            <SettingsMenu />
          </div>
        </div>
      </div>

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
                className={`
                  px-6 py-3 rounded-lg font-semibold text-sm whitespace-nowrap
                  transition-all duration-200 transform hover:scale-105
                  ${
                    activeTab === tab.name
                      ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "Calendar" ? (
          <CalendarView leads={leads} onLeadClick={handleLeadClick} />
        ) : (
          <>
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

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading leads...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                <h3 className="mt-4 text-xl font-semibold text-gray-700">No leads yet</h3>
                <p className="mt-2 text-gray-500">Click "Add Lead" to create your first lead</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => handleLeadClick(lead)}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl 
                      transform hover:scale-105 transition-all duration-200 
                      cursor-pointer p-6 border-2 border-transparent hover:border-blue-300"
                  >
                    <h3 className="text-lg font-bold text-gray-900">{lead.name}</h3>
                    <p className="text-gray-600 mt-1">{lead.phone}</p>
                    {lead.email && (
                      <p className="text-gray-500 text-sm">{lead.email}</p>
                    )}
                    {lead.projectType && (
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 
                        rounded-full text-xs font-medium">
                        {lead.projectType}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

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
          onClose={() => setShowPhoneLookup(false)}
          onCreateNew={handleCreateNewFromLookup}
          onSelectLead={handleLeadClick}
        />
      )}
    </div>
  );
}
