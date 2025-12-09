// === BACKEND API INTEGRATION - Connected to PostgreSQL ===
import React, { useState, useMemo, useEffect } from "react";
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

    createdAt: lead.created_at,
    updatedAt: lead.updated_at,
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

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/leads");
        const convertedLeads = (response.leads || []).map(convertLeadFromBackend);
        setLeads(convertedLeads);
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

      apptDate: null,
      apptTime: null,
      installDate: null,
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

  // ✔ UPDATED — name is now included
  const handleSaveLead = async (lead) => {
    try {
      const backendLead = {
        name: lead.name || "", // REQUIRED FIELD

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
    <div className="min-h

