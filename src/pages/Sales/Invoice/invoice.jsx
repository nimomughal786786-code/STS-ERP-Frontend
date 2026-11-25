import { useEffect, useMemo, useState } from "react";
import InvoiceModal from "../../../models/invoicemodal";
import { useNavigate } from "react-router-dom";




function Invoices({
  invoices = [],
  onInvoicesChange,
  notifications = [],
  readNotifications = [],
  addNotification,
  markAllNotificationsRead,
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // const [invoiceList, setInvoiceList] = useState(invoices);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [paymentMode, setPaymentMode] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
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



  const handleNewInvoice = () => {
    setEditingInvoice(null);
    setPaymentMode(false);
    setShowInvoiceModal(true);
  };

  const handlePayInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setPaymentMode(true);
    setShowInvoiceModal(true);
  };

  const handleSaveInvoice = (invoice) => {
    if (editingInvoice) {
      onInvoicesChange((prev) =>
        prev.map((item) =>
          item.id === editingInvoice.id
            ? {
              ...invoice,
              id: editingInvoice.id,
              number: editingInvoice.number,
            }
            : item
        )
      );
      // Central notification for invoice payment/update
      addNotification?.({
        type: "invoice_updated",
        title: "Invoice Updated",
        message: `Invoice ${editingInvoice.number} has been updated.`,
        action: () => setSearch(editingInvoice.number),
      });
    }



    else {
      const newInvoice = {
        ...invoice,
        id: Date.now(),
        number: `INV-${Date.now()}`,
      };

      onInvoicesChange((prev) => [
        newInvoice,
        ...prev,
      ]);

      // Central notification
      addNotification?.({
        type: "invoice_created",
        title: "New Invoice Created",
        message: `Invoice ${newInvoice.number} has been created.`,
        action: () => setSearch(newInvoice.number),
      });

    }

    setShowInvoiceModal(false);
    setEditingInvoice(null);
  };





  // Same calculations as original renderInvs()
  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === "paid"
  );

  const outstandingInvoices = invoices.filter(
    (invoice) => invoice.status !== "paid"
  );

  const collected = invoices.reduce(
    (total, invoice) => total + Number(invoice.paidAmount || 0),
    0
  );
  // Search + status filtering
  const filteredInvoices = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return invoices.filter((invoice) => {
      const matchesSearch =
        !searchText ||
        `${invoice.number} ${invoice.customerName}`
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        !status || invoice.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, status]);

  // Same PKR formatting concept as fPKR()
  const fPKR = (value) => {
    return `PKR ${Number(value || 0).toLocaleString("en-PK", {
      minimumFractionDigits: 0,
    })}`;
  };

  // Same date formatting concept as fD()
  const fD = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Corresponding to bdg() used in original JS
  const getStatusClass = (invoiceStatus) => {
    return `bdg d-${invoiceStatus}`;
  };






  // =========================
  // TOPBAR GLOBAL SEARCH
  // =========================
  const handleGlobalSearch = (value) => {
    const q = value.trim().toLowerCase();

    if (!q) return;

    const invoiceFound = invoices.find((invoice) =>
      `${invoice.number || ""}
     ${invoice.customerName || ""}
     ${invoice.status || ""}
     ${invoice.date || ""}
     ${invoice.dueDate || ""}`
        .toLowerCase()
        .includes(q)
    );

    if (invoiceFound) {
      setSearch(value);
      return;
    }

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
      ["quote", "quotes", "quotation", "lpo"].some((word) =>
        q.includes(word)
      )
    ) {
      navigate("/quotes");
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
      ["expense", "expenses", "accounting", "finance"].some((word) =>
        q.includes(word)
      )
    ) {
      navigate("/accounting");
      return;
    }

    alert("No matching record found.");
  };


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
          <div className="tbh1" id="TTL">Invoices</div>
          <div className="tbsub" id="TSUB">
            Billing & payment tracking
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

        <div className="view active" id="v-invoices">

          {/* ══════════ INVOICE KPIs ══════════ */}

          <div className="kg" id="INK">

            <div
              className="kpi"
              style={{ cursor: "default" }}
            >
              <div className="kico ib">
                🧾
              </div>

              <div>
                <div className="kval">
                  {invoices.length}
                </div>

                <div className="klbl">
                  Total Invoices
                </div>
              </div>
            </div>

            <div
              className="kpi"
              style={{ cursor: "default" }}
            >
              <div className="kico ig">
                ✅
              </div>

              <div>
                <div className="kval">
                  {fPKR(collected)}
                </div>

                <div className="klbl">
                  Collected
                </div>
              </div>
            </div>

            <div
              className="kpi"
              style={{ cursor: "default" }}
            >
              <div className="kico io">
                ⏳
              </div>

              <div>
                <div className="kval">
                  {outstandingInvoices.length}
                </div>

                <div className="klbl">
                  Outstanding
                </div>
              </div>
            </div>

          </div>


          {/* ══════════ FILTERS ══════════ */}

          <div className="fr">

            <input
              className="sb"
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="fsl"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="unpaid">unpaid</option>
              <option value="partial">partial</option>
              <option value="paid">paid</option>
              <option value="overdue">overdue</option>
            </select>



            <button
              className="btn bp"
              onClick={handleNewInvoice}
            >
              + New Invoice
            </button>




          </div>


          {/* ══════════ INVOICES TABLE ══════════ */}

          <div className="card">

            <div className="tw">

              <table className="tbl">

                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Due</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody id="INB">

                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => {

                      const balance =
                        Number(invoice.total || 0) -
                        Number(invoice.paidAmount || 0);

                      return (
                        <tr key={invoice.id || invoice.number}>

                          <td className="mn">
                            {invoice.number}
                          </td>

                          <td>
                            {invoice.customerName}
                          </td>

                          <td>
                            {fD(invoice.date)}
                          </td>

                          <td>
                            {fD(invoice.dueDate)}
                          </td>

                          <td className="mn">
                            {fPKR(invoice.total)}
                          </td>

                          <td
                            className="mn"
                            style={{ color: "var(--g)" }}
                          >
                            {fPKR(invoice.paidAmount || 0)}
                          </td>

                          <td
                            className="mn"
                            style={{
                              color:
                                balance > 0
                                  ? "var(--r)"
                                  : "var(--g)",
                            }}
                          >
                            {fPKR(balance)}
                          </td>

                          <td>
                            <span
                              className={getStatusClass(
                                invoice.status
                              )}
                            >
                              {invoice.status}
                            </span>
                          </td>

                          <td>
                            <button
                              className="btn bgh bxs"
                              type="button"
                              onClick={() => handlePayInvoice(invoice)}
                            >
                              💰 Pay
                            </button>
                          </td>

                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9">
                        <div className="empty">

                          <div className="eico">
                            🧾
                          </div>

                          <h3>
                            No invoices yet
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
      </div>




      {showInvoiceModal && (
        <InvoiceModal
          invoice={editingInvoice}
          paymentMode={paymentMode}
          onClose={() => {
            setShowInvoiceModal(false);
            setEditingInvoice(null);
            setPaymentMode(false);
          }}
          onSave={handleSaveInvoice}
        />
      )}

    </div>
  );
}

export default Invoices;