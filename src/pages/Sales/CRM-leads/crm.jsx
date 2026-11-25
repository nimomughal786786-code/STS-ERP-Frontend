import { useEffect, useMemo, useState } from "react";
import LeadModal from "../../../models/leadmodel";
import InteractionModal from "../../../models/interactionmodel";
import QuotesModal from "../../../models/quotesmodal";
import CustomerModal from "../../../models/customermodal";
import { useNavigate } from "react-router-dom";






function CRM({
  quotes = [],
  onQuotesChange,
  orders = [],
  customers = [],
  onCustomersChange,
  leads = [],
  onLeadsChange,
  notifications = [],
  readNotifications = [],
  addNotification,
  markAllNotificationsRead,
  markNotificationRead,
}) {
  const [activeTab, setActiveTab] = useState("pipe");

  const [interactions, setInteractions] = useState([]);

  const [surveyFilter, setSurveyFilter] = useState("All Types");
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showSurveyModal, setShowSurveyModal] = useState(false);

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedQuoteSurvey, setSelectedQuoteSurvey] = useState(null);

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleOutsideClick = (event) => {
      const notificationArea =
        event.target.closest("[data-notification-area]");

      if (!notificationArea) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);



  const [surveys] = useState([
    {
      id: "SV-001",
      type: "Solar Assessment",
      customer: "Shahid Iqbal",
      location: "Bedian Rd, Lahore",
      date: new Date(),
      by: "Usman Khan",
      status: "reviewed",
      details:
        "Elevated structure needed. Good sun exposure. Roof area 3000 sqft. Recommended 8KW hybrid system.",
    },
    {
      id: "SV-002",
      type: "CCTV Site Survey",
      customer: "Ahmed Raza",
      location: "DHA Phase 5, Lahore",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      by: "Ali Hassan",
      status: "pending",
      details:
        "8 cameras recommended. Server room on ground floor. IP cameras preferred. NVR setup required.",
    },
  ]);

  const employees = [
    { id: 1, name: "Usman Khan" },
    { id: 2, name: "Ali Hassan" },
    { id: 3, name: "Rameez Ahmed" },
  ];

  // =============================
  // SEARCH / FILTER STATES
  // =============================

  const [pipelineSearch, setPipelineSearch] = useState("");
  const [pipelineService, setPipelineService] = useState("");

  const [leadSearch, setLeadSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");

  // =============================
  // MODALS
  // =============================

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const [showInteractionModal, setShowInteractionModal] =
    useState(false);

  // =============================
  // HELPERS
  // =============================

  const fPKR = (value) => {
    return `PKR ${Number(value || 0).toLocaleString("en-PK", {
      minimumFractionDigits: 0,
    })}`;
  };

  const fD = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    return `bdg d-${status || "new"}`;
  };



  // =============================
  // GLOBAL SEARCH
  // =============================

  const handleGlobalSearch = () => {
    const value = globalSearch.trim().toLowerCase();

    if (!value) return;

    // Search Leads
    const foundLead = leads.find((lead) =>
      `${lead.id || ""} ${lead.name || ""} ${lead.company || ""
        } ${lead.phone || ""} ${lead.email || ""} ${lead.service || ""
        } ${lead.stage || ""} ${lead.assignedTo || ""}`
        .toLowerCase()
        .includes(value)
    );

    if (foundLead) {
      setActiveTab("leads");
      setLeadSearch(value);
      setShowNotifications(false);
      return;
    }

    // Search Customers
    const foundCustomer = customers.find((customer) =>
      `${customer.id || ""} ${customer.name || ""} ${customer.company || ""
        } ${customer.email || ""} ${customer.phone || ""} ${customer.city || ""
        }`
        .toLowerCase()
        .includes(value)
    );

    if (foundCustomer) {
      setActiveTab("custs");
      setCustomerSearch(value);
      setShowNotifications(false);
      return;
    }

    // Search Surveys
    const foundSurvey = surveys.find((survey) =>
      `${survey.id || ""} ${survey.type || ""} ${survey.customer || ""
        } ${survey.location || ""} ${survey.by || ""} ${survey.status || ""
        }`
        .toLowerCase()
        .includes(value)
    );

    if (foundSurvey) {
      setActiveTab("surv");
      setSurveyFilter(foundSurvey.type || "All Types");
      setShowNotifications(false);
      return;
    }

    // Other Modules
    if (
      value.includes("order") ||
      value.includes("sale")
    ) {
      navigate("/orders");
      return;
    }

    if (
      value.includes("quote") ||
      value.includes("quotation") ||
      value.includes("lpo")
    ) {
      navigate("/quotes");
      return;
    }

    if (
      value.includes("invoice") ||
      value.includes("billing") ||
      value.includes("payment")
    ) {
      navigate("/invoices");
      return;
    }

    if (
      value.includes("product") ||
      value.includes("stock") ||
      value.includes("inventory")
    ) {
      navigate("/products");
      return;
    }

    if (
      value.includes("employee") ||
      value.includes("staff") ||
      value.includes("team")
    ) {
      navigate("/employees");
      return;
    }

    if (
      value.includes("expense") ||
      value.includes("accounting") ||
      value.includes("finance")
    ) {
      navigate("/accounting");
      return;
    }

    if (
      value.includes("price") ||
      value.includes("monitor")
    ) {
      navigate("/pricemonitor");
      return;
    }

    alert("No matching result found.");
  };






  // =============================
  // CENTRAL NOTIFICATIONS
  // =============================

  const unreadNotifications = notifications.filter(
    (notification) =>
      !readNotifications.includes(notification.id)
  );


  console.log("CRM notifications:", notifications);
  console.log("CRM read:", readNotifications);
  console.log("CRM unread:", unreadNotifications);



  // =============================
  // SURVEY PDF
  // =============================

  const handleSurveyPDF = (survey) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow popups to generate the PDF.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Survey Report - ${survey.id}</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #222;
          }

          .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #0A3D62;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }

          h1 {
            color: #0A3D62;
            margin: 0;
          }

          .info {
            margin-bottom: 25px;
          }

          .info p {
            margin: 8px 0;
          }

          .section {
            margin-top: 25px;
          }

          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #0A3D62;
            margin-bottom: 10px;
          }

          .details {
            background: #f5f6f8;
            padding: 15px;
            border-radius: 8px;
            line-height: 1.7;
          }

          .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 5px;
            background: #e8f1f8;
            font-weight: bold;
          }
        </style>
      </head>

      <body>

        <div class="header">

          <div>
            <h1>SURVEY REPORT</h1>
            <p>${survey.id || ""}</p>
          </div>

          <div>
            <p>
              <strong>Date:</strong>
              ${fD(survey.date)}
            </p>
          </div>

        </div>

        <div class="info">

          <p>
            <strong>Survey Type:</strong>
            ${survey.type || ""}
          </p>

          <p>
            <strong>Customer:</strong>
            ${survey.customer || ""}
          </p>

          <p>
            <strong>Location:</strong>
            ${survey.location || ""}
          </p>

          <p>
            <strong>Surveyed By:</strong>
            ${survey.by || ""}
          </p>

          <p>
            <strong>Status:</strong>
            <span class="status">
              ${survey.status || "Pending"}
            </span>
          </p>

        </div>

        <div class="section">

          <div class="section-title">
            Survey Details / Report
          </div>

          <div class="details">
            ${survey.details || "No details available."}
          </div>

        </div>

      </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
    };
  };

  // =============================
  // LEAD MODAL
  // =============================

  const handleAddLead = () => {
    setEditingLead(null);
    setShowLeadModal(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setShowLeadModal(true);
  };

  const handleCloseLeadModal = () => {
    setShowLeadModal(false);
    setEditingLead(null);
  };

  // =============================
  // SAVE LEAD
  // =============================

  const handleSaveLead = (leadData) => {
    // EDIT
    if (editingLead) {
      onLeadsChange?.((previousLeads) =>
        previousLeads.map((lead) =>
          lead.id === editingLead.id
            ? {
              ...leadData,
              id: editingLead.id,
              created:
                editingLead.created ||
                new Date().toISOString().split("T")[0],
            }
            : lead
        )
      );

      // Backend TODO:
      // Later send lead update notification to PHP/MySQL backend.
    }

    // ADD
    else {
      const newLead = {
        ...leadData,
        id: `LD-${Date.now()}`,
        created: new Date().toISOString().split("T")[0],
      };

      onLeadsChange?.((previousLeads) => [
        newLead,
        ...previousLeads,
      ]);

      // Central notification
      addNotification?.({
        type: "lead_created",
        title: "New Lead Created",
        message: `${newLead.name || "New lead"} has been added.`,
        action: () => {
          setActiveTab("leads");
          setLeadSearch(newLead.name || "");
        },
      });

      // Backend TODO:
      // Later save this notification in PHP/MySQL notifications table.
    }

    setShowLeadModal(false);
    setEditingLead(null);
  };

  // =============================
  // DELETE LEAD
  // =============================

  const handleDeleteLead = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmDelete) return;

    onLeadsChange?.((previousLeads) =>
      previousLeads.filter((lead) => lead.id !== id)
    );
  };

  // =============================
  // EXPORT LEADS
  // =============================

  const handleExportLeads = () => {
    if (filteredLeads.length === 0) {
      alert("No leads available to export.");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Company",
      "Phone",
      "Email",
      "City",
      "Service",
      "Value",
      "Priority",
      "Stage",
      "Assigned To",
      "Notes",
      "Created",
    ];

    const rows = filteredLeads.map((lead) => [
      lead.id || "",
      lead.name || "",
      lead.company || "",
      lead.phone || "",
      lead.email || "",
      lead.city || "",
      lead.service || "",
      lead.value || 0,
      lead.priority || "",
      lead.stage || "",
      lead.assignedTo || "",
      lead.notes || "",
      lead.created || "",
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "CRM-Leads.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =============================
  // CUSTOMER
  // =============================

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowCustomerModal(true);
  };

  // =============================
  // INTERACTION
  // =============================

  const handleOpenInteraction = () => {
    setShowInteractionModal(true);
  };

  const handleSaveInteraction = (interactionData) => {
    const newInteraction = {
      ...interactionData,
      id: `IT-${Date.now()}`,
      by: "Current User",
    };

    setInteractions((previous) => [
      newInteraction,
      ...previous,
    ]);

    setShowInteractionModal(false);
  };

  // =============================
  // PIPELINE FILTER
  // =============================

  const filteredPipelineLeads = useMemo(() => {
    const search = pipelineSearch.toLowerCase().trim();

    return leads.filter((lead) => {
      const matchSearch =
        !search ||
        String(lead.name || "")
          .toLowerCase()
          .includes(search);

      const matchService =
        !pipelineService ||
        lead.service === pipelineService;

      return matchSearch && matchService;
    });
  }, [leads, pipelineSearch, pipelineService]);

  // =============================
  // LEADS TABLE FILTER
  // =============================

  const filteredLeads = useMemo(() => {
    const search = leadSearch.toLowerCase().trim();

    return leads.filter((lead) => {
      return (
        !search ||
        `${lead.name || ""} ${lead.phone || ""} ${lead.company || ""
          }`
          .toLowerCase()
          .includes(search)
      );
    });
  }, [leads, leadSearch]);

  // =============================
  // CUSTOMER FILTER
  // =============================

  const filteredCustomers = useMemo(() => {
    const search = customerSearch.toLowerCase().trim();

    return customers.filter((customer) => {
      return (
        !search ||
        `${customer.name || ""} ${customer.company || ""
          } ${customer.email || ""} ${customer.phone || ""}`
          .toLowerCase()
          .includes(search)
      );
    });
  }, [customers, customerSearch]);

  // =============================
  // PIPELINE STAGES
  // =============================

  const pipelineStages = [
    {
      key: "new",
      label: "New",
      color: "#94a3b8",
    },
    {
      key: "qualified",
      label: "Qualified",
      color: "#1565a8",
    },
    {
      key: "proposal",
      label: "Proposal",
      color: "#F0A500",
    },
    {
      key: "won",
      label: "Won",
      color: "#16a34a",
    },
    {
      key: "lost",
      label: "Lost",
      color: "#dc2626",
    },
  ];

  // =============================
  // PIPELINE KPI
  // =============================

  const totalLeads = leads.length;

  const wonLeads = leads.filter(
    (lead) => lead.stage === "won"
  );

  const pipelineValue = leads.reduce(
    (total, lead) =>
      total + Number(lead.value || 0),
    0
  );

  const winRate = totalLeads
    ? `${Math.round(
      (wonLeads.length / totalLeads) * 100
    )}%`
    : "0%";









  return (



    <div className="main">

      {/* ================= TOPBAR ================= */}

      <div className="topbar">

        <div>
          <div className="tbh1">
            CRM & Leads
          </div>

          <div className="tbsub">
            Customer relationships & pipeline
          </div>
        </div>

        <div
          className="tbr"
          style={{ position: "relative" }}
        >

          <input
            className="tsrch"
            placeholder="Search..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleGlobalSearch();
              }
            }}
          />

          <button
            className="tibtn"
            title="Price updates"
            onClick={() => navigate("/pricemonitor")}
          >
            💱
          </button>

          <button
            className="tibtn"
            title="New orders"
            onClick={() => navigate("/orders")}
          >
            📦
          </button>

          <button
            className="tibtn"
            title="Notifications"
            data-notification-area
            onClick={() =>
              setShowNotifications((previous) => !previous)
            }
            style={{ position: "relative" }}
          >
            🔔

            {unreadNotifications.length > 0 && (
              <span className="ndot"></span>
            )}
          </button>

          {/* ================= NOTIFICATION DROPDOWN ================= */}

          {showNotifications && (
            <div
              data-notification-area
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: "0",
                width: "340px",
                maxHeight: "420px",
                overflowY: "auto",
                background: "#fff",
                border: "1px solid var(--br)",
                borderRadius: "10px",
                boxShadow: "0 10px 30px rgba(0,0,0,.12)",
                zIndex: 9999,
              }}
            >

              <div
                style={{
                  padding: ".75rem",
                  borderBottom: "1px solid var(--br)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong>Notifications</strong>

                {unreadNotifications.length > 0 && (
                  <button
                    className="btn bgh bxs"
                    onClick={markAllNotificationsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length > 0 ? (
                notifications.map((notification) => {

                  const isRead =
                    readNotifications.includes(notification.id);

                  return (
                    <div
                      key={notification.id}
                      onClick={() => {

                        if (!isRead) {
                          markNotificationRead?.(
                            notification.id
                          );
                        }

                        notification.action();
                      }}
                      style={{
                        padding: ".75rem",
                        borderBottom: "1px solid var(--br)",
                        cursor: "pointer",
                        background: isRead
                          ? "#fff"
                          : "#f5f9ff",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: ".5rem",
                        }}
                      >

                        <strong
                          style={{
                            fontSize: ".78rem",
                          }}
                        >
                          {notification.title}
                        </strong>

                        {!isRead && (
                          <span
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              background: "var(--r)",
                              flexShrink: 0,
                              marginTop: "4px",
                            }}
                          />
                        )}

                      </div>

                      <div
                        style={{
                          fontSize: ".7rem",
                          color: "var(--mu)",
                          marginTop: ".2rem",
                          lineHeight: "1.5",
                        }}
                      >
                        {notification.message}
                      </div>

                    </div>
                  );

                })
              ) : (
                <div
                  style={{
                    padding: "1.5rem",
                    textAlign: "center",
                    color: "var(--mu)",
                    fontSize: ".75rem",
                  }}
                >
                  No notifications
                </div>
              )}

            </div>
          )}

        </div>

      </div>



      {/* ================= CONTENT ================= */}

      <div className="content">

        <div
          className="view active"
          id="v-crm"
        >

          {/* ================= TABS ================= */}

          <div className="tabs">

            <button
              className={`tab ${activeTab === "pipe"
                ? "active"
                : ""
                }`}
              onClick={() => setActiveTab("pipe")}
            >
              🔀 Pipeline
            </button>

            <button
              className={`tab ${activeTab === "leads"
                ? "active"
                : ""
                }`}
              onClick={() => setActiveTab("leads")}
            >
              🎯 All Leads
            </button>

            <button
              className={`tab ${activeTab === "custs"
                ? "active"
                : ""
                }`}
              onClick={() => setActiveTab("custs")}
            >
              👥 Customers
            </button>

            <button
              className={`tab ${activeTab === "inter"
                ? "active"
                : ""
                }`}
              onClick={() => setActiveTab("inter")}
            >
              💬 Interactions
            </button>

            <button
              className={`tab ${activeTab === "surv"
                ? "active"
                : ""
                }`}
              onClick={() => setActiveTab("surv")}
            >
              📋 Surveys
            </button>

          </div>

          {/* =====================================================
                PIPELINE
            ===================================================== */}

          {activeTab === "pipe" && (

            <div>

              <div
                className="kg"
                style={{
                  marginBottom: ".85rem",
                }}
              >

                <div className="kpi">
                  <div className="kico ib">
                    🎯
                  </div>

                  <div>
                    <div className="kval">
                      {totalLeads}
                    </div>

                    <div className="klbl">
                      Total Leads
                    </div>
                  </div>
                </div>

                <div className="kpi">
                  <div className="kico ig">
                    🏆
                  </div>

                  <div>
                    <div className="kval">
                      {wonLeads.length}
                    </div>

                    <div className="klbl">
                      Won
                    </div>
                  </div>
                </div>

                <div className="kpi">
                  <div className="kico io">
                    💰
                  </div>

                  <div>
                    <div className="kval">
                      {fPKR(pipelineValue)}
                    </div>

                    <div className="klbl">
                      Pipeline Value
                    </div>
                  </div>
                </div>

                <div className="kpi">
                  <div className="kico ip">
                    📊
                  </div>

                  <div>
                    <div className="kval">
                      {winRate}
                    </div>

                    <div className="klbl">
                      Win Rate
                    </div>
                  </div>
                </div>

              </div>

              <div
                className="fb"
                style={{
                  marginBottom: ".85rem",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: ".4rem",
                }}
              >

                <div className="fb">

                  <input
                    className="sb"
                    placeholder="Search leads..."
                    value={pipelineSearch}
                    onChange={(e) =>
                      setPipelineSearch(
                        e.target.value
                      )
                    }
                  />

                  <select
                    className="fsl"
                    value={pipelineService}
                    onChange={(e) =>
                      setPipelineService(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      All Services
                    </option>

                    <option value="solar">
                      Solar
                    </option>

                    <option value="cctv">
                      CCTV
                    </option>

                    <option value="it">
                      IT
                    </option>

                    <option value="fence">
                      Electric Fence
                    </option>

                  </select>

                </div>

                <button
                  className="btn bp"
                  onClick={handleAddLead}
                >
                  + Add Lead
                </button>

              </div>

              <div className="pipeline">

                {pipelineStages.map((stage) => {

                  const stageLeads =
                    filteredPipelineLeads.filter(
                      (lead) =>
                        lead.stage === stage.key
                    );

                  const stageValue =
                    stageLeads.reduce(
                      (total, lead) =>
                        total +
                        Number(lead.value || 0),
                      0
                    );

                  return (
                    <div
                      className="pcol"
                      key={stage.key}
                    >

                      <div className="pcolhd">

                        <span
                          style={{
                            color: stage.color,
                          }}
                        >
                          {stage.label}
                        </span>

                        <span className="bdg d-new">
                          {stageLeads.length}
                        </span>

                      </div>

                      <div
                        style={{
                          fontSize: ".67rem",
                          color: "var(--mu)",
                          marginBottom: ".5rem",
                        }}
                      >
                        {fPKR(stageValue)}
                      </div>

                      {stageLeads.map((lead) => (

                        <div
                          className="pcard"
                          key={lead.id}
                          onClick={() =>
                            handleEditLead(lead)
                          }
                        >

                          <div className="pcid">
                            {lead.id}
                          </div>

                          <div className="pcname">
                            {lead.name}
                          </div>

                          <div className="pcval">
                            {fPKR(lead.value)}
                          </div>

                          <div className="pctag">

                            <span
                              className={getStatusClass(
                                lead.service
                              )}
                            >
                              {lead.service}
                            </span>

                            {" "}

                            <span
                              className={getStatusClass(
                                lead.priority
                              )}
                            >
                              {lead.priority}
                            </span>

                          </div>

                          <div
                            style={{
                              fontSize: ".63rem",
                              color: "var(--mu)",
                              marginTop: ".2rem",
                            }}
                          >
                            👤{" "}
                            {lead.assignedTo ||
                              "Unassigned"}
                          </div>

                        </div>

                      ))}

                    </div>
                  );
                })}

              </div>

            </div>
          )}

          {/* =====================================================
                ALL LEADS
            ===================================================== */}

          {activeTab === "leads" && (

            <div>

              <div className="fr">

                <input
                  className="sb"
                  placeholder="Search leads..."
                  value={leadSearch}
                  onChange={(e) =>
                    setLeadSearch(e.target.value)
                  }
                />

                <button
                  className="btn bp"
                  onClick={handleAddLead}
                >
                  + Add Lead
                </button>

                <button
                  className="btn bgh bsm"
                  onClick={handleExportLeads}
                >
                  ⬇ Export
                </button>

              </div>

              <div className="card">

                <div className="tw">

                  <table className="tbl">

                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Service</th>
                        <th>Phone</th>
                        <th>Value</th>
                        <th>Stage</th>
                        <th>Priority</th>
                        <th>Assigned</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredLeads.length > 0 ? (

                        filteredLeads.map((lead) => (

                          <tr key={lead.id}>

                            <td>
                              <strong>
                                {lead.name}
                              </strong>
                            </td>

                            <td>
                              <span
                                className={getStatusClass(
                                  lead.service
                                )}
                              >
                                {lead.service}
                              </span>
                            </td>

                            <td>
                              {lead.phone}
                            </td>

                            <td className="mn">
                              {fPKR(lead.value)}
                            </td>

                            <td>
                              <span
                                className={getStatusClass(
                                  lead.stage
                                )}
                              >
                                {lead.stage}
                              </span>
                            </td>

                            <td>
                              <span
                                className={getStatusClass(
                                  lead.priority
                                )}
                              >
                                {lead.priority}
                              </span>
                            </td>

                            <td>
                              {lead.assignedTo ||
                                "—"}
                            </td>

                            <td>

                              <div
                                style={{
                                  display: "flex",
                                  gap: ".28rem",
                                }}
                              >

                                <button
                                  className="btn bgh bxs"
                                  onClick={() =>
                                    handleEditLead(
                                      lead
                                    )
                                  }
                                >
                                  ✏️
                                </button>

                                <button
                                  className="btn br2 bxs"
                                  onClick={() =>
                                    handleDeleteLead(
                                      lead.id
                                    )
                                  }
                                >
                                  🗑
                                </button>

                              </div>

                            </td>

                          </tr>

                        ))

                      ) : (

                        <tr>

                          <td colSpan="8">

                            <div className="empty">

                              <div className="eico">
                                🎯
                              </div>

                              <h3>
                                No leads found
                              </h3>

                            </div>

                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>
          )}

          {/* =====================================================
                CUSTOMERS
            ===================================================== */}

          {activeTab === "custs" && (

            <div>

              <div className="fr">

                <input
                  className="sb"
                  placeholder="Search customers..."
                  value={customerSearch}
                  onChange={(e) =>
                    setCustomerSearch(
                      e.target.value
                    )
                  }
                />

                <button
                  className="btn bp"
                  onClick={() => {
                    setEditingCustomer(null);
                    setShowCustomerModal(true);
                  }}
                >
                  + Add Customer
                </button>

              </div>

              <div className="card">

                <div className="tw">

                  <table className="tbl">

                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>City</th>
                        <th>Orders</th>
                        <th>Total Spent</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredCustomers.length > 0 ? (

                        filteredCustomers.map(
                          (customer) => (

                            <tr key={customer.id}>

                              <td>
                                <strong>
                                  {customer.name}
                                </strong>
                              </td>

                              <td>
                                {customer.company ||
                                  "—"}
                              </td>

                              <td>
                                {customer.email}
                              </td>

                              <td>
                                {customer.phone}
                              </td>

                              <td>
                                {customer.city}
                              </td>

                              <td>
                                {customer.orders || 0}
                              </td>

                              <td className="mn">
                                {fPKR(
                                  customer.totalSpent
                                )}
                              </td>

                              <td>

                                <button
                                  className="btn bgh bxs"
                                  onClick={() =>
                                    handleEditCustomer(
                                      customer
                                    )
                                  }
                                >
                                  ✏️
                                </button>

                              </td>

                            </tr>

                          )
                        )

                      ) : (

                        <tr>

                          <td colSpan="8">

                            <div className="empty">

                              <div className="eico">
                                👥
                              </div>

                              <h3>
                                No customers found
                              </h3>

                            </div>

                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>
          )}

          {/* =====================================================
                INTERACTIONS
            ===================================================== */}

          {activeTab === "inter" && (

            <div>

              <div className="fr">

                <button
                  className="btn bp"
                  onClick={handleOpenInteraction}
                >
                  + Log Interaction
                </button>

              </div>

              <div className="card">

                <div className="tw">

                  <table className="tbl">

                    <thead>

                      <tr>
                        <th>Date</th>
                        <th>Contact</th>
                        <th>Type</th>
                        <th>Notes</th>
                        <th>By</th>
                        <th>Next Action</th>
                        <th>Due Date</th>
                      </tr>

                    </thead>

                    <tbody>

                      {interactions.length > 0 ? (

                        interactions.map(
                          (interaction) => (

                            <tr
                              key={interaction.id}
                            >

                              <td>
                                {fD(
                                  interaction.dateTime
                                )}
                              </td>

                              <td>
                                {[
                                  ...customers,
                                  ...leads,
                                ].find(
                                  (c) =>
                                    String(c.id) ===
                                    String(
                                      interaction.contact
                                    )
                                )?.name ||
                                  "Unknown Contact"}
                              </td>

                              <td>

                                <span
                                  className={`bdg ${interaction.type ===
                                    "Phone Call"
                                    ? "d-processing"
                                    : interaction.type ===
                                      "WhatsApp"
                                      ? "d-accepted"
                                      : interaction.type ===
                                        "Email"
                                        ? "d-sent"
                                        : interaction.type ===
                                          "Site Visit"
                                          ? "d-proposal"
                                          : interaction.type ===
                                            "Meeting"
                                            ? "d-qualified"
                                            : "d-new"
                                    }`}
                                >
                                  {interaction.type}
                                </span>

                              </td>

                              <td
                                style={{
                                  maxWidth: "180px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow:
                                    "ellipsis",
                                }}
                              >
                                {interaction.notes}
                              </td>

                              <td>
                                {interaction.by}
                              </td>

                              <td
                                style={{
                                  fontSize: ".72rem",
                                  color: "var(--mu)",
                                }}
                              >
                                {interaction.nextAction ||
                                  "—"}
                              </td>

                              <td
                                style={{
                                  fontSize: ".72rem",
                                  color: "var(--mu)",
                                  whiteSpace:
                                    "nowrap",
                                }}
                              >
                                {interaction.nextActionDate
                                  ? fD(
                                    interaction.nextActionDate
                                  )
                                  : "—"}
                              </td>

                            </tr>

                          )
                        )

                      ) : (

                        <tr>

                          <td colSpan="7">

                            <div className="empty">

                              <div className="eico">
                                💬
                              </div>

                              <h3>
                                No interactions
                                logged yet
                              </h3>

                            </div>

                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>
          )}

          {/* =====================================================
                SURVEYS
            ===================================================== */}

          {activeTab === "surv" && (

            <div>

              <div className="al ali">
                📋 Survey reports submitted by
                field staff via the mobile app
                appear here.
              </div>

              <div className="fr">

                <select
                  className="fsl"
                  value={surveyFilter}
                  onChange={(e) =>
                    setSurveyFilter(
                      e.target.value
                    )
                  }
                >

                  <option>
                    All Types
                  </option>

                  <option>
                    Solar Assessment
                  </option>

                  <option>
                    CCTV Site Survey
                  </option>

                  <option>
                    Electric Fence Survey
                  </option>

                  <option>
                    IT Infrastructure
                  </option>

                </select>

              </div>

              {surveys.length > 0 ? (

                surveys
                  .filter(
                    (survey) =>
                      surveyFilter ===
                      "All Types" ||
                      survey.type ===
                      surveyFilter
                  )
                  .map((survey) => (

                    <div
                      key={survey.id}
                      style={{
                        background: "#fff",
                        border:
                          "1px solid var(--br)",
                        borderRadius:
                          "var(--rad)",
                        padding: "1rem",
                        marginBottom: ".7rem",
                        boxShadow: "var(--sh)",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "flex-start",
                          marginBottom: ".55rem",
                        }}
                      >

                        <div>

                          <div
                            style={{
                              fontFamily:
                                "'Syne',sans-serif",
                              fontWeight: 700,
                              fontSize: ".88rem",
                            }}
                          >
                            {survey.type}
                          </div>

                          <div
                            style={{
                              fontSize: ".73rem",
                              color: "var(--mu)",
                            }}
                          >
                            {survey.customer} ·{" "}
                            {survey.location}
                          </div>

                        </div>

                        <div
                          style={{
                            textAlign: "right",
                          }}
                        >

                          <div
                            style={{
                              fontSize: ".7rem",
                              color: "var(--mu)",
                            }}
                          >
                            {fD(survey.date)}
                          </div>

                          <div
                            style={{
                              fontSize: ".7rem",
                            }}
                          >
                            By: {survey.by}
                          </div>

                          <span
                            className={`bdg d-${survey.status}`}
                          >
                            {survey.status}
                          </span>

                        </div>

                      </div>

                      <div
                        style={{
                          fontSize: ".78rem",
                          color: "var(--mu)",
                          background: "var(--bg)",
                          borderRadius: "7px",
                          padding: ".55rem",
                          lineHeight: "1.6",
                        }}
                      >
                        {survey.details}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: ".35rem",
                          marginTop: ".65rem",
                        }}
                      >

                        <button
                          className="btn bp bxs"
                          onClick={() => {
                            setSelectedSurvey(
                              survey
                            );
                            setShowSurveyModal(
                              true
                            );
                          }}
                        >
                          📋 Full Report
                        </button>

                        <button
                          className="btn bgh bxs"
                          onClick={() => {
                            setSelectedQuoteSurvey(
                              survey
                            );
                            setShowQuoteModal(
                              true
                            );
                          }}
                        >
                          💰 Create Quote
                        </button>

                        <button
                          className="btn bgh bxs"
                          onClick={() =>
                            handleSurveyPDF(
                              survey
                            )
                          }
                        >
                          ⬇ PDF
                        </button>

                      </div>

                    </div>

                  ))

              ) : (

                <div className="card">

                  <div className="empty">

                    <div className="eico">
                      📋
                    </div>

                    <h3>
                      No surveys available
                    </h3>

                    <p>
                      Survey reports submitted by
                      field staff will appear here.
                    </p>

                  </div>

                </div>

              )}

            </div>
          )}

        </div>

      </div>



      {/* ================= LEAD MODAL ================= */}

      {showLeadModal && (

        <LeadModal
          lead={editingLead}
          employees={employees}
          onClose={handleCloseLeadModal}
          onSave={handleSaveLead}
        />

      )}

      {/* ================= INTERACTION MODAL ================= */}

      {showInteractionModal && (

        <InteractionModal
          contacts={[...customers, ...leads]}
          onClose={() =>
            setShowInteractionModal(false)
          }
          onSave={handleSaveInteraction}
        />

      )}

      {/* ================= QUOTE MODAL ================= */}

      {showQuoteModal &&
        selectedQuoteSurvey && (

          <QuotesModal
            quote={{
              customerName:
                selectedQuoteSurvey.customer ||
                "",
              subject:
                selectedQuoteSurvey.type || "",
              date: new Date()
                .toISOString()
                .split("T")[0],
              validUntil: "",
              notes:
                selectedQuoteSurvey.details ||
                "",
              status: "draft",
              items: [
                {
                  product:
                    selectedQuoteSurvey.type ||
                    "",
                  quantity: 1,
                  rate: 0,
                },
              ],
            }}
            onClose={() => {
              setShowQuoteModal(false);
              setSelectedQuoteSurvey(null);
            }}
            onSave={(quoteData) => {

              const newQuote = {
                ...quoteData,
                id: Date.now(),
                number: `QT-${Date.now()}`,
              };

              onQuotesChange?.((previousQuotes) => [
                newQuote,
                ...previousQuotes,
              ]);

              setShowQuoteModal(false);
              setSelectedQuoteSurvey(null);
            }}
          />

        )}

      {/* ================= SURVEY DETAILS MODAL ================= */}

      {showSurveyModal &&
        selectedSurvey && (

          <div className="mbg open">

            <div className="modal mlg">

              <div className="mhd">

                <div>

                  <h2>
                    Survey Report
                  </h2>

                  <p>
                    {selectedSurvey.type}
                  </p>

                </div>

                <button
                  className="mcl"
                  onClick={() => {
                    setShowSurveyModal(false);
                    setSelectedSurvey(null);
                  }}
                >
                  ✕
                </button>

              </div>

              <div className="mbd">

                <div className="g2">

                  <div className="fg">
                    <label>
                      Survey Type
                    </label>

                    <div>
                      {selectedSurvey.type ||
                        "—"}
                    </div>
                  </div>

                  <div className="fg">
                    <label>
                      Customer / Contact
                    </label>

                    <div>
                      {selectedSurvey.customer ||
                        "—"}
                    </div>
                  </div>

                  <div className="fg">
                    <label>
                      Location
                    </label>

                    <div>
                      {selectedSurvey.location ||
                        "—"}
                    </div>
                  </div>

                  <div className="fg">
                    <label>
                      Survey Date
                    </label>

                    <div>
                      {selectedSurvey.date
                        ? fD(
                          selectedSurvey.date
                        )
                        : "—"}
                    </div>
                  </div>

                  <div className="fg">
                    <label>
                      Surveyed By
                    </label>

                    <div>
                      {selectedSurvey.by ||
                        "—"}
                    </div>
                  </div>

                  <div className="fg">
                    <label>
                      Status
                    </label>

                    <div>

                      <span className="bdg d-active">
                        {selectedSurvey.status ||
                          "Pending"}
                      </span>

                    </div>

                  </div>

                </div>

                <div className="div"></div>

                <div className="fg">

                  <label>
                    Survey Details / Report
                  </label>

                  <div
                    style={{
                      background: "var(--bg)",
                      borderRadius: "8px",
                      padding: "1rem",
                      fontSize: ".8rem",
                      color: "var(--mu)",
                      lineHeight: "1.7",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {selectedSurvey.details ||
                      "No details available."}
                  </div>

                </div>

              </div>

              <div className="mft">

                <button
                  className="btn bgh"
                  onClick={() => {
                    setShowSurveyModal(false);
                    setSelectedSurvey(null);
                  }}
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

      {/* ================= CUSTOMER MODAL ================= */}

      {showCustomerModal && (

        <CustomerModal
          customer={editingCustomer}

          onClose={() => {
            setShowCustomerModal(false);
            setEditingCustomer(null);
          }}

          onSave={(customerData) => {

            // EDIT CUSTOMER

            // EDIT CUSTOMER

            if (editingCustomer) {

              onCustomersChange?.(
                (previousCustomers) =>
                  previousCustomers.map(
                    (customer) =>
                      customer.id === editingCustomer.id
                        ? {
                          ...customerData,
                          id: editingCustomer.id,
                          orders:
                            editingCustomer.orders || 0,
                          totalSpent:
                            editingCustomer.totalSpent || 0,
                        }
                        : customer
                  )
              );

              // Backend TODO:
              // Later send customer update notification to PHP/MySQL backend.

            }

            // ADD CUSTOMER

            else {

              const newCustomer = {
                ...customerData,
                id: `CU-${Date.now()}`,
                orders: 0,
                totalSpent: 0,
              };

              onCustomersChange?.(
                (previousCustomers) => [
                  newCustomer,
                  ...previousCustomers,
                ]
              );

              // Central notification
              addNotification?.({
                type: "customer_created",
                title: "New Customer Created",
                message: `${newCustomer.name || "Customer"} has been added.`,
                action: () => {
                  setActiveTab("custs");
                  setCustomerSearch(newCustomer.name || "");
                },
              });

              // Backend TODO:
              // Later save this notification in PHP/MySQL notifications table.
            }



            setShowCustomerModal(false);
            setEditingCustomer(null);
          }}
        />

      )}

    </div>
  );
}

export default CRM;