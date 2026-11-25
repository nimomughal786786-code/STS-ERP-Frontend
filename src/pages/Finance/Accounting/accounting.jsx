
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../component/SideBar/sidebar";
import PayableModal from "../../../models/payablemodal";


function Accounting({
  orders = [],
  invoices = [],
  expenses = [],
  notifications = [],
  readNotifications = [],
  markAllNotificationsRead,
  markNotificationRead,
}) {
  const [activeTab, setActiveTab] = useState("sum");
  const navigate = useNavigate();

  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const [showPayableModal, setShowPayableModal] = useState(false);
  const [payables, setPayables] = useState([]);
  const [inventoryProducts, setInventoryProducts] = useState(() => {
    const saved = localStorage.getItem("sts_products");
    return saved ? JSON.parse(saved) : [];
  });

  const inventoryValue = useMemo(() => {
    return inventoryProducts.reduce(
      (total, product) =>
        total +
        (Number(product.cost) || 0) *
        (Number(product.stock) || 0),
      0
    );
  }, [inventoryProducts]);




  const accountsPayable = useMemo(() => {
    return payables.reduce((sum, payable) => {
      const total = Number(payable.amount || 0);
      const paid = Number(payable.paidAmount || 0);

      const remaining = Math.max(total - paid, 0);

      return payable.status === "Paid"
        ? sum
        : sum + remaining;
    }, 0);
  }, [payables]);


  const [accounts] = useState([
    {
      code: "10010",
      name: "Inventory",
      type: "Asset",
    },
    {
      code: "10020",
      name: "Cash",
      type: "Asset",
    },
    {
      code: "10030",
      name: "Bank",
      type: "Asset",
    },
    {
      code: "10040",
      name: "Accounts Receivable",
      type: "Asset",
    },
    {
      code: "20010",
      name: "Rent",
      type: "Expense",
    },
    {
      code: "20011",
      name: "Utility Bill",
      type: "Expense",
    },
    {
      code: "20012",
      name: "Staff Cost",
      type: "Expense",
    },
    {
      code: "20013",
      name: "Transportation",
      type: "Expense",
    },
    {
      code: "20014",
      name: "Office Supplies",
      type: "Expense",
    },

    {
      code: "30020",
      name: "Supplier Payables",
      type: "Liability",
    },
    {
      code: "40010",
      name: "Solar Sales",
      type: "Revenue",
    },
    {
      code: "40020",
      name: "Battery Sales",
      type: "Revenue",
    },
    {
      code: "40030",
      name: "CCTV Sales",
      type: "Revenue",
    },
    {
      code: "40040",
      name: "IT Products Sales",
      type: "Revenue",
    },
    {
      code: "50010",
      name: "Owner Capital",
      type: "Equity",
    },
  ]);



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






  const fPKR = (amount) => {
    return (
      "PKR " +
      (Number(amount) || 0).toLocaleString("en-PK", {
        minimumFractionDigits: 0,
      })
    );
  };


  const fD = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };



  // =============================
  // GLOBAL SEARCH
  // =============================

  const handleGlobalSearch = () => {
    const value = globalSearch.trim().toLowerCase();

    if (!value) return;

    // Search invoices
    const foundInvoice = invoices.find((invoice) =>
      `${invoice.number || ""} ${invoice.customerName || ""
        } ${invoice.status || ""}`
        .toLowerCase()
        .includes(value)
    );

    if (foundInvoice) {
      navigate("/invoices");
      return;
    }

    // Search expenses
    const foundExpense = expenses.find((expense) =>
      `${expense.id || ""} ${expense.title || ""
        } ${expense.description || ""} ${expense.category || ""
        } ${expense.status || ""}`
        .toLowerCase()
        .includes(value)
    );

    if (foundExpense) {
      setActiveTab("sum");
      return;
    }

    // Search payables
    const foundPayable = payables.find((payable) =>
      `${payable.id || ""} ${payable.vendor || ""
        } ${payable.status || ""}`
        .toLowerCase()
        .includes(value)
    );

    if (foundPayable) {
      setActiveTab("pay");
      setShowNotifications(false);
      return;
    }

    // Other modules
    if (
      value.includes("order") ||
      value.includes("sale")
    ) {
      navigate("/orders");
      return;
    }

    if (
      value.includes("customer") ||
      value.includes("client") ||
      value.includes("lead")
    ) {
      navigate("/crm");
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
      value.includes("price") ||
      value.includes("monitor")
    ) {
      navigate("/pricemonitor");
      return;
    }

    if (value.includes("attendance")) {
      navigate("/attendance");
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




  // -----------------------------------
  // STATUS BADGE
  // -----------------------------------

  const Badge = ({ status }) => {
    return (
      <span className={`bdg d-${status}`}>
        {status}
      </span>
    );
  };




  const handleSavePayable = (newPayable) => {
    setPayables((prev) => [...prev, newPayable]);
    setShowPayableModal(false);
  };


  // -----------------------------------
  // FINANCE CALCULATIONS
  // -----------------------------------

  const revenue = useMemo(() => {
    return invoices.reduce(
      (sum, invoice) =>
        sum + Number(invoice.paidAmount || 0),
      0
    );
  }, [invoices]);





  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0
    );
  }, [expenses]);



  const expenseAccountTotals = useMemo(() => {
    return accounts
      .filter((account) => account.type === "Expense")
      .map((account) => {
        const total = expenses
          .filter((expense) => expense.accountCode === account.code)
          .reduce(
            (sum, expense) => sum + Number(expense.amount || 0),
            0
          );

        return {
          ...account,
          total,
        };
      });
  }, [accounts, expenses]);


  const revenueAccountTotals = useMemo(() => {
    const categoryToAccount = {
      solar: "40010",
      battery: "40020",
      cctv: "40030",
      it: "40040",
    };

    return accounts
      .filter((account) => account.type === "Revenue")
      .map((account) => {
        const total = orders
          .filter(
            (order) => categoryToAccount[order.cat] === account.code
          )
          .reduce(
            (sum, order) => sum + Number(order.total || 0),
            0
          );

        return {
          ...account,
          total,
        };
      });
  }, [accounts, orders]);


  const accountsReceivable = useMemo(() => {
    return invoices.reduce((sum, invoice) => {
      const total = Number(invoice.total || 0);
      const paid = Number(invoice.paidAmount || 0);
      return sum + Math.max(total - paid, 0);
    }, 0);
  }, [invoices]);


  const cashBalance = useMemo(() => {
    return invoices.reduce((sum, invoice) => {
      const payments = invoice.paymentHistory || [];

      return (
        sum +
        payments
          .filter((payment) => payment.method === "Cash")
          .reduce(
            (paymentSum, payment) =>
              paymentSum + Number(payment.amount || 0),
            0
          )
      );
    }, 0);
  }, [invoices]);




  const bankBalance = useMemo(() => {
    return invoices.reduce((sum, invoice) => {
      const payments = invoice.paymentHistory || [];

      return (
        sum +
        payments
          .filter((payment) => payment.method === "Bank")
          .reduce(
            (paymentSum, payment) =>
              paymentSum + Number(payment.amount || 0),
            0
          )
      );
    }, 0);
  }, [invoices]);



  const profit = revenue - totalExpenses;


  // -----------------------------------
  // RECEIVABLES
  // -----------------------------------

  const receivables = useMemo(() => {
    return invoices.filter((invoice) => invoice.status !== "paid");
  }, [invoices]);

  const totalReceivables = useMemo(() => {
    return receivables.reduce(
      (sum, invoice) =>
        sum +
        (Number(invoice.total || 0) -
          Number(invoice.paidAmount || 0)),
      0
    );
  }, [receivables]);


  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };



  const addPayable = () => {
    const vendor = prompt("Vendor name:");

    if (!vendor) return;

    const amount = parseFloat(
      prompt("Amount (PKR):")
    );

    if (!amount) return;

    const newPayable = {
      id: "pb" + Date.now(),
      vendor,
      amount,
      due: "2026-10-01",
      status: "pending",
    };

    setPayables((prev) => [...prev, newPayable]);
  };

  return (



    <div className="main">

      {/* ================= TOPBAR ================= */}

      <div className="topbar">

        <div>
          <div className="tbh1">
            Accounting
          </div>

          <div className="tbsub">
            Financial overview & reports
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
            onChange={(e) =>
              setGlobalSearch(e.target.value)
            }
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
              setShowNotifications(
                (previous) => !previous
              )
            }
            style={{ position: "relative" }}
          >
            🔔

            {unreadNotifications.length > 0 && (
              <span className="ndot"></span>
            )}
          </button>
          {showNotifications && (
            <div
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
                boxShadow:
                  "0 10px 30px rgba(0,0,0,.12)",
                zIndex: 9999,
              }}
            >

              <div
                style={{
                  padding: ".75rem",
                  borderBottom:
                    "1px solid var(--br)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong>
                  Notifications
                </strong>

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
                notifications.map(
                  (notification) => {

                    const isRead =
                      readNotifications.includes(
                        notification.id
                      );

                    return (
                      <div
                        key={notification.id}
                        onClick={() => {
                          if (!isRead) {
                            markNotificationRead?.(notification.id);
                          }

                          notification.action?.();
                        }}
                        style={{
                          padding: ".75rem",
                          borderBottom:
                            "1px solid var(--br)",
                          cursor: "pointer",
                          background: isRead
                            ? "#fff"
                            : "#f5f9ff",
                        }}
                      >

                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              "space-between",
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
                                borderRadius:
                                  "50%",
                                background:
                                  "var(--r)",
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
                  }
                )
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


        <div className="view active" id="v-finance">

          {/* ==================================
          TABS
      =================================== */}

          <div className="tabs">

            <button
              className={`tab ${activeTab === "sum" ? "active" : ""}`}
              onClick={() => handleTabChange("sum")}
            >
              📊 Summary
            </button>

            <button
              className={`tab ${activeTab === "rec" ? "active" : ""}`}
              onClick={() => handleTabChange("rec")}
            >
              📥 Receivables
            </button>

            <button
              className={`tab ${activeTab === "pay" ? "active" : ""}`}
              onClick={() => handleTabChange("pay")}
            >
              📤 Payables
            </button>

            <button
              className={`tab ${activeTab === "coa" ? "active" : ""}`}
              onClick={() => handleTabChange("coa")}
            >
              📒 Chart of Accounts
            </button>

          </div>

          {/* ==================================
          SUMMARY
      =================================== */}

          {activeTab === "sum" && (
            <div id="FIN">

              {/* KPI CARDS */}

              <div className="kg">

                {/* Revenue */}
                <div
                  className="kpi"
                  style={{ cursor: "default" }}
                >
                  <div className="kico ig">
                    💰
                  </div>

                  <div>
                    <div className="kval">
                      {fPKR(revenue)}
                    </div>

                    <div className="klbl">
                      Revenue Collected
                    </div>
                  </div>
                </div>

                {/* Expenses */}
                <div
                  className="kpi"
                  style={{ cursor: "default" }}
                >
                  <div className="kico ir">
                    💳
                  </div>

                  <div>
                    <div className="kval">
                      {fPKR(totalExpenses)}
                    </div>

                    <div className="klbl">
                      Total Expenses
                    </div>
                  </div>
                </div>

                {/* Profit / Loss */}
                <div
                  className="kpi"
                  style={{ cursor: "default" }}
                >
                  <div
                    className={`kico ${profit >= 0 ? "ig" : "ir"
                      }`}
                  >
                    📈
                  </div>

                  <div>
                    <div
                      className="kval"
                      style={{
                        color:
                          profit >= 0
                            ? "var(--g)"
                            : "var(--r)",
                      }}
                    >
                      {fPKR(Math.abs(profit))}
                    </div>

                    <div className="klbl">
                      {profit >= 0
                        ? "Net Profit"
                        : "Net Loss"}
                    </div>
                  </div>
                </div>

                {/* Receivables */}
                <div
                  className="kpi"
                  style={{ cursor: "default" }}
                >
                  <div className="kico io">
                    ⏳
                  </div>

                  <div>
                    <div className="kval">
                      {fPKR(totalReceivables)}
                    </div>

                    <div className="klbl">
                      Receivables
                    </div>
                  </div>
                </div>

              </div>

              {/* TWO COLUMNS */}

              <div className="g2">

                {/* ==================================
                ACCOUNTS RECEIVABLE
            =================================== */}

                <div className="card">

                  <div className="chd">

                    <h3>
                      📥 Accounts Receivable
                    </h3>

                    <button
                      className="btn bp bsm"
                      onClick={() => navigate("/invoice")}
                    >
                      View Invoices
                    </button>

                  </div>

                  <div className="tw">

                    <table className="tbl">

                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Invoice</th>
                          <th>Amount</th>
                          <th>Due</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>

                        {receivables.length > 0 ? (

                          receivables.map((invoice) => {

                            const balance =
                              Number(invoice.total || 0) -
                              Number(
                                invoice.paidAmount || 0
                              );

                            return (
                              <tr key={invoice.id}>

                                <td>
                                  {invoice.customerName}
                                </td>

                                <td className="mn">
                                  {invoice.number}
                                </td>

                                <td className="mn">
                                  {fPKR(balance)}
                                </td>

                                <td>
                                  {fD(invoice.dueDate)}
                                </td>

                                <td>
                                  <Badge
                                    status={
                                      invoice.status
                                    }
                                  />
                                </td>

                              </tr>
                            );
                          })

                        ) : (

                          <tr>
                            <td
                              colSpan="5"
                              style={{
                                textAlign: "center",
                                color: "var(--mu)",
                                padding: "1.5rem",
                              }}
                            >
                              No outstanding receivables ✅
                            </td>
                          </tr>

                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

                {/* ==================================
                ACCOUNTS PAYABLE
            =================================== */}

                <div className="card">

                  <div className="chd">

                    <h3>
                      📤 Accounts Payable
                    </h3>

                    <button
                      className="btn bp bsm"
                      onClick={() => setShowPayableModal(true)}
                    >
                      + Add Payable
                    </button>

                  </div>

                  <div className="tw">

                    <table className="tbl">

                      <thead>
                        <tr>
                          <th>Vendor</th>
                          <th>Amount</th>
                          <th>Paid</th>
                          <th>Remaining</th>
                          <th>Due</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>

                        {payables.length > 0 ? (

                          payables.map((payable) => (

                            <tr key={payable.id}>

                              <td>
                                {payable.vendor}
                              </td>

                              <td className="mn">
                                {fPKR(payable.amount)}
                              </td>
                              <td className="mn">
                                {fPKR(payable.paidAmount || 0)}
                              </td>

                              <td className="mn">
                                {fPKR(
                                  Math.max(
                                    Number(payable.amount || 0) -
                                    Number(payable.paidAmount || 0),
                                    0
                                  )
                                )}
                              </td>
                              <td>
                                {fD(payable.due)}
                              </td>

                              <td>
                                <Badge
                                  status={
                                    payable.status
                                  }
                                />
                              </td>

                            </tr>

                          ))

                        ) : (

                          <tr>
                            <td
                              colSpan="6"
                              style={{
                                textAlign: "center",
                                color: "var(--mu)",
                                padding: "1.5rem",
                              }}
                            >
                              No payables
                            </td>
                          </tr>

                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ==================================
          RECEIVABLES TAB
      =================================== */}

          {activeTab === "rec" && (
            <div id="FIN">

              <div className="card">

                <div className="chd">
                  <h3>
                    📥 Accounts Receivable
                  </h3>
                </div>

                <div className="tw">

                  <table className="tbl">

                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Invoice</th>
                        <th>Total</th>
                        <th>Paid</th>
                        <th>Balance</th>
                        <th>Due</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {receivables.length > 0 ? (

                        receivables.map((invoice) => {

                          const balance =
                            Number(invoice.total || 0) -
                            Number(
                              invoice.paidAmount || 0
                            );

                          return (
                            <tr key={invoice.id}>

                              <td>
                                {invoice.customerName}
                              </td>

                              <td className="mn">
                                {invoice.number}
                              </td>

                              <td className="mn">
                                {fPKR(invoice.total)}
                              </td>

                              <td
                                className="mn"
                                style={{
                                  color: "var(--g)",
                                }}
                              >
                                {fPKR(
                                  invoice.paidAmount
                                )}
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
                                {fD(invoice.dueDate)}
                              </td>

                              <td>
                                <Badge
                                  status={
                                    invoice.status
                                  }
                                />
                              </td>

                            </tr>
                          );
                        })

                      ) : (

                        <tr>
                          <td
                            colSpan="7"
                            style={{
                              textAlign: "center",
                              color: "var(--mu)",
                              padding: "1.5rem",
                            }}
                          >
                            No outstanding receivables ✅
                          </td>
                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>
          )}

          {/* ==================================
          PAYABLES TAB
      =================================== */}

          {activeTab === "pay" && (
            <div id="FIN">

              <div className="card">

                <div className="chd">

                  <h3>
                    📤 Accounts Payable
                  </h3>

                  <button
                    className="btn bp bsm"
                    onClick={() => setShowPayableModal(true)}
                  >
                    + Add Payable
                  </button>

                </div>

                <div className="tw">

                  <table className="tbl">

                    <thead>
                      <tr>
                        <th>Vendor</th>
                        <th>Amount</th>
                        <th>Paid</th>
                        <th>Remaining</th>
                        <th>Due</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {payables.length > 0 ? (

                        payables.map((payable) => (

                          <tr key={payable.id}>

                            <td>
                              {payable.vendor}
                            </td>

                            <td className="mn">
                              {fPKR(payable.amount)}
                            </td>
                            <td className="mn">
                              {fPKR(payable.paidAmount || 0)}
                            </td>

                            <td className="mn">
                              {fPKR(
                                Math.max(
                                  Number(payable.amount || 0) -
                                  Number(payable.paidAmount || 0),
                                  0
                                )
                              )}
                            </td>
                            <td>
                              {fD(payable.due)}
                            </td>

                            <td>
                              <Badge
                                status={
                                  payable.status
                                }
                              />
                            </td>

                          </tr>

                        ))

                      ) : (

                        <tr>
                          <td
                            colSpan="6"
                            style={{
                              textAlign: "center",
                              color: "var(--mu)",
                              padding: "1.5rem",
                            }}
                          >
                            No payables
                          </td>
                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>
          )}





          {/* chart of account  */}

          {activeTab === "coa" && (
            <div id="FIN">

              <div className="card">

                <div className="chd">
                  <div>
                    <h3>📒 Chart of Accounts</h3>
                    <div
                      style={{
                        fontSize: ".72rem",
                        color: "var(--mu)",
                        marginTop: ".2rem",
                      }}
                    >
                      Manage company financial accounts
                    </div>
                  </div>
                </div>

                <div className="tw">

                  <table className="tbl">

                    <thead>
                      <tr>
                        <th>Account Code</th>
                        <th>Account Name</th>
                        <th>Type</th>
                        <th>Balance</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {accounts.map((account) => (
                        <tr key={account.code}>

                          <td className="mn">
                            {account.code}
                          </td>

                          <td>
                            <strong>
                              {account.name}
                            </strong>
                          </td>

                          <td>
                            <span
                              style={{
                                fontSize: ".68rem",
                                background: "var(--bg)",
                                padding: "3px 8px",
                                borderRadius: "5px",
                              }}
                            >
                              {account.type}
                            </span>
                          </td>




                          <td className="mn">
                            {account.type === "Expense"
                              ? fPKR(
                                expenseAccountTotals.find(
                                  (item) => item.code === account.code
                                )?.total || 0
                              )
                              : account.type === "Revenue"
                                ? fPKR(
                                  revenueAccountTotals.find(
                                    (item) => item.code === account.code
                                  )?.total || 0
                                )
                                : account.code === "10010"
                                  ? fPKR(inventoryValue)
                                  : account.code === "10040"
                                    ? fPKR(accountsReceivable)
                                    : account.code === "10040"
                                      ? fPKR(accountsReceivable)
                                      : account.code === "10020"
                                        ? fPKR(cashBalance)
                                        : account.code === "10030"
                                          ? fPKR(bankBalance)

                                          : account.code === "30020"
                                            ? fPKR(accountsPayable)
                                            : "—"}
                          </td>




                          <td>
                            <Badge status="active" />
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>
          )}
        </div>
      </div>






      {showPayableModal && (
        <PayableModal
          onClose={() => setShowPayableModal(false)}
          onSave={handleSavePayable}
        />
      )}

    </div>
  );
}

export default Accounting;

