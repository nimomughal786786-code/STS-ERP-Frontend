import { useEffect, useMemo, useState } from "react";
import OrderModal from "../../../models/ordermodel";
import { useNavigate } from "react-router-dom";


const OSTATS = [
  "new",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const OCOLS = {
  new: "#94a3b8",
  processing: "#1565a8",
  shipped: "#7c3aed",
  delivered: "#16a34a",
  cancelled: "#dc2626",
};

function Orders({
  orders = [],
  onOrdersChange,
  customers = [],
  onCustomersChange,
  employees = [],
  notifications = [],
  readNotifications = [],
  addNotification,
  markAllNotificationsRead,
}) {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState("kan");

  const [kanSearch, setKanSearch] = useState("");
  const [kanCategory, setKanCategory] = useState("");

  const [listSearch, setListSearch] = useState("");
  const [listStatus, setListStatus] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);


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


  const navigate = useNavigate();

  /*
   * Original JS:
   * renderOrders() -> otab('kan', ...)
   */
  useEffect(() => {
    setActiveTab("kan");
  }, []);

  /*
   * Original renderKan()
   */
  const filteredKanOrders = useMemo(() => {
    const search = kanSearch.toLowerCase();

    return orders.filter(
      (order) =>
        (!search ||
          `${order.id}${order.customerName}`
            .toLowerCase()
            .includes(search)) &&
        (!kanCategory || order.cat === kanCategory)
    );
  }, [orders, kanSearch, kanCategory]);

  /*
   * Original renderOrdList()
   */
  const filteredListOrders = useMemo(() => {
    const search = listSearch.toLowerCase();

    return orders.filter(
      (order) =>
        (!search ||
          `${order.id}${order.customerName}`
            .toLowerCase()
            .includes(search)) &&
        (!listStatus || order.status === listStatus)
    );
  }, [orders, listSearch, listStatus]);

  /*
   * Original setOrdSt()
   */
  const setOrderStatus = (id, status) => {
    const order = orders.find(
      (item) => item.id === id
    );

    if (!order) return;

    const updatedOrders = orders.map((item) =>
      item.id === id
        ? { ...item, status }
        : item
    );

    onOrdersChange?.(updatedOrders);

    // Central notification
    addNotification?.({
      type: "order_updated",
      title: "Order Updated",
      message: `Order #${order.id} status changed to ${status}.`,
      action: () => {
        setActiveTab("list");
        setListSearch(String(order.id));
      },
    });
  };





  const handleItemChange = (index, field, value) => {
    setOrderItems((previous) =>
      previous.map((item, i) =>
        i === index
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const handleRemoveRow = (index) => {
    setOrderItems((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };



  const handleSaveOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),

      customerName: orderData.customer,
      salesPerson: orderData.salesPerson || "",
      date: orderData.orderDate,

      cat: orderData.category,

      address: orderData.address,

      notes: orderData.notes,

      total: orderData.items.reduce(
        (sum, item) =>
          sum +
          Number(item.qty || 0) * Number(item.rate || 0),
        0
      ),

      paidAmount: 0,

      status: "new",

      items: orderData.items,
    };

    onOrdersChange?.((previousOrders) => [
      ...previousOrders,
      newOrder,
    ]);

    // Central notification
    addNotification?.({
      type: "order_created",
      title: "New Order Created",
      message: `Order #${newOrder.id} for ${newOrder.customerName || "customer"
        } has been created.`,
      action: () => setActiveTab("kan"),
    });


    if (onCustomersChange && orderData.customer) {
      onCustomersChange((prevCustomers) =>
        prevCustomers.map((cust) =>
          cust.name === orderData.customer
            ? {
              ...cust,
              orders: Number(cust.orders || 0) + 1,
              totalSpent:
                Number(cust.totalSpent || 0) +
                Number(newOrder.total || 0),
            }
            : cust
        )
      );
    }
    setShowOrderModal(false);

    setOrderItems([]);

    console.log("Order Saved:", newOrder);
  };
  /*
   * Original advOrd()
   */
  const advanceOrder = (id) => {
    const order = orders.find((item) => item.id === id);

    if (!order) return;

    const currentIndex = OSTATS.indexOf(order.status);
    const nextStatus = OSTATS[currentIndex + 1];

    if (!nextStatus) return;

    setOrderStatus(id, nextStatus);
  };

  /*
   * Original selAll()
   */
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(
        filteredListOrders.map((order) => order.id)
      );
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id, checked) => {
    if (checked) {
      setSelectedOrders((previous) => [
        ...previous,
        id,
      ]);
    } else {
      setSelectedOrders((previous) =>
        previous.filter((orderId) => orderId !== id)
      );
    }
  };

  /*
   * Original exportCSV()
   */
  const exportOrders = () => {
    if (!orders.length) {
      alert("No orders available to export.");
      return;
    }

    const headers = [
      "Order ID",
      "Customer",
      "Sales Person",
      "Date",
      "Category",
      "Total",
      "Paid Amount",
      "Status",
    ];

    const rows = orders.map((order) => [
      order.id,
      order.customerName,
      order.salesPerson,
      order.date,
      order.cat,
      order.total,
      order.paidAmount,
      order.status,
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };



  const viewOrder = (id) => {
    const order = orders.find((item) => item.id === id);

    if (!order) return;

    console.log("View Order:", order);
  };




  // =========================
  // TOPBAR GLOBAL SEARCH
  // =========================
  const handleGlobalSearch = (value) => {
    const q = value.trim().toLowerCase();

    if (!q) return;

    // Search inside Orders
    const orderFound = orders.find((order) =>
      `${order.id || ""}
     ${order.customerName || ""}
     ${order.salesPerson || ""}
     ${order.cat || ""}
     ${order.status || ""}
     ${order.date || ""}`
        .toLowerCase()
        .includes(q)
    );

    if (orderFound) {
      // Switch to List View and show matching order
      setActiveTab("list");
      setListSearch(value);
      return;
    }

    // Navigate to related modules
    if (
      ["price", "price monitor", "pricing", "price update"].some((word) =>
        q.includes(word)
      )
    ) {
      navigate("/pricemonitor");
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
            <div className="tbh1" id="TTL">Order Management</div>
            <div className="tbsub" id="TSUB">
              View, track & manage customer orders
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




            <button
              className="btn bp bsm"
              onClick={() => {
                setOrderItems([]);
                setShowOrderModal(true);
              }}
            >
              + New Order
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
          <div className="view active" id="v-orders">






            {/* ══════════ TABS ══════════ */}

            <div className="tabs">

              <button
                className={`tab ${activeTab === "kan" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("kan")}
              >
                📌 Kanban
              </button>

              <button
                className={`tab ${activeTab === "list" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("list")}
              >
                📋 List View
              </button>

              <button
                className={`tab ${activeTab === "hist" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("hist")}
              >
                📜 History
              </button>

            </div>


            {/* ══════════ KANBAN ══════════ */}

            {activeTab === "kan" && (
              <div className="tc active" id="ot-kan">

                <div className="fr">

                  <input
                    className="sb"
                    placeholder="Search orders..."
                    value={kanSearch}
                    onChange={(e) =>
                      setKanSearch(e.target.value)
                    }
                  />

                  <select
                    className="fsl"
                    value={kanCategory}
                    onChange={(e) =>
                      setKanCategory(e.target.value)
                    }
                  >
                    <option value="">
                      All Categories
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
                  </select>

                  <button
                    className="btn bp"
                    onClick={() => {
                      setOrderItems([]);
                      setShowOrderModal(true);
                    }}
                  >
                    + New Order
                  </button>

                </div>


                <div className="okan" id="OKB">

                  {OSTATS.map((status) => {

                    const statusOrders =
                      filteredKanOrders.filter(
                        (order) =>
                          order.status === status
                      );

                    return (
                      <div
                        className="okcol"
                        key={status}
                      >

                        <div className="okch">

                          <span
                            style={{
                              color: OCOLS[status],
                              textTransform: "capitalize",
                            }}
                          >
                            {status}
                          </span>

                          <span
                            className="bdg d-new"
                            style={{
                              fontSize: ".6rem",
                            }}
                          >
                            {statusOrders.length}
                          </span>

                        </div>


                        {statusOrders.map((order) => (

                          <div
                            className="okcard"
                            key={order.id}
                            onClick={() =>
                              viewOrder(order.id)
                            }
                          >

                            <div className="okoid">
                              {order.id}
                            </div>

                            <div className="okcust">
                              {order.customerName}
                            </div>

                            <div className="okamt">
                              PKR{" "}
                              {Number(
                                order.total || 0
                              ).toLocaleString()}
                            </div>

                            <div className="okdate">
                              {order.date} · {order.cat}
                            </div>


                            <div
                              style={{
                                display: "flex",
                                gap: ".3rem",
                                marginTop: ".5rem",
                                flexWrap: "wrap",
                              }}
                            >

                              {status !== "delivered" &&
                                status !== "cancelled" && (

                                  <button
                                    className="btn bp bxs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      advanceOrder(order.id);
                                    }}
                                  >
                                    → Advance
                                  </button>

                                )}


                              <button
                                className="btn bgh bxs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewOrder(order.id);
                                }}
                              >
                                View
                              </button>

                            </div>

                          </div>

                        ))}

                      </div>
                    );
                  })}

                </div>

              </div>
            )}


            {/* ══════════ LIST VIEW ══════════ */}

            {activeTab === "list" && (
              <div className="tc active" id="ot-list">

                <div className="fr">

                  <input
                    className="sb"
                    placeholder="Search orders..."
                    value={listSearch}
                    onChange={(e) =>
                      setListSearch(e.target.value)
                    }
                  />

                  <select
                    className="fsl"
                    value={listStatus}
                    onChange={(e) =>
                      setListStatus(e.target.value)
                    }
                  >

                    <option value="">
                      All Status
                    </option>

                    <option value="new">
                      New
                    </option>

                    <option value="processing">
                      Processing
                    </option>

                    <option value="shipped">
                      Shipped
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>

                  </select>


                  <button
                    className="btn bgh bsm"
                    onClick={exportOrders}
                  >
                    ⬇ Export
                  </button>



                </div>


                <div className="card">

                  <div className="tw">

                    <table className="tbl">

                      <thead>

                        <tr>

                          <th>

                            <input
                              type="checkbox"
                              className="tck"
                              checked={
                                filteredListOrders.length > 0 &&
                                selectedOrders.length ===
                                filteredListOrders.length
                              }
                              onChange={(e) =>
                                handleSelectAll(
                                  e.target.checked
                                )
                              }
                            />

                          </th>

                          <th>
                            Order #
                          </th>

                          <th>
                            Customer
                          </th>
                          <th>
                            Sales Person
                          </th>
                          <th>
                            Date
                          </th>

                          <th>
                            Total
                          </th>

                          <th>
                            Payment
                          </th>

                          <th>
                            Status
                          </th>

                          <th>
                            Actions
                          </th>

                        </tr>

                      </thead>


                      <tbody id="OLB">

                        {filteredListOrders.map(
                          (order) => (

                            <tr key={order.id}>

                              <td>

                                <input
                                  type="checkbox"
                                  className="tck"
                                  checked={selectedOrders.includes(
                                    order.id
                                  )}
                                  onChange={(e) =>
                                    handleSelectOrder(
                                      order.id,
                                      e.target.checked
                                    )
                                  }
                                />

                              </td>


                              <td
                                className="mn"
                                style={{
                                  cursor: "pointer",
                                  color: "var(--bm)",
                                }}
                                onClick={() =>
                                  viewOrder(order.id)
                                }
                              >
                                {order.id}
                              </td>


                              <td>
                                <strong>
                                  {order.customerName}
                                </strong>
                              </td>
                              <td>
                                {order.salesPerson || "—"}
                              </td>

                              <td>
                                {order.date}
                              </td>


                              <td className="mn">
                                PKR{" "}
                                {Number(
                                  order.total || 0
                                ).toLocaleString()}
                              </td>


                              <td>

                                {Number(
                                  order.paidAmount || 0
                                ) >=
                                  Number(
                                    order.total || 0
                                  )
                                  ? (
                                    <span className="bdg d-paid">
                                      paid
                                    </span>
                                  )
                                  : (
                                    <span className="bdg d-partial">
                                      partial
                                    </span>
                                  )}

                              </td>


                              <td>

                                <span
                                  className={`bdg d-${order.status}`}
                                >
                                  {order.status}
                                </span>

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
                                      viewOrder(
                                        order.id
                                      )
                                    }
                                  >
                                    View
                                  </button>


                                  <select
                                    className="fsl"
                                    value={order.status}
                                    style={{
                                      fontSize: ".65rem",
                                      padding:
                                        ".18rem .45rem",
                                      minWidth: "auto",
                                    }}
                                    onChange={(e) =>
                                      setOrderStatus(
                                        order.id,
                                        e.target.value
                                      )
                                    }
                                  >

                                    {OSTATS.map(
                                      (status) => (

                                        <option
                                          key={status}
                                          value={status}
                                        >
                                          {status
                                            .charAt(0)
                                            .toUpperCase() +
                                            status.slice(1)}
                                        </option>

                                      )
                                    )}

                                  </select>

                                </div>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

              </div>
            )}


            {/* ══════════ HISTORY ══════════ */}

            {activeTab === "hist" && (
              <div className="tc active" id="ot-hist">

                <div className="card">

                  <div className="tw">

                    <table className="tbl">

                      <thead>

                        <tr>
                          <th>Order #</th>
                          <th>Customer</th>
                          <th>Sales Person</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>

                      </thead>


                      <tbody id="OHB">

                        {orders.map((order) => (

                          <tr key={order.id}>

                            <td className="mn">
                              {order.id}
                            </td>

                            <td>
                              {order.customerName}
                            </td>
                            <td>
                              {order.salesPerson || "—"}
                            </td>
                            <td>
                              {order.date}
                            </td>

                            <td className="mn">
                              PKR{" "}
                              {Number(
                                order.total || 0
                              ).toLocaleString()}
                            </td>

                            <td>

                              <span
                                className={`bdg d-${order.status}`}
                              >
                                {order.status}
                              </span>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                </div>

              </div>
            )}
            {showOrderModal && (
              <OrderModal
                onClose={() => setShowOrderModal(false)}

                onSave={handleSaveOrder}
                employees={employees}

                onAddRow={() => {
                  setOrderItems((prev) => [
                    ...prev,
                    {
                      id: Date.now(),
                      name: "",
                      qty: 1,
                      rate: 0,
                    },
                  ]);
                }}

                orderItems={orderItems}

                onRemoveRow={handleRemoveRow}

                onItemChange={handleItemChange}
                customers={customers}
              />
            )}




          </div>
        </div>
      </div>



    

  );
}

export default Orders;