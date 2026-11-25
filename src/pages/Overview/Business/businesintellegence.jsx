import { useEffect, useMemo, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { useNavigate } from "react-router-dom";

function BusinessIntelligence({
  orders = [],
  customers = [],
  leads = [],
  expenses = [],
  products = [],
  notifications = [],
  readNotifications = [],
  markAllNotificationsRead,
  markNotificationRead,
}) {
  const [activeTab, setActiveTab] = useState("sales");
  const navigate = useNavigate();

  const chartRefs = {
    BRE: useRef(null),
    BOS: useRef(null),
    BTP: useRef(null),
    BSC: useRef(null),
    BMG: useRef(null),

    BST: useRef(null),
    BTR: useRef(null),

    BNC: useRef(null),
    BLF: useRef(null),

    BPL: useRef(null),
    BEB: useRef(null),
    BRA: useRef(null),
    BCF: useRef(null),
  };

  const chartInstances = useRef({});
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  /* =========================================================
     HELPERS
  ========================================================= */

  const fPKR = (n) =>
    "PKR " +
    (parseFloat(n) || 0).toLocaleString("en-PK", {
      minimumFractionDigits: 0,
    });

  const getOrderAmount = (order) =>
    Number(order.total || order.amount || 0);

  const getPaidAmount = (order) =>
    Number(
      order.paidAmount ||
        order.paid ||
        order.collectedAmount ||
        0
    );

  const getOrderDate = (order) =>
    order.date ||
    order.orderDate ||
    order.createdAt ||
    null;

  const getCustomerName = (order) =>
    order.customerName ||
    order.customer ||
    "Unknown Customer";

  const getMonthIndex = (dateValue) => {
    if (!dateValue) return -1;

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return -1;

    return date.getMonth();
  };

  const getProductCategory = (product) =>
    String(
      product.category ||
        product.cat ||
        product.type ||
        "Other"
    ).toLowerCase();

  const getProductStock = (product) =>
    Number(
      product.stock ||
        product.quantity ||
        product.qty ||
        0
    );

  const getProductValue = (product) => {
    const stock = getProductStock(product);

    const price = Number(
      product.costPrice ||
        product.purchasePrice ||
        product.salePrice ||
        product.price ||
        0
    );

    return stock * price;
  };

  const isCompletedOrder = (order) => {
    const status = String(order.status || "").toLowerCase();

    return (
      status === "delivered" ||
      status === "completed" ||
      status === "paid"
    );
  };

  /* =========================================================
     GLOBAL SEARCH
  ========================================================= */

  const handleGlobalSearch = (value) => {
    const q = value.trim().toLowerCase();

    if (!q) return;

    if (
      ["sales", "sale", "revenue", "orders", "order"].some((word) =>
        q.includes(word)
      )
    ) {
      setActiveTab("sales");
      return;
    }

    if (
      ["inventory", "stock", "warehouse"].some((word) =>
        q.includes(word)
      )
    ) {
      setActiveTab("inventory");
      return;
    }

    if (
      ["customer", "customers", "client", "clients"].some((word) =>
        q.includes(word)
      )
    ) {
      setActiveTab("customer");
      return;
    }

    if (
      [
        "financial",
        "finance",
        "profit",
        "loss",
        "expense",
        "expenses",
        "receivable",
        "cash flow",
      ].some((word) => q.includes(word))
    ) {
      setActiveTab("financial");
      return;
    }

    const orderFound = orders.some((order) =>
      `${order.id || ""}
       ${order.customerName || ""}
       ${order.salesPerson || ""}
       ${order.cat || ""}
       ${order.status || ""}`
        .toLowerCase()
        .includes(q)
    );

    if (orderFound) {
      navigate("/orders");
      return;
    }

    const customerFound = customers.some((customer) =>
      `${customer.name || ""}
       ${customer.company || ""}
       ${customer.email || ""}
       ${customer.phone || ""}
       ${customer.city || ""}`
        .toLowerCase()
        .includes(q)
    );

    if (customerFound) {
      navigate("/crm&leads");
      return;
    }

    const leadFound = leads.some((lead) =>
      `${lead.id || ""}
       ${lead.name || ""}
       ${lead.company || ""}
       ${lead.phone || ""}
       ${lead.email || ""}
       ${lead.service || ""}
       ${lead.assignedTo || ""}
       ${lead.stage || ""}`
        .toLowerCase()
        .includes(q)
    );

    if (leadFound) {
      navigate("/crm&leads");
      return;
    }

    alert("No matching record found.");
  };

  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

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

  /* =========================================================
     SALES CALCULATIONS
  ========================================================= */

  const salesOrders = useMemo(
    () => orders.filter(isCompletedOrder),
    [orders]
  );

  const revenueYTD = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return salesOrders.reduce((sum, order) => {
      const date = getOrderDate(order);

      if (!date) return sum;

      const orderDate = new Date(date);

      if (
        !Number.isNaN(orderDate.getTime()) &&
        orderDate.getFullYear() === currentYear
      ) {
        return sum + getOrderAmount(order);
      }

      return sum;
    }, 0);
  }, [salesOrders]);

  const totalOrders = orders.length;

  const avgOrderValue = useMemo(() => {
    if (!orders.length) return 0;

    const total = orders.reduce(
      (sum, order) => sum + getOrderAmount(order),
      0
    );

    return total / orders.length;
  }, [orders]);

  const leadConversion = useMemo(() => {
    if (!leads.length) return 0;

    const wonLeads = leads.filter(
      (lead) =>
        String(lead.stage || "").toLowerCase() === "won"
    ).length;

    return Math.round((wonLeads / leads.length) * 100);
  }, [leads]);

  /* =========================================================
     MONTHLY SALES
  ========================================================= */

  const monthlyRevenue = useMemo(() => {
    const months = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    salesOrders.forEach((order) => {
      const date = getOrderDate(order);

      if (!date) return;

      const orderDate = new Date(date);

      if (
        Number.isNaN(orderDate.getTime()) ||
        orderDate.getFullYear() !== currentYear
      ) {
        return;
      }

      months[orderDate.getMonth()] += getOrderAmount(order);
    });

    return months;
  }, [salesOrders]);

  const monthlyExpenses = useMemo(() => {
    const months = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    expenses.forEach((expense) => {
      const date =
        expense.date ||
        expense.expenseDate ||
        expense.createdAt;

      if (!date) return;

      const expenseDate = new Date(date);

      if (
        Number.isNaN(expenseDate.getTime()) ||
        expenseDate.getFullYear() !== currentYear
      ) {
        return;
      }

      months[expenseDate.getMonth()] += Number(
        expense.amount || expense.total || 0
      );
    });

    return months;
  }, [expenses]);

  /* =========================================================
     ORDER STATUS
  ========================================================= */

  const orderStatusData = useMemo(() => {
    const statuses = [
      "New",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    return statuses.map((status) => {
      return orders.filter(
        (order) =>
          String(order.status || "").toLowerCase() ===
          status.toLowerCase()
      ).length;
    });
  }, [orders]);

  /* =========================================================
     TOP PRODUCTS
  ========================================================= */

  const topProducts = useMemo(() => {
    const productTotals = {};

    orders.forEach((order) => {
      const items = Array.isArray(order.items)
        ? order.items
        : [];

      items.forEach((item) => {
        const name =
          item.name ||
          item.productName ||
          "Unknown Product";

        const qty = Number(item.qty || item.quantity || 0);
        const rate = Number(
          item.rate ||
            item.price ||
            item.salePrice ||
            0
        );

        const amount =
          Number(item.total || 0) ||
          qty * rate;

        productTotals[name] =
          (productTotals[name] || 0) + amount;
      });
    });

    return Object.entries(productTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [orders]);

  /* =========================================================
     SALES BY CATEGORY
  ========================================================= */

  const categorySales = useMemo(() => {
    const totals = {};

    salesOrders.forEach((order) => {
      const category = String(
        order.cat ||
          order.category ||
          "Other"
      ).toLowerCase();

      totals[category] =
        (totals[category] || 0) +
        getOrderAmount(order);
    });

    return Object.entries(totals);
  }, [salesOrders]);

  /* =========================================================
     MONTHLY GROWTH
  ========================================================= */

  const monthlyGrowth = useMemo(() => {
    const currentYear = new Date().getFullYear();

    const currentYearData = Array(12).fill(0);
    const previousYearData = Array(12).fill(0);

    orders.forEach((order) => {
      const date = getOrderDate(order);

      if (!date) return;

      const orderDate = new Date(date);

      if (Number.isNaN(orderDate.getTime())) return;

      const year = orderDate.getFullYear();
      const month = orderDate.getMonth();

      if (year === currentYear) {
        currentYearData[month] += getOrderAmount(order);
      }

      if (year === currentYear - 1) {
        previousYearData[month] += getOrderAmount(order);
      }
    });

    return currentYearData.map((value, index) => {
      const previous = previousYearData[index];

      if (!previous) {
        return value > 0 ? 100 : 0;
      }

      return Math.round(
        ((value - previous) / previous) * 100
      );
    });
  }, [orders]);

  /* =========================================================
     INVENTORY CALCULATIONS
  ========================================================= */

  const totalSKUs = products.length;

  const lowStockCount = useMemo(() => {
    return products.filter(
      (product) =>
        getProductStock(product) <=
        Number(product.minStock || 2)
    ).length;
  }, [products]);

  const inventoryValue = useMemo(() => {
    return products.reduce(
      (sum, product) =>
        sum + getProductValue(product),
      0
    );
  }, [products]);

  const stockByCategory = useMemo(() => {
    const totals = {};

    products.forEach((product) => {
      const category = getProductCategory(product);

      totals[category] =
        (totals[category] || 0) +
        getProductStock(product);
    });

    return Object.entries(totals).sort(
      (a, b) => b[1] - a[1]
    );
  }, [products]);

  /* =========================================================
     CUSTOMER CALCULATIONS
  ========================================================= */

  const totalCustomers = customers.length;

  const customerRevenueMap = useMemo(() => {
    const map = {};

    orders.forEach((order) => {
      const customerName = getCustomerName(order);

      if (!customerName) return;

      map[customerName] =
        (map[customerName] || 0) +
        getOrderAmount(order);
    });

    return map;
  }, [orders]);

  const avgCustomerLTV = useMemo(() => {
    if (!customers.length) return 0;

    const totalRevenue = Object.values(
      customerRevenueMap
    ).reduce((sum, value) => sum + value, 0);

    return totalRevenue / customers.length;
  }, [customers, customerRevenueMap]);

  const repeatPurchaseRate = useMemo(() => {
    if (!customers.length) return 0;

    const customerOrders = {};

    orders.forEach((order) => {
      const name = getCustomerName(order);

      customerOrders[name] =
        (customerOrders[name] || 0) + 1;
    });

    const repeatCustomers = Object.values(
      customerOrders
    ).filter((count) => count > 1).length;

    return Math.round(
      (repeatCustomers / customers.length) * 100
    );
  }, [customers, orders]);

  const newCustomersMonthly = useMemo(() => {
    const months = Array(12).fill(0);

    customers.forEach((customer) => {
      const date =
        customer.createdAt ||
        customer.createdDate ||
        customer.date ||
        customer.joinDate;

      if (!date) return;

      const customerDate = new Date(date);

      if (Number.isNaN(customerDate.getTime())) return;

      months[customerDate.getMonth()] += 1;
    });

    return months;
  }, [customers]);

  const leadFunnel = useMemo(() => {
    const stages = [
      "New",
      "Qualified",
      "Proposal",
      "Negotiation",
      "Won",
    ];

    return stages.map(
      (stage) =>
        leads.filter(
          (lead) =>
            String(lead.stage || "").toLowerCase() ===
            stage.toLowerCase()
        ).length
    );
  }, [leads]);

  const topCustomers = useMemo(() => {
    const customerMap = {};

    orders.forEach((order) => {
      const name = getCustomerName(order);

      if (!customerMap[name]) {
        customerMap[name] = {
          name,
          orders: 0,
          revenue: 0,
        };
      }

      customerMap[name].orders += 1;
      customerMap[name].revenue +=
        getOrderAmount(order);
    });

    return Object.values(customerMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [orders]);

  /* =========================================================
     FINANCIAL CALCULATIONS
  ========================================================= */

  const revenueCollected = useMemo(() => {
    return orders.reduce(
      (sum, order) =>
        sum + getPaidAmount(order),
      0
    );
  }, [orders]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount ||
            expense.total ||
            0
        ),
      0
    );
  }, [expenses]);

  const netProfit = revenueCollected - totalExpenses;

  /* =========================================================
     RECEIVABLES AGING
  ========================================================= */

  const receivablesAging = useMemo(() => {
    const aging = {
      "0-30d": 0,
      "31-60d": 0,
      "61-90d": 0,
      "90+d": 0,
    };

    const today = new Date();

    orders.forEach((order) => {
      const total = getOrderAmount(order);
      const paid = getPaidAmount(order);
      const balance = Math.max(total - paid, 0);

      if (!balance) return;

      const dueDateValue =
        order.dueDate ||
        order.date ||
        order.orderDate;

      if (!dueDateValue) return;

      const dueDate = new Date(dueDateValue);

      if (Number.isNaN(dueDate.getTime())) return;

      const difference =
        today.getTime() -
        dueDate.getTime();

      const days = Math.max(
        0,
        Math.floor(
          difference /
            (1000 * 60 * 60 * 24)
        )
      );

      if (days <= 30) {
        aging["0-30d"] += balance;
      } else if (days <= 60) {
        aging["31-60d"] += balance;
      } else if (days <= 90) {
        aging["61-90d"] += balance;
      } else {
        aging["90+d"] += balance;
      }
    });

    return aging;
  }, [orders]);

  /* =========================================================
     CHARTS
  ========================================================= */

  const destroyCharts = () => {
    Object.values(chartInstances.current).forEach(
      (chart) => {
        if (chart) chart.destroy();
      }
    );

    chartInstances.current = {};
  };

  useEffect(() => {
    destroyCharts();

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    /* ================= SALES ================= */

    if (activeTab === "sales") {
      chartInstances.current.BRE = new Chart(
        chartRefs.BRE.current,
        {
          type: "bar",

          data: {
            labels: months,

            datasets: [
              {
                label: "Revenue",
                data: monthlyRevenue,
                backgroundColor:
                  "rgba(10,61,98,.82)",
              },
              {
                label: "Expenses",
                data: monthlyExpenses,
                backgroundColor:
                  "rgba(220,38,38,.65)",
              },
            ],
          },

          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        }
      );

      chartInstances.current.BOS = new Chart(
        chartRefs.BOS.current,
        {
          type: "pie",

          data: {
            labels: [
              "New",
              "Processing",
              "Shipped",
              "Delivered",
              "Cancelled",
            ],

            datasets: [
              {
                data: orderStatusData,

                backgroundColor: [
                  "#94a3b8",
                  "#1565a8",
                  "#7c3aed",
                  "#16a34a",
                  "#dc2626",
                ],
              },
            ],
          },

          options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
              legend: {
                position: "bottom",
              },
            },
          },
        }
      );

      chartInstances.current.BTP = new Chart(
        chartRefs.BTP.current,
        {
          type: "bar",

          data: {
            labels: topProducts.length
              ? topProducts.map(
                  ([name]) => name
                )
              : ["No Sales"],

            datasets: [
              {
                data: topProducts.length
                  ? topProducts.map(
                      ([, value]) => value
                    )
                  : [0],

                backgroundColor:
                  "rgba(10,61,98,.78)",
              },
            ],
          },

          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y",

            plugins: {
              legend: {
                display: false,
              },
            },
          },
        }
      );

      const categoryLabels = categorySales.length
        ? categorySales.map(
            ([name, value]) =>
              `${name.charAt(0).toUpperCase() + name.slice(1)} ${Math.round(
                (value /
                  categorySales.reduce(
                    (sum, [, amount]) =>
                      sum + amount,
                    0
                  )) *
                  100
              )}%`
          )
        : ["No Sales"];

      const categoryValues = categorySales.length
        ? categorySales.map(([, value]) => value)
        : [1];

      chartInstances.current.BSC = new Chart(
        chartRefs.BSC.current,
        {
          type: "doughnut",

          data: {
            labels: categoryLabels,

            datasets: [
              {
                data: categoryValues,

                backgroundColor: [
                  "#0A3D62",
                  "#16a34a",
                  "#1565a8",
                  "#7c3aed",
                  "#F0A500",
                  "#94a3b8",
                ],
              },
            ],
          },

          options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
              legend: {
                position: "bottom",
              },
            },
          },
        }
      );

      chartInstances.current.BMG = new Chart(
        chartRefs.BMG.current,
        {
          type: "line",

          data: {
            labels: months,

            datasets: [
              {
                label: "Growth %",
                data: monthlyGrowth,

                borderColor: "#16a34a",
                backgroundColor:
                  "rgba(22,163,74,.08)",

                tension: 0.4,
                fill: true,
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
                ticks: {
                  callback: (value) =>
                    value + "%",
                },
              },
            },
          },
        }
      );
    }

    /* ================= INVENTORY ================= */

    if (activeTab === "inventory") {
      const inventoryLabels = stockByCategory.length
        ? stockByCategory.map(([name]) =>
            name.charAt(0).toUpperCase() +
            name.slice(1)
          )
        : ["No Stock"];

      const inventoryValues = stockByCategory.length
        ? stockByCategory.map(([, value]) => value)
        : [0];

      chartInstances.current.BST = new Chart(
        chartRefs.BST.current,
        {
          type: "bar",

          data: {
            labels: inventoryLabels,

            datasets: [
              {
                data: inventoryValues,

                backgroundColor:
                  "rgba(10,61,98,.78)",

                label: "Stock Units",
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
          },
        }
      );

      /*
       * Frontend estimate only.
       * Accurate inventory turnover should come from backend
       * using opening stock, closing stock and COGS.
       *
       * TODO: Backend API should provide monthly inventory
       * turnover rate when inventory history/COGS is available.
       */

      const monthlyStockActivity = months.map(
        (_, monthIndex) => {
          let soldQty = 0;

          orders.forEach((order) => {
            const orderDate = getOrderDate(order);

            if (
              getMonthIndex(orderDate) !==
              monthIndex
            ) {
              return;
            }

            const items = Array.isArray(order.items)
              ? order.items
              : [];

            items.forEach((item) => {
              soldQty += Number(
                item.qty ||
                  item.quantity ||
                  0
              );
            });
          });

          const totalStock = products.reduce(
            (sum, product) =>
              sum + getProductStock(product),
            0
          );

          return totalStock
            ? Number(
                (soldQty / totalStock).toFixed(2)
              )
            : 0;
        }
      );

      chartInstances.current.BTR = new Chart(
        chartRefs.BTR.current,
        {
          type: "line",

          data: {
            labels: months,

            datasets: [
              {
                data: monthlyStockActivity,

                borderColor: "#16a34a",

                tension: 0.4,

                label: "Turnover Rate",
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
          },
        }
      );
    }

    /* ================= CUSTOMER ================= */

    if (activeTab === "customer") {
      chartInstances.current.BNC = new Chart(
        chartRefs.BNC.current,
        {
          type: "bar",

          data: {
            labels: months,

            datasets: [
              {
                data: newCustomersMonthly,

                backgroundColor:
                  "rgba(10,61,98,.78)",

                label: "New Customers",
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
          },
        }
      );

      chartInstances.current.BLF = new Chart(
        chartRefs.BLF.current,
        {
          type: "bar",

          data: {
            labels: [
              "New",
              "Qualified",
              "Proposal",
              "Negotiation",
              "Won",
            ],

            datasets: [
              {
                data: leadFunnel,

                backgroundColor: [
                  "rgba(10,61,98,.9)",
                  "rgba(10,61,98,.75)",
                  "rgba(10,61,98,.6)",
                  "rgba(10,61,98,.45)",
                  "rgba(22,163,74,.85)",
                ],
              },
            ],
          },

          options: {
            responsive: true,
            maintainAspectRatio: false,

            indexAxis: "y",

            plugins: {
              legend: {
                display: false,
              },
            },
          },
        }
      );
    }

    /* ================= FINANCIAL ================= */

    if (activeTab === "financial") {
      const monthlyProfit = monthlyRevenue.map(
        (revenue, index) =>
          revenue - monthlyExpenses[index]
      );

      chartInstances.current.BPL = new Chart(
        chartRefs.BPL.current,
        {
          type: "bar",

          data: {
            labels: months,

            datasets: [
              {
                label: "Profit",

                data: monthlyProfit,

                backgroundColor:
                  "rgba(22,163,74,.78)",
              },
            ],
          },

          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        }
      );

      const expenseMap = {};

      expenses.forEach((expense) => {
        const category =
          expense.cat ||
          expense.category ||
          "Other";

        expenseMap[category] =
          (expenseMap[category] || 0) +
          Number(
            expense.amount ||
              expense.total ||
              0
          );
      });

      const expenseEntries =
        Object.entries(expenseMap);

      chartInstances.current.BEB = new Chart(
        chartRefs.BEB.current,
        {
          type: "pie",

          data: {
            labels: expenseEntries.length
              ? expenseEntries.map(
                  ([name]) => name
                )
              : ["No Expenses"],

            datasets: [
              {
                data: expenseEntries.length
                  ? expenseEntries.map(
                      ([, value]) => value
                    )
                  : [1],

                backgroundColor: [
                  "#0A3D62",
                  "#1565a8",
                  "#F0A500",
                  "#ea580c",
                  "#7c3aed",
                  "#94a3b8",
                ],
              },
            ],
          },

          options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
              legend: {
                position: "right",
              },
            },
          },
        }
      );

      chartInstances.current.BRA = new Chart(
        chartRefs.BRA.current,
        {
          type: "bar",

          data: {
            labels: [
              "0-30d",
              "31-60d",
              "61-90d",
              "90+d",
            ],

            datasets: [
              {
                data: [
                  receivablesAging["0-30d"],
                  receivablesAging["31-60d"],
                  receivablesAging["61-90d"],
                  receivablesAging["90+d"],
                ],
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
          },
        }
      );

      /*
       * Forecast is currently calculated from recent revenue.
       * For a production ERP, this should come from backend
       * analytics/forecasting logic.
       *
       * TODO: Backend API required for accurate cash-flow
       * forecast using invoices, receivables, expenses,
       * payment history and expected collections.
       */

      const recentRevenue = monthlyRevenue.slice(-4);

      const averageRevenue =
        recentRevenue.length
          ? recentRevenue.reduce(
              (sum, value) =>
                sum + value,
              0
            ) / recentRevenue.length
          : 0;

      const cashFlowForecast = [
        averageRevenue,
        averageRevenue * 1.05,
        averageRevenue * 0.95,
        averageRevenue * 1.1,
      ].map((value) =>
        Math.round(value)
      );

      chartInstances.current.BCF = new Chart(
        chartRefs.BCF.current,
        {
          type: "line",

          data: {
            labels: [
              "Next Month",
              "Month +2",
              "Month +3",
              "Month +4",
            ],

            datasets: [
              {
                label: "Forecast",

                data: cashFlowForecast,

                borderColor: "#7c3aed",

                borderDash: [5, 5],

                tension: 0.4,
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
          },
        }
      );
    }

    return () => {
      destroyCharts();
    };
  }, [
    activeTab,
    orders,
    expenses,
    products,
    customers,
    leads,
    monthlyRevenue,
    monthlyExpenses,
    orderStatusData,
    topProducts,
    categorySales,
    monthlyGrowth,
    stockByCategory,
    newCustomersMonthly,
    leadFunnel,
    receivablesAging,
  ]);

  return (
    <div className="main">

      <div className="topbar">

        <div>
          <div className="tbh1" id="TTL">
            Business Intelligence
          </div>

          <div className="tbsub" id="TSUB">
            Analytics & Business Insights
          </div>
        </div>

        <div className="tbr">

          <input
            className="tsrch"
            placeholder="Search..."
            id="GSI"
            value={search}
            autoComplete="off"
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleGlobalSearch(search);
              }
            }}
          />

          <button
            className="tibtn"
            title="Price updates"
            onClick={() =>
              navigate("/pricemonitor")
            }
          >
            <span>💱</span>
          </button>

          <button
            className="tibtn"
            title="New orders"
            onClick={() =>
              navigate("/orders")
            }
          >
            <span>📦</span>
          </button>

          <button
            className="tibtn"
            title="Notifications"
            data-notification-area
            onClick={() =>
              setShowNotifications(
                (prev) => !prev
              )
            }
            style={{
              position: "relative",
            }}
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
                border:
                  "1px solid #e5e7eb",
                borderRadius: "10px",
                boxShadow:
                  "0 8px 25px rgba(0,0,0,.12)",
                zIndex: 1000,
                padding: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <strong>
                  Notifications
                </strong>

                {unreadNotifications.length >
                  0 && (
                  <button
                    onClick={
                      markAllNotificationsRead
                    }
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
                notifications.map(
                  (notification) => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        if (
                          !readNotifications.includes(
                            notification.id
                          )
                        ) {
                          markNotificationRead?.(
                            notification.id
                          );
                        }

                        setShowNotifications(
                          false
                        );

                        if (
                          notification.action
                        ) {
                          notification.action?.();
                        } else if (
                          notification.route
                        ) {
                          navigate(
                            notification.route
                          );
                        }
                      }}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        background:
                          readNotifications.includes(
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
                        {
                          notification.title
                        }
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                        }}
                      >
                        {
                          notification.message
                        }
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          )}
        </div>
      </div>

      <div className="content">

        <div
          className="view active"
          id="v-bi"
        >

          {/* ================= TABS ================= */}

          <div className="tabs" id="BIT">

            <button
              className={`tab ${
                activeTab === "sales"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab("sales")
              }
            >
              📊 Sales
            </button>

            <button
              className={`tab ${
                activeTab === "inventory"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab("inventory")
              }
            >
              🏭 Inventory
            </button>

            <button
              className={`tab ${
                activeTab === "customer"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab("customer")
              }
            >
              👥 Customer
            </button>

            <button
              className={`tab ${
                activeTab === "financial"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab("financial")
              }
            >
              💰 Financial P&L
            </button>

          </div>

          {/* ================= SALES ================= */}

          {activeTab === "sales" && (
            <>
              <div className="kg">

                <div className="kpi">
                  <div className="kico ig">
                    💰
                  </div>

                  <div>
                    <div className="kval">
                      {fPKR(revenueYTD)}
                    </div>

                    <div className="klbl">
                      Revenue YTD
                    </div>

                    <div className="ktrend up">
                      Actual order revenue
                    </div>
                  </div>
                </div>

                <div className="kpi">
                  <div className="kico ib">
                    📦
                  </div>

                  <div>
                    <div className="kval">
                      {totalOrders}
                    </div>

                    <div className="klbl">
                      Total Orders
                    </div>

                    <div className="ktrend up">
                      Current orders
                    </div>
                  </div>
                </div>

                <div className="kpi">
                  <div className="kico io">
                    💵
                  </div>

                  <div>
                    <div className="kval">
                      {fPKR(
                        avgOrderValue
                      )}
                    </div>

                    <div className="klbl">
                      Avg Order Value
                    </div>

                    <div className="ktrend up">
                      Based on orders
                    </div>
                  </div>
                </div>

                <div className="kpi">
                  <div className="kico ip">
                    🏆
                  </div>

                  <div>
                    <div className="kval">
                      {leadConversion}%
                    </div>

                    <div className="klbl">
                      Lead Conversion
                    </div>

                    <div className="ktrend up">
                      Won / Total Leads
                    </div>
                  </div>
                </div>

              </div>

              <div className="cgrid">

                <div className="card">
                  <div className="chd">
                    <h3>
                      Revenue vs Expenses
                    </h3>
                  </div>

                  <div className="cbd">
                    <div className="cw">
                      <canvas
                        ref={chartRefs.BRE}
                      />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="chd">
                    <h3>
                      Orders by Status
                    </h3>
                  </div>

                  <div className="cbd">
                    <div className="cw">
                      <canvas
                        ref={chartRefs.BOS}
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="cgrid3">

                <div className="card">
                  <div className="chd">
                    <h3>
                      Top Products
                    </h3>
                  </div>

                  <div className="cbd">
                    <div className="cw">
                      <canvas
                        ref={chartRefs.BTP}
                      />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="chd">
                    <h3>
                      Sales by Category
                    </h3>
                  </div>

                  <div className="cbd">
                    <div className="cw">
                      <canvas
                        ref={chartRefs.BSC}
                      />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="chd">
                    <h3>
                      Monthly Growth %
                    </h3>
                  </div>

                  <div className="cbd">
                    <div className="cw">
                      <canvas
                        ref={chartRefs.BMG}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* ================= INVENTORY ================= */}

          {activeTab === "inventory" && (
            <>
              <div className="kg">

                <div className="kpi">
                  <div className="kico ib">
                    📦
                  </div>

                  <div>
                    <div className="kval">
                      {totalSKUs}
                    </div>

                    <div className="klbl">
                      Total SKUs
                    </div>
                  </div>
                </div>

                <div className="kpi">
                  <div className="kico ir">
                    ⚠️
                  </div>

                  <div>
                    <div className="kval">
                      {lowStockCount}
                    </div>

                    <div className="klbl">
                      Low Stock
                    </div>
                  </div>
                </div>

                <div className="kpi">
                  <div className="kico ig">
                    💰
                  </div>

                  <div>
                    <div className="kval">
                      {fPKR(
                        inventoryValue
                      )}
                    </div>

                    <div className="klbl">
                      Inventory Value
                    </div>
                  </div>
                </div>

                <div className="kpi">
                  <div className="kico io">
                    🔄
                  </div>

                  <div>
                    <div className="kval">
                      {products.length
                        ? "Active"
                        : "0x"}
                    </div>

                    <div className="klbl">
                      Inventory Status
                    </div>
                  </div>
                </div>

              </div>

              <div className="cgrid">

                <div className="card">
                  <div className="chd">
                    <h3>
                      Stock by Category
                    </h3>
                  </div>

                  <div className="cbd">
                    <div className="cw">
                      <canvas
                        ref={chartRefs.BST}
                      />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="chd">
                    <h3>
                      Inventory Turnover
                    </h3>
                  </div>

                  <div className="cbd">
                    <div className="cw">
                      <canvas
                        ref={chartRefs.BTR}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* ================= CUSTOMER ================= */}

          {activeTab === "customer" && (
            <>
              <div className="kg">

                <div className="kpi">
                  <div className="kico ib">
                    👥
                  </div>

                  <div>
                    <div className="kval">
                      {totalCustomers}
                    </div>

                    <div className="klbl">
                      Total Customers
                    </div>
                  </div>
                </div>

                <div className="kpi">
                  <div className="kico ig">
                    💎
                  </div>

                  <div>
                    <div className="kval">
                      {fPKR(
                        avgCustomerLTV
                      )}
                    </div>

                    <div className="klbl">
                      Avg Customer LTV
                    </div>
                  </div>
                </div>

                <div className="kpi">
                  <div className="kico io">
                    🎯
                  </div>

                  <div>
                    <div className="kval">
                      {leadConversion}%
                    </div>

                    <div className="klbl">
                      Lead→Customer Rate
                    </div>
                  </div>
                </div>

                <div className="kpi">
                  <div className="kico ip">
                    🔄
                  </div>

                  <div>
                    <div className="kval">
                      {repeatPurchaseRate}%
                    </div>

                    <div className="klbl">
                      Repeat Purchase Rate
                    </div>
                  </div>
                </div>

              </div>

              <div className="cgrid">

                <div className="card">
                  <div className="chd">
                    <h3>
                      New Customers / Month
                    </h3>
                  </div>

                  <div className="cbd">
                    <div className="cw">
                      <canvas
                        ref={chartRefs.BNC}
                      />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="chd">
                    <h3>
                      Lead Conversion Funnel
                    </h3>
                  </div>

                  <div className="cbd">
                    <div className="cw">
                      <canvas
                        ref={chartRefs.BLF}
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="card mt2">

                <div className="chd">
                  <h3>
                    Top Customers by Revenue
                  </h3>
                </div>

                <div className="tw">

                  <table className="tbl">

                    <thead>
                      <tr>
                        <th>
                          Customer
                        </th>
                        <th>
                          Orders
                        </th>
                        <th>
                          Revenue
                        </th>
                        <th>
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {topCustomers.length ===
                      0 ? (
                        <tr>
                          <td
                            colSpan="4"
                            style={{
                              textAlign:
                                "center",
                            }}
                          >
                            No customers yet
                          </td>
                        </tr>
                      ) : (
                        topCustomers.map(
                          (customer) => (
                            <tr
                              key={
                                customer.name
                              }
                            >
                              <td>
                                {
                                  customer.name
                                }
                              </td>

                              <td>
                                {
                                  customer.orders
                                }
                              </td>

                              <td>
                                {fPKR(
                                  customer.revenue
                                )}
                              </td>

                              <td>
                                Active
                              </td>
                            </tr>
                          )
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>
            </>
          )}

          {/* ================= FINANCIAL ================= */}

          {activeTab === "financial" && (
            <>
              <div className="kg">

                <div className="kpi">
                  <div className="kico ig">
                    💰
                  </div>

                  <div>
                    <div className="kval">
                      {fPKR(
                        revenueCollected
                      )}
                    </div>

                    <div className="klbl">
                      Revenue Collected
                    </div>
                  </div>
                </div>

                <div className="kpi">
                  <div className="kico ir">
                    💳
                  </div>

                  <div>
                    <div className="kval">
                      {fPKR(
                        totalExpenses
                      )}
                    </div>

                    <div className="klbl">
                      Total Expenses
                    </div>
                  </div>
                </div>

                <div className="kpi">
                  <div className="kico ig">
                    📈
                  </div>

                  <div>
                    <div className="kval">
                      {fPKR(
                        netProfit
                      )}
                    </div>

                    <div className="klbl">
                      Net Profit
                    </div>
                  </div>
                </div>

              </div>

              <div className="cgrid">

                <div className="card">
                  <div className="chd">
                    <h3>
                      Monthly P&L
                    </h3>
                  </div>

                  <div className="cbd">
                    <div className="cw">
                      <canvas
                        ref={chartRefs.BPL}
                      />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="chd">
                    <h3>
                      Expense Breakdown
                    </h3>
                  </div>

                  <div className="cbd">
                    <div className="cw">
                      <canvas
                        ref={chartRefs.BEB}
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="g2 mt2">

                <div className="card">
                  <div className="chd">
                    <h3>
                      Receivables Aging
                    </h3>
                  </div>

                  <div className="cbd">
                    <div
                      className="cw"
                      style={{
                        height: "170px",
                      }}
                    >
                      <canvas
                        ref={chartRefs.BRA}
                      />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="chd">
                    <h3>
                      Cash Flow Forecast
                    </h3>
                  </div>

                  <div className="cbd">
                    <div
                      className="cw"
                      style={{
                        height: "170px",
                      }}
                    >
                      <canvas
                        ref={chartRefs.BCF}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default BusinessIntelligence;