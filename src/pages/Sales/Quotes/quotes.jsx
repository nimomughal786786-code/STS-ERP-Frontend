import { useEffect, useMemo, useState } from "react";
import QuotesModal from "../../../models/quotesmodal";
import LPOModal from "../../../models/lpomodal";
import { useNavigate } from "react-router-dom";





function Quotes({
  quotes = [],
  onQuotesChange,
  toast,
  notifications = [],
  readNotifications = [],
  addNotification,
  markAllNotificationsRead,
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const quoteList = quotes;
  const [lpoList, setLpoList] = useState([]);
  const [editingLPO, setEditingLPO] = useState(null);
  const [lpoStatus, setLpoStatus] = useState("");
  const [showLPOModal, setShowLPOModal] = useState(false);

  const [activeTab, setActiveTab] = useState("quotes");
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();



  // Close notification dropdown when clicking outside
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

  const filteredQuotes = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return quoteList.filter((quote) => {
      const matchesSearch =
        !searchText ||
        `${quote.number} ${quote.customerName} ${quote.subject}`
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        !status || quote.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [quoteList, search, status]);


  const handleNewQuote = () => {
    setShowQuoteModal(true);
  };


  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
    setShowQuoteModal(true);
  };


  const handleCloseQuote = () => {
    setShowQuoteModal(false);
  };


  const handleEditLPO = (lpo) => {
    console.log("EDIT LPO:", lpo);

    setEditingLPO(lpo);
    setShowLPOModal(true);
  };

  const handleLPO = () => {
    if (toast) {
      toast("LPO creation form", "i");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString();
  };

  const formatPKR = (amount) => {
    return `PKR ${Number(amount || 0).toLocaleString()}`;
  };

  const getStatusClass = (quoteStatus) => {
    return `bdg d-${quoteStatus}`;
  };





  const handlePDF = (quote) => {
    const itemsHTML = (quote.items || [])
      .map(
        (item) => `
        <tr>
          <td>${item.product || ""}</td>
          <td>${item.quantity || 0}</td>
          <td>PKR ${Number(item.rate || 0).toLocaleString()}</td>
          <td>PKR ${Number(item.quantity || 0) *
          Number(item.rate || 0)
            .toLocaleString()}</td>
        </tr>
      `
      )
      .join("");

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${quote.number || "Quotation"}</title>

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
          margin: 6px 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th,
        td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }

        th {
          background: #f0f2f5;
        }

        .total {
          text-align: right;
          margin-top: 25px;
          font-size: 20px;
          font-weight: bold;
        }

        .notes {
          margin-top: 30px;
        }
      </style>
    </head>

    <body>

      <div class="header">
        <div>
          <h1>QUOTATION</h1>
          <p>${quote.number || ""}</p>
        </div>

        <div>
          <p>
            <strong>Date:</strong>
            ${quote.date || ""}
          </p>

          <p>
            <strong>Valid Until:</strong>
            ${quote.validUntil || ""}
          </p>
        </div>
      </div>


      <div class="info">
        <p>
          <strong>Customer:</strong>
          ${quote.customerName || ""}
        </p>

        <p>
          <strong>Subject:</strong>
          ${quote.subject || ""}
        </p>
      </div>


      <table>

        <thead>
          <tr>
            <th>Product / Service</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          ${itemsHTML}
        </tbody>

      </table>


      <div class="total">
        Total: PKR ${Number(
      quote.total || 0
    ).toLocaleString()}
      </div>


      <div class="notes">
        <strong>Notes:</strong>
        <p>${quote.notes || ""}</p>
      </div>

    </body>
    </html>
  `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
    };
  };



  const handleLPODPDF = (lpo) => {
    const itemsHTML = (lpo.items || [])
      .map(
        (item) => `
        <tr>
          <td>${item.product || ""}</td>
          <td>${item.quantity || 0}</td>
          <td>PKR ${Number(item.rate || 0).toLocaleString()}</td>
          <td>PKR ${(
            Number(item.quantity || 0) *
            Number(item.rate || 0)
          ).toLocaleString()}</td>
        </tr>
      `
      )
      .join("");

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${lpo.number || "LPO"}</title>

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

        .info p {
          margin: 7px 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 25px;
        }

        th,
        td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }

        th {
          background: #f0f2f5;
        }

        .total {
          text-align: right;
          margin-top: 25px;
          font-size: 20px;
          font-weight: bold;
        }

        .notes {
          margin-top: 30px;
        }
      </style>
    </head>

    <body>

      <div class="header">

        <div>
          <h1>LOCAL PURCHASE ORDER</h1>
          <p>${lpo.number || ""}</p>
        </div>

        <div>
          <p>
            <strong>LPO Date:</strong>
            ${lpo.lpoDate || ""}
          </p>

          <p>
            <strong>Delivery Date:</strong>
            ${lpo.deliveryDate || ""}
          </p>
        </div>

      </div>

      <div class="info">

        <p>
          <strong>Supplier:</strong>
          ${lpo.supplier || ""}
        </p>

        <p>
          <strong>Email:</strong>
          ${lpo.email || ""}
        </p>

        <p>
          <strong>Payment Terms:</strong>
          ${lpo.paymentTerms || ""}
        </p>

      </div>

      <table>

        <thead>
          <tr>
            <th>Product / Service</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          ${itemsHTML}
        </tbody>

      </table>

      <div class="total">
        Total: PKR ${Number(
      lpo.total || 0
    ).toLocaleString()}
      </div>

      <div class="notes">
        <strong>Notes:</strong>
        <p>${lpo.notes || ""}</p>
      </div>

    </body>
    </html>
  `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const handleSend = (quote) => {
    if (toast) {
      toast(
        `Quote ${quote.number || "Quote"} is ready to send`,
        "i"
      );
    } else {
      alert(
        `Quote ${quote.number || "Quote"} is ready to send`
      );
    }
  };






  // =========================
  // TOPBAR GLOBAL SEARCH
  // =========================
  const handleGlobalSearch = (value) => {
    const q = value.trim().toLowerCase();

    if (!q) return;

    // Search Quotes
    const quoteFound = quoteList.find((quote) =>
      `${quote.number || ""}
     ${quote.customerName || ""}
     ${quote.subject || ""}
     ${quote.status || ""}
     ${quote.date || ""}`
        .toLowerCase()
        .includes(q)
    );

    if (quoteFound) {
      setActiveTab("quotes");
      setSearch(value);
      return;
    }

    // Search LPOs
    const lpoFound = lpoList.find((lpo) =>
      `${lpo.number || ""}
     ${lpo.supplier || ""}
     ${lpo.status || ""}
     ${lpo.lpoDate || ""}
     ${lpo.deliveryDate || ""}`
        .toLowerCase()
        .includes(q)
    );

    if (lpoFound) {
      setActiveTab("lpo");
      return;
    }

    // Navigate to related modules
    if (
      ["order", "orders", "sale", "sales"].some((word) =>
        q.includes(word)
      )
    ) {
      navigate("/orders");
      return;
    }

    if (
      ["customer", "customers", "client", "clients", "lead", "leads"].some(
        (word) => q.includes(word)
      )
    ) {
      navigate("/crm&leads");
      return;
    }

    if (
      ["product", "products", "stock", "inventory"].some((word) =>
        q.includes(word)
      )
    ) {
      navigate("/products");
      return;
    }

    if (
      ["employee", "employees", "staff", "team"].some((word) =>
        q.includes(word)
      )
    ) {
      navigate("/employees");
      return;
    }

    if (
      ["price", "pricing", "price monitor"].some((word) =>
        q.includes(word)
      )
    ) {
      navigate("/pricemonitor");
      return;
    }

    alert("No matching record found.");
  };


  // =========================
  // QUOTES & LPO NOTIFICATIONS
  // =========================
  // =========================
  // CENTRAL NOTIFICATIONS
  // =========================

  const unreadNotifications = notifications.filter(
    (notification) =>
      !readNotifications.includes(notification.id)
  );




































  return (


    <div className="main">

      <div className="topbar">
        <div>
          <div className="tbh1" id="TTL">Quotes & LPO</div>
          <div className="tbsub" id="TSUB">
            Quotations and purchase orders
          </div>
        </div>

        <div className="tbr">

          <input
            className="tsrch"
            placeholder="Search..."
            id="GSI"
            value={globalSearch}
            autoComplete="off"
            onChange={(e) => setGlobalSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleGlobalSearch(globalSearch);
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
            <span>🔔</span>

            {unreadNotifications.length > 0 && (
              <span
                className="ndot show"
                id="NBD"
              ></span>
            )}
          </button>

          {showNotifications && (
            <div
              data-notification-area
              style={{
                position: "absolute",
                top: "58px",
                right: "0",
                width: "320px",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                boxShadow: "0 8px 25px rgba(0,0,0,.12)",
                zIndex: 1000,
                padding: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <strong>Notifications</strong>

                {unreadNotifications.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#1565a8",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: "20px 10px",
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  No new notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      notification.action();
                      setShowNotifications(false);
                    }}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      background: readNotifications.includes(
                        notification.id
                      )
                        ? "#fff"
                        : "#f1f5f9",
                      marginBottom: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "13px",
                        marginBottom: "3px",
                      }}
                    >
                      {notification.title}
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      {notification.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <div className="content">









        <div className="view active" id="v-quotes">

          {/* ══════════ FILTERS ══════════ */}



          <div className="tabs">

            <button
              className={`btn tab ${activeTab === "quotes" ? "active" : ""}`}
              onClick={() => setActiveTab("quotes")}
            >
              Quotes
            </button>

            <button
              className={`btn tab ${activeTab === "lpo" ? "active" : ""}`}
              onClick={() => setActiveTab("lpo")}
            >
              LPO
            </button>

          </div>













          {activeTab === "quotes" && (
            <>
              <div className="fr">

                <input
                  className="sb"
                  placeholder="Search quotes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  className="fsl"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="draft">draft</option>
                  <option value="sent">sent</option>
                  <option value="accepted">accepted</option>
                  <option value="invoiced">invoiced</option>
                </select>

                <button
                  className="btn bp"
                  onClick={handleNewQuote}
                >
                  + New Quote
                </button>

                {/* <button
                className="btn bou bsm"
                onClick={() => setShowLPOModal(true)}
              >
                📄 LPO
              </button> */}

              </div>


              {/* ══════════ QUOTES TABLE ══════════ */}

              <div className="card">

                <div className="tw">

                  <table className="tbl">

                    <thead>
                      <tr>
                        <th>Quote #</th>
                        <th>Customer</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody id="QTB">

                      {filteredQuotes.length > 0 ? (
                        filteredQuotes.map((quote) => (
                          <tr key={quote.id || quote.number}>

                            <td className="mn">
                              {quote.number}
                            </td>

                            <td>
                              {quote.customerName}
                            </td>

                            <td>
                              {quote.subject}
                            </td>

                            <td>
                              {formatDate(quote.date)}
                            </td>

                            <td className="mn">
                              {formatPKR(quote.total)}
                            </td>

                            <td>
                              <span
                                className={getStatusClass(
                                  quote.status
                                )}
                              >
                                {quote.status}
                              </span>
                            </td>

                            <td>
                              <button
                                className="btn bgh bxs"
                                type="button"
                                onClick={() => handlePDF(quote)}
                              >
                                👁 PDF
                              </button>

                              <button
                                className="btn bgh bxs"
                                type="button"
                                onClick={() => handleSend(quote)}
                              >
                                📧 Send
                              </button>

                              <button
                                className="btn bgh bxs"
                                type="button"
                                onClick={() => handleEditQuote(quote)}
                              >
                                ✏️ Edit
                              </button>
                            </td>

                          </tr>
                        ))
                      ) : (
                        <tr>

                          <td colSpan="7">

                            <div className="empty">

                              <div className="eico">
                                📋
                              </div>

                              <h3>
                                No quotes yet
                              </h3>

                              <p>
                                Create a new quote to get started.
                              </p>

                            </div>

                          </td>

                        </tr>
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </>
          )}





          {/* lpo table  */}

          {activeTab === "lpo" && (
            <>
              <div className="fr">

                <input
                  className="sb"
                  placeholder="Search LPO..."
                />

                <select className="fsl"
                  value={lpoStatus}
                  onChange={(e) => setLpoStatus(e.target.value)}>
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="approved">Approved</option>
                  <option value="received">Received</option>
                  <option value="cancelled">Cancelled</option>

                </select>

                <button
                  className="btn bp"
                  onClick={() => setShowLPOModal(true)}
                >
                  + New LPO
                </button>

              </div>

              <div className="card">

                <div className="tw">

                  <table className="tbl">

                    <thead>
                      <tr>
                        <th>LPO #</th>
                        <th>Supplier</th>
                        <th>LPO Date</th>
                        <th>Delivery Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>

                      {lpoList.length > 0 ? (

                        lpoList
                          .filter((lpo) => !lpoStatus || lpo.status === lpoStatus)
                          .map((lpo) => (

                            <tr key={lpo.id}>

                              <td className="mn">
                                {lpo.number}
                              </td>

                              <td>
                                {lpo.supplier || "-"}
                              </td>

                              <td>
                                {formatDate(lpo.lpoDate)}
                              </td>

                              <td>
                                {formatDate(lpo.deliveryDate)}
                              </td>

                              <td className="mn">
                                {formatPKR(lpo.total)}
                              </td>

                              <td>
                                <span className={`bdg d-${lpo.status}`}>
                                  {lpo.status}
                                </span>
                              </td>

                              <td>
                                <button
                                  className="btn bgh bxs"
                                  type="button"
                                  onClick={() => handleLPODPDF(lpo)}
                                >
                                  👁 PDF
                                </button>

                                <button
                                  className="btn bgh bxs"
                                  type="button"
                                  onClick={() => {
                                    console.log("EDIT CLICKED", lpo);
                                    handleEditLPO(lpo);
                                  }}
                                >
                                  ✏️ Edit
                                </button>

                              </td>

                            </tr>

                          ))

                      ) : (

                        <tr>

                          <td colSpan="7">

                            <div className="empty">

                              <div className="eico">
                                📄
                              </div>

                              <h3>
                                No LPOs yet
                              </h3>

                              <p>
                                Create a new LPO to see it here.
                              </p>

                            </div>

                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </div>
            </>
          )}
        </div>
      </div>


      {showQuoteModal && (
        <QuotesModal
          quote={editingQuote}
          onClose={() => {
            setShowQuoteModal(false);
            setEditingQuote(null);
          }}


          onSave={(quote) => {

            // EDIT EXISTING QUOTE
            if (editingQuote) {

              onQuotesChange((prev) =>
                prev.map((item) =>
                  item.id === editingQuote.id
                    ? {
                      ...quote,
                      id: editingQuote.id,
                      number: editingQuote.number,
                    }
                    : item
                )
              );

            }

            // CREATE NEW QUOTE
            else {

              const newQuote = {
                ...quote,
                id: Date.now(),
                number: `QT-${Date.now()}`,
              };

              onQuotesChange((prev) => [
                newQuote,
                ...prev,
              ]);

              // Central notification
              addNotification?.({
                type: "quote_created",
                title: "New Quote Created",
                message: `Quote ${newQuote.number} has been created.`,
                action: () => setActiveTab("quotes"),
              });


            }

            setShowQuoteModal(false);
            setEditingQuote(null);
          }}




        />
      )}


      {showLPOModal && (
        <LPOModal
          lpo={editingLPO}

          onClose={() => {
            setShowLPOModal(false);
            setEditingLPO(null);
          }}

          onSave={(lpo) => {

            // EDIT EXISTING LPO
            if (editingLPO) {

              setLpoList((prev) =>
                prev.map((item) =>
                  item.id === editingLPO.id
                    ? {
                      ...lpo,
                      id: editingLPO.id,
                      number: editingLPO.number,
                    }
                    : item
                )
              );


              // Central notification
              addNotification?.({
                type: "lpo_created",
                title: "New LPO Created",
                message: `LPO ${newLPO.number} has been created.`,
                action: () => setActiveTab("lpo"),
              });

            }

            // CREATE NEW LPO
            else {

              const newLPO = {
                ...lpo,
                id: Date.now(),
                number: `LPO-${Date.now()}`,
              };

              setLpoList((prev) => [
                newLPO,
                ...prev,
              ]);

            }

            setShowLPOModal(false);
            setEditingLPO(null);
          }}
        />
      )}


    </div>
  );
}

export default Quotes;