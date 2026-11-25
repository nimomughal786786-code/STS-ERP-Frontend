import { useEffect, useMemo, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { useNavigate } from "react-router-dom";

function Dashboard({
  user,
  orders = [],
  leads = [],
  products = [],
  priceUpdates = [],
  employees = [],
  reviews = [],
  expenses = [],
  notifications = [],
  readNotifications = [],
  markAllNotificationsRead,
  markNotificationRead,
}) {
  const navigate = useNavigate();

  const [revenuePeriod, setRevenuePeriod] = useState("6m");
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const revenueChartRef = useRef(null);
  const categoryChartRef = useRef(null);

  const revenueChartInstance = useRef(null);
  const categoryChartInstance = useRef(null);

  const fPKR = (n) =>
    "PKR " +
    (parseFloat(n) || 0).toLocaleString("en-PK", {
      minimumFractionDigits: 0,
    });

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning!";
    if (hour < 17) return "Good afternoon!";

    return "Good evening!";
  };

  const currentDate = new Date().toLocaleDateString("en-CA");

const today = () => {
  const d = new Date();

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2,"0")}`;
};
  const rev = useMemo(() => {
    return orders
      .filter((o) => {
        const status = String(o.status || "").toLowerCase();
        return (
          status === "delivered" ||
          status === "completed" ||
          status === "paid"
        );
      })
      .reduce(
        (total, o) => total + (parseFloat(o.total) || 0),
        0
      );
  }, [orders]);

  const exp = useMemo(() => {
    return expenses.reduce(
      (total, e) => total + (parseFloat(e.amount) || 0),
      0
    );
  }, [expenses]);

  const ords = orders.length;

  const leadsCount = useMemo(() => {
    return leads.filter((l) => {
      const stage = String(l.stage || "").toLowerCase();

      return stage !== "won" && stage !== "lost";
    }).length;
  }, [leads]);

  const newOrders = useMemo(() => {
    return orders.filter(
      (o) => String(o.status || "").toLowerCase() === "new"
    ).length;
  }, [orders]);

  const wonLeads = useMemo(() => {
    return leads.filter(
      (l) => String(l.stage || "").toLowerCase() === "won"
    ).length;
  }, [leads]);

  const lowStock = useMemo(() => {
    return products.filter(
      (p) =>
        Number(p.stock || 0) <= Number(p.minStock || 2)
    );
  }, [products]);

  const pendingPrices = useMemo(() => {
    return priceUpdates.filter(
      (p) =>
        String(p.status || "").toLowerCase() === "pending"
    );
  }, [priceUpdates]);

  const ordersToday = useMemo(() => {
    const currentDay = today();

    return orders.filter((o) => {
      if (!o.date) return false;

      return String(o.date).split("T")[0] === currentDay;
    }).length;
  }, [orders]);

  const newLeads = useMemo(() => {
    return leads.filter(
      (l) => String(l.stage || "").toLowerCase() === "new"
    ).length;
  }, [leads]);

  const activeEmployees = useMemo(() => {
    return employees.filter(
      (e) =>
        String(e.status || "").toLowerCase() === "active"
    ).length;
  }, [employees]);

  const pendingReviews = useMemo(() => {
    return reviews.filter(
      (r) =>
        String(r.status || "").toLowerCase() === "pending"
    ).length;
  }, [reviews]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();

        return dateB - dateA;
      })
      .slice(0, 6);
  }, [orders]);




 const hotLeads = useMemo(() => {
  return leads
    .filter((l) => String(l.priority || "").toLowerCase() === "hot")
    .slice(0, 5);
}, [leads]);





  const revenueData = useMemo(() => {
    const now = new Date();

    const months =
      revenuePeriod === "3m"
        ? 3
        : revenuePeriod === "12m"
          ? 12
          : 6;

    const labels = [];
    const data = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const month = date.getMonth();
      const year = date.getFullYear();

      labels.push(
        date.toLocaleDateString("en-US", {
          month: "short",
        })
      );

      const monthRevenue = orders
        .filter((o) => {
          const status = String(
            o.status || ""
          ).toLowerCase();

          const orderDate = new Date(o.date);

          return (
            !isNaN(orderDate.getTime()) &&
            orderDate.getMonth() === month &&
            orderDate.getFullYear() === year &&
            (status === "delivered" ||
              status === "completed" ||
              status === "paid")
          );
        })
        .reduce(
          (total, o) =>
            total + (parseFloat(o.total) || 0),
          0
        );

      data.push(monthRevenue);
    }

    return { labels, data };
  }, [orders, revenuePeriod]);







  const categoryData = useMemo(() => {
  const categoryTotals = {};

  orders.forEach((order) => {
    const status = String(order.status || "").toLowerCase();

    // Only count completed sales
    if (
      status !== "delivered" &&
      status !== "completed" &&
      status !== "paid"
    ) {
      return;
    }

    // Category is saved at ORDER level as `cat`
    const category =
      String(order.cat || order.category || "other")
        .toLowerCase();

    const amount = parseFloat(order.total) || 0;

    categoryTotals[category] =
      (categoryTotals[category] || 0) + amount;
  });

  const entries = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1]);

  if (!entries.length) {
    return {
      labels: ["No Sales"],
      data: [1],
    };
  }

  const total = entries.reduce(
    (sum, [, value]) => sum + value,
    0
  );

  const categoryNames = {
    solar: "Solar",
    cctv: "CCTV",
    it: "IT",
    other: "Other",
  };

  return {
    labels: entries.map(
      ([name, value]) =>
        `${categoryNames[name] || name} ${Math.round(
          (value / total) * 100
        )}%`
    ),

    data: entries.map(([, value]) => value),
  };
}, [orders]);








  useEffect(() => {
    if (!revenueChartRef.current) return;

    if (revenueChartInstance.current) {
      revenueChartInstance.current.destroy();
    }

    revenueChartInstance.current = new Chart(
      revenueChartRef.current,
      {
        type: "line",

        data: {
          labels: revenueData.labels,

          datasets: [
            {
              label: "Revenue",
              data: revenueData.data,
              borderColor: "#0A3D62",
              backgroundColor:
                "rgba(10,61,98,.08)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#0A3D62",
              pointRadius: 4,
            },
          ],
        },

        options: {
          responsive: true,
          maintainAspectRatio: false,

          plugins: {
            legend: {
              display: false,
            },
          },

          scales: {
            y: {
              beginAtZero: true,

              ticks: {
                callback: (value) =>
                  "PKR " +
                  Number(value).toLocaleString(),
              },

              grid: {
                color: "rgba(0,0,0,.04)",
              },
            },

            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      }
    );

    return () => {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
        revenueChartInstance.current = null;
      }
    };
  }, [revenueData]);

  useEffect(() => {
    if (!categoryChartRef.current) return;

    if (categoryChartInstance.current) {
      categoryChartInstance.current.destroy();
    }

    categoryChartInstance.current = new Chart(
      categoryChartRef.current,
      {
        type: "doughnut",

        data: {
          labels: categoryData.labels,

          datasets: [
            {
              data: categoryData.data,

              backgroundColor: [
                "#0A3D62",
                "#1565a8",
                "#16a34a",
                "#F0A500",
                "#8b5cf6",
                "#ef4444",
              ],

              hoverOffset: 6,
            },
          ],
        },

        options: {
          responsive: true,
          maintainAspectRatio: false,

          plugins: {
            legend: {
              position: "bottom",

              labels: {
                font: {
                  size: 10,
                },

                padding: 10,
              },
            },
          },
        },
      }
    );

    return () => {
      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy();
        categoryChartInstance.current = null;
      }
    };
  }, [categoryData]);

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);
  };






  const unreadNotifications = notifications.filter(
    (notification) =>
      !readNotifications.includes(notification.id)
  );

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










  const handleSearchEnter = (e) => {
    if (e.key !== "Enter") return;

    const value = search.trim().toLowerCase();

    if (!value) return;

    // Orders
    const orderMatch = orders.find(
      (o) =>
        String(o.id || "").toLowerCase().includes(value) ||
        String(o.customerName || "").toLowerCase().includes(value) ||
        String(o.customer || "").toLowerCase().includes(value) ||
        String(o.salesPerson || "").toLowerCase().includes(value)
    );

    if (orderMatch) {
      navigate("/orders");
      return;
    }

    // Leads / CRM
    const leadMatch = leads.find(
      (l) =>
        String(l.name || "").toLowerCase().includes(value) ||
        String(l.phone || "").toLowerCase().includes(value) ||
        String(l.email || "").toLowerCase().includes(value) ||
        String(l.service || "").toLowerCase().includes(value)
    );

    if (leadMatch) {
      navigate("/crm&leads");
      return;
    }

    // Products
    const productMatch = products.find(
      (p) =>
        String(p.name || "").toLowerCase().includes(value) ||
        String(p.id || "").toLowerCase().includes(value) ||
        String(p.sku || "").toLowerCase().includes(value) ||
        String(p.category || "").toLowerCase().includes(value)
    );

    if (productMatch) {
      navigate("/products");
      return;
    }

    // Employees
    const employeeMatch = employees.find(
      (emp) =>
        String(emp.name || "").toLowerCase().includes(value) ||
        String(emp.empId || "").toLowerCase().includes(value) ||
        String(emp.role || "").toLowerCase().includes(value)
    );

    if (employeeMatch) {
      navigate("/employee");
      return;
    }

    // Reviews
    const reviewMatch = reviews.find(
      (r) =>
        String(r.name || "").toLowerCase().includes(value) ||
        String(r.customerName || "").toLowerCase().includes(value) ||
        String(r.review || "").toLowerCase().includes(value)
    );

    if (reviewMatch) {
      navigate("/reviews");
      return;
    }

    // Expenses
    const expenseMatch = expenses.find(
      (expense) =>
        String(expense.title || "").toLowerCase().includes(value) ||
        String(expense.category || "").toLowerCase().includes(value) ||
        String(expense.description || "").toLowerCase().includes(value)
    );

    if (expenseMatch) {
      navigate("/expenses");
      return;
    }
  };





  return (
    

      <div className="main">

        <div className="topbar">
          <div>
            <div className="tbh1">
              Dashboard
            </div>

            <div className="tbsub">
              {getGreeting()} {currentDate} —{" "}
              {pendingPrices.length} price updates
              pending review.
            </div>
          </div>

          <div className="tbr">

            <input
              className="tsrch"
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
              onKeyDown={handleSearchEnter}
            />

            <button
              className="tibtn"
              title="Price updates"
              onClick={() =>
                navigate("/pricemonitor")
              }
            >
              <span>💱</span>

              {pendingPrices.length > 0 && (
                <span className="ndot show"></span>
              )}
            </button>

            <button
              className="tibtn"
              title="New orders"
              onClick={() =>
                navigate("/orders")
              }
            >
              <span>📦</span>

              {newOrders > 0 && (
                <span className="ndot show"></span>
              )}
            </button>

            <div style={{ position: "relative" }}>
              <button
                className="tibtn"
                title="Notifications"
                data-notification-area
                onClick={() =>
                  setShowNotifications((prev) => !prev)
                }
              >
                <span>🔔</span>

                {unreadNotifications.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-3px",
                      right: "-3px",
                      minWidth: "17px",
                      height: "17px",
                      padding: "0 4px",
                      borderRadius: "20px",
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #fff",
                    }}
                  >
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  data-notification-area
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    width: "330px",
                    background: "#fff",
                    border: "1px solid var(--br)",
                    borderRadius: "12px",
                    boxShadow: "0 12px 30px rgba(0,0,0,.12)",
                    zIndex: 1000,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: ".8rem 1rem",
                      borderBottom: "1px solid var(--br)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: ".86rem" }}>
                        Notifications
                      </strong>

                      <div
                        style={{
                          fontSize: ".68rem",
                          color: "var(--mu)",
                          marginTop: ".15rem",
                        }}
                      >
                        {unreadNotifications.length} unread
                      </div>
                    </div>

                    {notifications.length > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        style={{
                          border: "none",
                          background: "none",
                          color: "var(--b)",
                          fontSize: ".68rem",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div
                    style={{
                      maxHeight: "350px",
                      overflowY: "auto",
                    }}
                  >
                    {notifications.length > 0 ? (
                      notifications.map((notification) => {
                        const isRead = readNotifications.includes(
                          notification.id
                        );

                        return (
                          <div
                            key={notification.id}
                            onClick={() => {
                              if (!readNotifications.includes(notification.id)) {
                                markNotificationRead?.(notification.id);
                              }

                              setShowNotifications(false);

                              if (notification.route) {
                                navigate(notification.route);
                              } else if (notification.action) {
                                notification.action?.();
                              }
                            }}
                            style={{
                              padding: ".75rem 1rem",
                              borderBottom:
                                "1px solid var(--br)",
                              cursor: "pointer",
                              background: isRead
                                ? "#fff"
                                : "#f5f9fd",
                              display: "flex",
                              gap: ".7rem",
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                background: "#eef5fa",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {notification.type === "order"
                                ? "📦"
                                : notification.type === "price"
                                  ? "💱"
                                  : notification.type === "stock"
                                    ? "⚠️"
                                    : notification.type === "review"
                                      ? "⭐"
                                      : "🎯"}
                            </div>

                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".4rem",
                                }}
                              >
                                <strong
                                  style={{
                                    fontSize: ".74rem",
                                  }}
                                >
                                  {notification.title}
                                </strong>

                                {!isRead && (
                                  <span
                                    style={{
                                      width: "6px",
                                      height: "6px",
                                      borderRadius: "50%",
                                      background: "#ef4444",
                                    }}
                                  />
                                )}
                              </div>

                              <div
                                style={{
                                  fontSize: ".68rem",
                                  color: "var(--mu)",
                                  marginTop: ".2rem",
                                  lineHeight: 1.4,
                                }}
                              >
                                {notification.message}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        style={{
                          padding: "2rem 1rem",
                          textAlign: "center",
                          color: "var(--mu)",
                          fontSize: ".75rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "1.5rem",
                            marginBottom: ".4rem",
                          }}
                        >
                          🔔
                        </div>

                        No new notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="content">

          <div className="view active">

            <div className="kg">

              <div
                className="kpi"
                onClick={() =>
                  navigate("/accounting")
                }
              >
                <div className="kico ig">
                  💰
                </div>

                <div>
                  <div className="kval">
                    {fPKR(rev)}
                  </div>

                  <div className="klbl">
                    Revenue
                  </div>

                  <div className="ktrend up">
                    Delivered / completed sales
                  </div>
                </div>
              </div>

              <div
                className="kpi"
                onClick={() =>
                  navigate("/orders")
                }
              >
                <div className="kico ib">
                  📦
                </div>

                <div>
                  <div className="kval">
                    {ords}
                  </div>

                  <div className="klbl">
                    Total Orders
                  </div>

                  <div className="ktrend up">
                    ▲ {newOrders} new
                  </div>
                </div>
              </div>

              <div
                className="kpi"
                onClick={() =>
                  navigate("/crm&leads")
                }
              >
                <div className="kico io">
                  🎯
                </div>

                <div>
                  <div className="kval">
                    {leadsCount}
                  </div>

                  <div className="klbl">
                    Active Leads
                  </div>

                  <div className="ktrend up">
                    ▲ {wonLeads} won
                  </div>
                </div>
              </div>

              <div
                className="kpi"
                onClick={() =>
                  navigate("/expenses")
                }
              >
                <div className="kico ir">
                  💳
                </div>

                <div>
                  <div className="kval">
                    {fPKR(exp)}
                  </div>

                  <div className="klbl">
                    Total Expenses
                  </div>

                  <div className="ktrend neu">
                    Current data
                  </div>
                </div>
              </div>

            </div>

            <div className="cgrid">

              <div className="card">

                <div className="chd">
                  <h3>
                    📈 Revenue Trend
                  </h3>

                  <select
                    className="fsl"
                    style={{
                      fontSize: ".68rem",
                      padding: ".28rem .55rem",
                    }}
                    value={revenuePeriod}
                    onChange={(e) =>
                      setRevenuePeriod(
                        e.target.value
                      )
                    }
                  >
                    <option value="6m">
                      6 Months
                    </option>

                    <option value="3m">
                      3 Months
                    </option>

                    <option value="12m">
                      12 Months
                    </option>
                  </select>
                </div>

                <div className="cbd">
                  <div className="cw">
                    <canvas
                      ref={revenueChartRef}
                    />
                  </div>
                </div>

              </div>

              <div className="card">

                <div className="chd">
                  <h3>
                    🥧 Sales by Category
                  </h3>
                </div>

                <div className="cbd">
                  <div className="cw">
                    <canvas
                      ref={categoryChartRef}
                    />
                  </div>
                </div>

              </div>

            </div>

            <div className="g2">

              <div className="card">

                <div className="chd">
                  <h3>
                    🆕 Recent Orders
                  </h3>

                  <button
                    className="btn bp bsm"
                    onClick={() =>
                      navigate("/orders")
                    }
                  >
                    View All
                  </button>
                </div>

                <div className="tw">

                  <table className="tbl">

                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {recentOrders.length > 0 ? (
                        recentOrders.map((o) => (
                          <tr key={o.id}>
                            <td className="mn">
                              {o.id}
                            </td>

                            <td>
                              {o.customerName ||
                                o.customer ||
                                "—"}
                            </td>

                            <td className="mn">
                              {fPKR(o.total)}
                            </td>

                            <td>
                              {o.status || "—"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            style={{
                              textAlign: "center",
                            }}
                          >
                            No orders yet
                          </td>
                        </tr>
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

              <div className="card">

                <div className="chd">
                  <h3>
                    🔥 Hot Leads
                  </h3>

                  <button
                    className="btn bp bsm"
                    onClick={() =>
                      navigate("/crm&leads")
                    }
                  >
                    View All
                  </button>
                </div>

                <div className="tw">

                  <table className="tbl">

                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Service</th>
                        <th>Value</th>
                        <th>Priority</th>
                      </tr>
                    </thead>

                    <tbody>

                      {hotLeads.length > 0 ? (
                        hotLeads.map((l) => (
                          <tr key={l.id}>
                            <td>
                              {l.name}
                            </td>

                            <td>
                              {l.service || "—"}
                            </td>

                            <td className="mn">
                              {fPKR(l.value)}
                            </td>

                            <td>
                              {l.priority || "—"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            style={{
                              textAlign: "center",
                            }}
                          >
                            No hot leads yet
                          </td>
                        </tr>
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

            <div className="g3 mt2">

              <div className="card">

                <div className="chd">
                  <h3>
                    ⚠️ Low Stock
                  </h3>
                </div>

                <div className="cbd">

                  {lowStock.length ? (
                    lowStock.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "space-between",
                          padding: ".45rem 0",
                          borderBottom:
                            "1px solid var(--br)",
                          fontSize: ".79rem",
                        }}
                      >
                        <span>
                          {p.emoji}{" "}
                          {p.name}
                        </span>

                        <span className="bdg d-low-stock">
                          ⚠ {p.stock}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="empty">
                      <div className="eico">
                        ✅
                      </div>

                      <h3>
                        All stock OK
                      </h3>
                    </div>
                  )}

                </div>

              </div>

              <div className="card">

                <div className="chd">

                  <h3>
                    💱 Price Updates Pending
                  </h3>

                  <button
                    className="btn ba bsm"
                    onClick={() =>
                      navigate(
                        "/pricemonitor"
                      )
                    }
                  >
                    Review All
                  </button>

                </div>

                <div className="cbd">

                  {pendingPrices
                    .slice(0, 4)
                    .map((p) => {
                      const change =
                        parseFloat(
                          p.change
                        ) || 0;

                      return (
                        <div
                          key={p.id}
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "space-between",
                            padding: ".42rem 0",
                            borderBottom:
                              "1px solid var(--br)",
                            fontSize: ".77rem",
                          }}
                        >
                          <span
                            style={{
                              flex: 1,
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis",
                              whiteSpace:
                                "nowrap",
                              maxWidth:
                                "155px",
                            }}
                          >
                            {p.productName ||
                              p.name ||
                              "Product"}
                          </span>

                          <span
                            className={
                              change > 0
                                ? "pup"
                                : "pdn"
                            }
                          >
                            {change > 0
                              ? "▲"
                              : "▼"}

                            {Math.abs(
                              change
                            )}
                            %
                          </span>
                        </div>
                      );
                    })}

                  {!pendingPrices.length && (
                    <div className="empty">
                      <div className="eico">
                        ✅
                      </div>

                      <h3>
                        No pending updates
                      </h3>
                    </div>
                  )}

                  <p
                    style={{
                      fontSize: ".7rem",
                      color: "var(--mu)",
                      marginTop: ".45rem",
                    }}
                  >
                    {pendingPrices.length}{" "}
                    total pending
                  </p>

                </div>

              </div>

              <div className="card">

                <div className="chd">
                  <h3>
                    📅 Today's Snapshot
                  </h3>
                </div>

                <div className="cbd">

                  <div
                    style={{
                      fontSize: ".79rem",
                      lineHeight: 2.1,
                      color: "var(--mu)",
                    }}
                  >

                    <div>
                      📦 {ordersToday} orders
                      today
                    </div>

                    <div>
                      🎯 {newLeads} new leads
                      pending
                    </div>

                    <div>
                      💱{" "}
                      {pendingPrices.length}{" "}
                      price updates to
                      review
                    </div>

                    <div>
                      👥{" "}
                      {activeEmployees} staff
                      active
                    </div>

                    <div>
                      ⭐ {pendingReviews}{" "}
                      reviews pending
                    </div>

                    <div>
                      💰 Net Profit:{" "}
                      {fPKR(rev - exp)}
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    
  );
}

export default Dashboard;