import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../component/SideBar/sidebar";
import PriceSourceModal from "../../../models/pricemodel";

function PriceMonitor({
  priceUpdates = [],
  onPriceUpdatesChange,
  notifications = [],
  readNotifications = [],
  addNotification,
  markAllNotificationsRead,
}) {
  const navigate = useNavigate();

  const [priceSources, setPriceSources] = useState(() => {
    const saved = localStorage.getItem("sts_price_sources");
    return saved ? JSON.parse(saved) : [];
  });



  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("sts_products");
    return saved ? JSON.parse(saved) : [];
  });

  const [frequency, setFrequency] = useState("Daily 8:00 AM");
  const [notifyEmail, setNotifyEmail] = useState(
    "sales@smarttradingsolutions.net"
  );
  const [autoApprove, setAutoApprove] = useState(3);
  const [markup, setMarkup] = useState(15);

  const [searchTerm, setSearchTerm] = useState("");
  const [showPSModal, setShowPSModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [toasts, setToasts] = useState([]);

  // ══ NEW: custom confirm modal state — replaces window.confirm for Approve All / Reject All ══
  const [confirmAction, setConfirmAction] = useState(null); // "approve" | "reject" | null

  const showToast = (message, type = "info", duration = 2500) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const notificationArea = event.target.closest("[data-notification-area]");
      if (!notificationArea) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    localStorage.setItem("sts_price_sources", JSON.stringify(priceSources));
  }, [priceSources]);








  useEffect(() => {
    const syncProducts = () => {
      const saved = localStorage.getItem("sts_products");
      setProducts(saved ? JSON.parse(saved) : []);
    };

    syncProducts();
    window.addEventListener("storage", syncProducts);
    return () => window.removeEventListener("storage", syncProducts);
  }, []);

  const pendingCount = priceUpdates.filter(
    (p) => p.status === "pending"
  ).length;

  const filteredPriceUpdates = searchTerm.trim()
    ? priceUpdates.filter((p) =>
      p.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : priceUpdates;

  const openPSModal = () => {
    setShowPSModal(true);
  };

  const closePSModal = () => {
    setShowPSModal(false);
  };

  const handleSaveSource = (sourceData) => {
    if (!sourceData?.name || !sourceData?.url) {
      showToast("Please fill in required fields", "error");
      return;
    }

    const newSource = {
      id: "PS-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: sourceData.name,
      url: sourceData.url,
      type: sourceData.type || "scrape",
      category: sourceData.category || "all",
      status: "active",
      lastFetch: new Date().toISOString(),
    };

    setPriceSources((prev) => [newSource, ...prev]);
    setShowPSModal(false);
    showToast(`Source "${newSource.name}" added`, "success");

    addNotification?.({
      type: "price_source_added",
      title: "Price Source Added",
      message: `${newSource.name} added for automated price monitoring.`,
      action: () => navigate("/pricemonitor"),
    });
  };

  const togglePS = (id) => {
    setPriceSources((prev) =>
      prev.map((source) =>
        source.id === id
          ? {
            ...source,
            status:
              source.status === "active" ? "inactive" : "active",
          }
          : source
      )
    );
  };

  const approvePU = (id) => {
    onPriceUpdatesChange((prev) =>
      prev.map((update) =>
        update.id === id
          ? { ...update, status: "approved" }
          : update
      )
    );

    const update = priceUpdates.find((item) => item.id === id);
    if (update) {
      const saved = localStorage.getItem("sts_products");
      const currentProducts = saved ? JSON.parse(saved) : [];
      const updatedProducts = currentProducts.map((product) =>
        product.id === update.productId
          ? { ...product, salePrice: update.newPrice }
          : product
      );
      localStorage.setItem("sts_products", JSON.stringify(updatedProducts));
      setProducts(updatedProducts);

      addNotification?.({
        type: "price_approved",
        title: "Price Update Approved",
        message: `${update.productName} price updated to PKR ${Number(update.newPrice).toLocaleString()}.`,
        action: () => navigate("/pricemonitor"),
      });
    }
  };

  const rejectPU = (id) => {
    onPriceUpdatesChange((prev) =>
      prev.map((update) =>
        update.id === id
          ? { ...update, status: "rejected" }
          : update
      )
    );
  };

  // ══ CHANGED: Approve All button now opens the custom confirm modal instead of running directly ══
  const requestApproveAll = () => {
    const pending = priceUpdates.filter((p) => p.status === "pending");
    if (!pending.length) return;
    setConfirmAction("approve");
  };

  // ══ CHANGED: Reject All button now also opens the custom confirm modal ══
  const requestRejectAll = () => {
    const pending = priceUpdates.filter((p) => p.status === "pending");
    if (!pending.length) return;
    setConfirmAction("reject");
  };

  // ══ NEW: actual approve-all logic, now triggered only after confirming in the custom modal ══
  const approveAll = () => {
    const pending = priceUpdates.filter(
      (p) => p.status === "pending"
    );

    if (!pending.length) return;

    onPriceUpdatesChange((prev) =>
      prev.map((update) =>
        update.status === "pending"
          ? { ...update, status: "approved" }
          : update
      )
    );

    const saved = localStorage.getItem("sts_products");
    const currentProducts = saved ? JSON.parse(saved) : [];
    const updatedProducts = currentProducts.map((product) => {
      const update = pending.find((item) => item.productId === product.id);
      return update ? { ...product, salePrice: update.newPrice } : product;
    });
    localStorage.setItem("sts_products", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);

    showToast(`${pending.length} price updates approved`, "success");

    addNotification?.({
      type: "price_approved_all",
      title: "Price Updates Approved",
      message: `${pending.length} price updates were approved.`,
      action: () => navigate("/pricemonitor"),
    });
  };

  // ══ NEW: actual reject-all logic, triggered only after confirming in the custom modal ══
  const rejectAll = () => {
    const pending = priceUpdates.filter((p) => p.status === "pending");

    if (!pending.length) return;

    onPriceUpdatesChange((prev) =>
      prev.map((update) =>
        update.status === "pending"
          ? { ...update, status: "rejected" }
          : update
      )
    );

    showToast(`${pending.length} price updates rejected`, "success");
  };

  // ══ NEW: runs when the confirm modal's "Yes" button is clicked ══
  const handleConfirm = () => {
    if (confirmAction === "approve") {
      approveAll();
    } else if (confirmAction === "reject") {
      rejectAll();
    }
    setConfirmAction(null);
  };

  const handleCancelConfirm = () => {
    setConfirmAction(null);
  };

  const runFetch = () => {
    if (!products.length) {
      showToast("No products found — add products first", "error");
      return;
    }

    setIsFetching(true);
    showToast("Fetching prices from all active sources...", "info", 1200);

    // ══ CHANGED: fetch delay reduced from 2200ms to 600ms — rapid fetch ══
    setTimeout(() => {
      const newUpdates = products.slice(0, 4).map((product) => {
        const currentPrice = Number(product.salePrice) || 0;
        const change = (Math.random() - 0.32) * 0.18;
        const newPrice = Math.round(currentPrice * (1 + change));

        return {
          id:
            "PU-" +
            Date.now().toString(36) +
            Math.random().toString(36).slice(2, 6),

          productId: product.id,
          productName: product.name,
          source: "Alladin.pk",
          currentPrice,
          newPrice,
          change: (change * 100).toFixed(1),
          fetchedAt: new Date().toISOString().split("T")[0],
          status: "pending",
        };
      });

      onPriceUpdatesChange((prev) => [...newUpdates, ...prev]);
      setIsFetching(false);
      showToast(
        `Fetch complete! ${newUpdates.length} new price updates found`,
        "success"
      );

      addNotification?.({
        type: "price_fetch_complete",
        title: "New Price Updates Found",
        message: `${newUpdates.length} price update${newUpdates.length !== 1 ? "s" : ""} pending review.`,
        action: () => navigate("/pricemonitor"),
      });
    }, 600);
  };

  const exportPrices = () => {
    showToast("Exporting price data to CSV...", "info", 2000);

    const headers = [
      "Product",
      "Source",
      "Current Price",
      "New Price",
      "Change %",
      "Fetched",
      "Status",
    ];

    const rows = priceUpdates.map((p) => [
      p.productName,
      p.source,
      p.currentPrice,
      p.newPrice,
      p.change,
      p.fetchedAt,
      p.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "price-updates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatPKR = (value) => {
    return `PKR ${Number(value || 0).toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  const saveSettings = () => {
    showToast("Settings saved!", "success");
  };

  const unreadNotifications = notifications.filter(
    (notification) => !readNotifications.includes(notification.id)
  );

  return (

    <div id="app">
      <Sidebar />
      <div className="main">

        <div className="topbar">
          <div>
            <div className="tbh1" id="TTL">Price Monitor</div>
            <div className="tbsub" id="TSUB">
              Automated supplier price tracking & approval
            </div>
          </div>

          <div className="tbr">

            <input
              className="tsrch"
              placeholder="Search..."
              id="GSI"
              value={searchTerm}
              onInput={(e) => {
                setSearchTerm(e.target.value);
              }}
            />

            <button
              className="tibtn"
              title="Price updates"
              onClick={() => navigate("/pricemonitor")}
            >
              <span>💱</span>
              <span className={`ndot ${pendingCount > 0 ? "show" : ""}`}></span>
            </button>

            <button
              className="tibtn"
              title="New orders"
              onClick={() => navigate("/orders")}
            >
              <span>📦</span>
              <span className="ndot show" id="ND"></span>
            </button>

            <button
              className="tibtn"
              title="Notifications"
              data-notification-area
              onClick={() => setShowNotifications((prev) => !prev)}
              style={{ position: "relative" }}
            >
              <span>🔔</span>
              {unreadNotifications.length > 0 && <span className="ndot show" id="NBD"></span>}
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
                        background: readNotifications.includes(notification.id) ? "#fff" : "#f1f5f9",
                        marginBottom: "6px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "3px" }}>
                        {notification.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>{notification.message}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ══ CHANGED: topbar Approve All now goes through confirm modal ══ */}
            <button
              className="btn bp bsm"
              onClick={requestApproveAll}
            >
              ✅ Approve All
            </button>
            <div id="TBA"></div>

          </div>

        </div>

        <div className="content">

          <div className="view active " id="v-prices">

            <div className="al ali">
              ℹ️ Automated price monitoring fetches prices daily from configured
              suppliers. Review and approve changes before they update on your
              website.
            </div>

            <div
              className="g2"
              style={{ marginBottom: "1rem" }}
            >

              <div className="card">

                <div className="chd">

                  <h3>📡 Price Sources</h3>

                  <button
                    className="btn bp bsm"
                    onClick={openPSModal}
                  >
                    + Add Source
                  </button>

                </div>

                <div className="cbd" id="PSC">

                  {priceSources.map((source) => (
                    <div
                      className="pscard"
                      key={source.id}
                    >

                      <div className="psico">
                        {{
                          scrape: "🕷️",
                          api: "🔌",
                          manual: "📋",
                          email: "📧",
                        }[source.type]}
                      </div>

                      <div style={{ flex: 1 }}>

                        <div
                          style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 700,
                            fontSize: ".82rem",
                          }}
                        >
                          {source.name}
                        </div>

                        <div
                          style={{
                            fontSize: ".7rem",
                            color: "var(--mu)",
                          }}
                        >
                          {source.url}
                        </div>

                      </div>

                      <div style={{ textAlign: "right" }}>

                        <span
                          className={`bdg d-${source.status}`}
                        >
                          {source.status}
                        </span>

                        <div
                          style={{
                            fontSize: ".67rem",
                            color: "var(--mu)",
                            marginTop: ".15rem",
                          }}
                        >
                          Last: {formatDate(source.lastFetch)}
                        </div>

                      </div>

                      <button
                        className="btn bgh bxs"
                        onClick={() =>
                          togglePS(source.id)
                        }
                      >
                        {source.status === "active"
                          ? "Pause"
                          : "Activate"}
                      </button>

                    </div>
                  ))}

                </div>
              </div>


              <div className="card">

                <div className="chd">
                  <h3>⚙️ Fetch Settings</h3>
                </div>

                <div className="cbd">

                  <div
                    className="fg2"
                    style={{ marginBottom: ".8rem" }}
                  >

                    <div className="fg">

                      <label>Frequency</label>

                      <select
                        id="PFF"
                        value={frequency}
                        onChange={(e) =>
                          setFrequency(e.target.value)
                        }
                      >
                        <option>Daily 8:00 AM</option>
                        <option>Twice Daily</option>
                        <option>Weekly</option>
                        <option>Manual Only</option>
                      </select>

                    </div>


                    <div className="fg">

                      <label>Notify Email</label>

                      <input
                        id="PNE"
                        value={notifyEmail}
                        onChange={(e) =>
                          setNotifyEmail(e.target.value)
                        }
                      />

                    </div>


                    <div className="fg">

                      <label>
                        Auto-approve if change &lt;
                      </label>

                      <input
                        type="number"
                        id="PAT"
                        value={autoApprove}
                        onChange={(e) =>
                          setAutoApprove(e.target.value)
                        }
                        style={{ width: "70px" }}
                      />

                      <span
                        style={{
                          fontSize: ".78rem",
                          color: "var(--mu)",
                          lineHeight: 2.2,
                        }}
                      >
                        %
                      </span>

                    </div>


                    <div className="fg">

                      <label>
                        Source Price Markup %
                      </label>

                      <input
                        type="number"
                        id="PMK"
                        value={markup}
                        onChange={(e) =>
                          setMarkup(e.target.value)
                        }
                        placeholder="e.g. 15"
                      />

                    </div>

                  </div>


                  <button
                    className="btn bp bsm"
                    onClick={runFetch}
                    disabled={isFetching}
                  >
                    🔄 {isFetching ? "Fetching..." : "Fetch Now"}
                  </button>

                  <button
                    className="btn bgh bsm"
                    onClick={saveSettings}
                  >
                    💾 Save
                  </button>

                </div>

              </div>

            </div>


            <div className="card">

              <div className="chd">

                <div className="fb">

                  <h3>📋 Price Updates Pending</h3>

                  <span
                    className="bdg d-review"
                    id="PPС"
                  >
                    {pendingCount}
                  </span>

                </div>


                <div className="fb">

                  {/* ══ CHANGED: both buttons now go through the custom confirm modal ══ */}
                  <button
                    className="btn bg2 bsm"
                    onClick={requestApproveAll}
                  >
                    ✅ Approve All
                  </button>

                  <button
                    className="btn br2 bsm"
                    onClick={requestRejectAll}
                  >
                    ✕ Reject All
                  </button>

                  <button
                    className="btn bgh bsm"
                    onClick={exportPrices}
                  >
                    ⬇ Export
                  </button>

                </div>

              </div>


              <div className="tw">

                <table className="tbl">

                  <thead>

                    <tr>

                      <th>
                        <input
                          type="checkbox"
                          className="tck"
                        />
                      </th>

                      <th>Product</th>

                      <th>Source</th>

                      <th>Current Price</th>

                      <th>New Price</th>

                      <th>Change %</th>

                      <th>Fetched</th>

                      <th>Actions</th>

                    </tr>

                  </thead>


                  <tbody id="PUB">

                    {filteredPriceUpdates.map((price) => {

                      const change = parseFloat(
                        price.change
                      );

                      return (
                        <tr
                          key={price.id}
                          style={{
                            opacity:
                              price.status !== "pending"
                                ? 0.5
                                : 1,
                          }}
                        >

                          <td>
                            <input
                              type="checkbox"
                              className="tck"
                              id={`pu-${price.id}`}
                            />
                          </td>


                          <td>
                            <strong
                              style={{
                                fontSize: ".79rem",
                              }}
                            >
                              {price.productName}
                            </strong>
                          </td>


                          <td>

                            <span
                              className="bdg d-draft"
                              style={{
                                fontSize: ".62rem",
                              }}
                            >
                              {price.source}
                            </span>

                          </td>


                          <td className="mn">
                            {formatPKR(
                              price.currentPrice
                            )}
                          </td>


                          <td className="mn">
                            {formatPKR(
                              price.newPrice
                            )}
                          </td>


                          <td
                            className={
                              change > 0
                                ? "pup"
                                : "pdn"
                            }
                            style={{
                              fontWeight: 700,
                            }}
                          >
                            {change > 0
                              ? "▲"
                              : "▼"}{" "}
                            {Math.abs(change)}%
                          </td>


                          <td
                            style={{
                              fontSize: ".7rem",
                              color: "var(--mu)",
                            }}
                          >
                            {formatDate(
                              price.fetchedAt
                            )}
                          </td>


                          <td>

                            {price.status ===
                              "pending" ? (
                              <>
                                <button
                                  className="btn bg2 bxs"
                                  onClick={() =>
                                    approvePU(
                                      price.id
                                    )
                                  }
                                >
                                  ✅ Approve
                                </button>

                                <button
                                  className="btn br2 bxs"
                                  onClick={() =>
                                    rejectPU(
                                      price.id
                                    )
                                  }
                                >
                                  ✕ Reject
                                </button>
                              </>
                            ) : (
                              <span
                                className={`bdg d-${price.status}`}
                              >
                                {price.status}
                              </span>
                            )}

                          </td>

                        </tr>
                      );

                    })}

                  </tbody>

                </table>

              </div>

            </div>

          </div>
        </div>
      </div>

      {showPSModal && (
        <PriceSourceModal
          onClose={closePSModal}
          onSave={handleSaveSource}
        />
      )}

      {/* ══ NEW: custom confirmation modal — replaces window.confirm for Approve All / Reject All ══ */}
      {confirmAction && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              width: "380px",
              maxWidth: "90vw",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              padding: "1.5rem",
            }}
          >
            <h3 style={{ margin: "0 0 .5rem", fontSize: "1.05rem" }}>
              {confirmAction === "approve" ? "Approve All Price Updates" : "Reject All Price Updates"}
            </h3>
            <p style={{ margin: "0 0 1.25rem", fontSize: ".85rem", color: "#555" }}>
              {confirmAction === "approve"
                ? `Approve all ${pendingCount} pending price update${pendingCount !== 1 ? "s" : ""}?`
                : `Reject all ${pendingCount} pending price update${pendingCount !== 1 ? "s" : ""}?`}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: ".6rem" }}>
              <button
                onClick={handleCancelConfirm}
                style={{
                  padding: ".5rem 1.1rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: "#f5f5f5",
                  cursor: "pointer",
                  fontSize: ".85rem",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: ".5rem 1.1rem",
                  borderRadius: "8px",
                  border: "none",
                  background: confirmAction === "approve" ? "#16a34a" : "#dc2626",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: ".85rem",
                }}
              >
                {confirmAction === "approve" ? "Approve All" : "Reject All"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          zIndex: 100,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: t.type === "error" ? "#dc2626" : "#111827",
              color: "#fff",
              padding: "0.65rem 1rem",
              borderRadius: "8px",
              fontSize: ".8rem",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            {t.type === "success" ? "✅" : t.type === "error" ? "⚠️" : "ℹ️"} {t.message}
          </div>
        ))}
      </div>

    </div>
  );
}

export default PriceMonitor;