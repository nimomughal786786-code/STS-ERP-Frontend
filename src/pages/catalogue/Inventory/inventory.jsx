import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../component/SideBar/sidebar";
import StockModal from "../../../models/stockmodel";

const PRODUCTS_KEY = "sts_products";
const LOG_KEY = "sts_inventory_log";

function Inventory({
  products = [],
  onProductsChange,
  notifications = [],
  readNotifications = [],
  addNotification,
  markAllNotificationsRead,
}) {
  const navigate = useNavigate();



  const [invLog, setInvLog] = useState(() => {
    const saved = localStorage.getItem(LOG_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [stockType, setStockType] = useState("add");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  // ══ CHANGED: local notification dropdown state replaced with central pattern ══
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPOToast, setShowPOToast] = useState(false);
  const [showStockToast, setShowStockToast] = useState(false);

  // ══ NEW: close notification dropdown on outside click (same as Orders) ══
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
  const syncFromStorage = () => {
    const savedLog = localStorage.getItem(LOG_KEY);
    setInvLog(savedLog ? JSON.parse(savedLog) : []);
  };

  syncFromStorage();
  window.addEventListener("storage", syncFromStorage);
  window.addEventListener("focus", syncFromStorage);

  return () => {
    window.removeEventListener("storage", syncFromStorage);
    window.removeEventListener("focus", syncFromStorage);
  };
}, []);

 const saveInventoryData = (updatedProducts, updatedLog) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
  localStorage.setItem(LOG_KEY, JSON.stringify(updatedLog));

  onProductsChange?.(updatedProducts);
  setInvLog(updatedLog);
};

  const formatPKR = (value) => {
    return `PKR ${(parseFloat(value) || 0).toLocaleString("en-PK", {
      minimumFractionDigits: 0,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const today = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const Badge = ({ value, className = "" }) => {
    return <span className={`bdg d-${value} ${className}`}>{value}</span>;
  };

  const totalInventoryValue = useMemo(() => {
    return products.reduce(
      (total, product) => total + (Number(product.cost) || 0) * (Number(product.stock) || 0),
      0
    );
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter(
      (product) => (Number(product.stock) || 0) <= (Number(product.minStock) || 2) && (Number(product.stock) || 0) > 0
    ).length;
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((product) => (Number(product.stock) || 0) === 0).length;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchValue = search.toLowerCase();

    return products.filter((product) => {
      const matchesSearch = !searchValue || (product.name || "").toLowerCase().includes(searchValue);
      const matchesCategory = !category || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const openStockModal = (productId = "") => {
    setSelectedProductId(productId || products[0]?.id || "");
    setStockType("add");
    setQuantity("");
    setReason("");
    setShowStockModal(true);
  };

  const closeStockModal = () => {
    setShowStockModal(false);
    setQuantity("");
    setReason("");
  };

  const saveStock = () => {
    const qty = parseInt(quantity, 10) || 0;

    if (!selectedProductId) {
      alert("Please select a product.");
      return;
    }

    if (qty === 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    const product = products.find((item) => item.id === selectedProductId);

    if (!product) {
      alert("Product not found.");
      return;
    }

    const oldStock = Number(product.stock) || 0;
    let newStock = oldStock;

    if (stockType === "add") {
      newStock = oldStock + qty;
    } else if (stockType === "remove") {
      newStock = Math.max(0, oldStock - qty);
    } else if (stockType === "set") {
      newStock = qty;
    }

    const updatedProducts = products.map((item) =>
      item.id === selectedProductId ? { ...item, stock: newStock } : item
    );

    const newMovement = {
      date: today(),
      productId: selectedProductId,
      pName: product.name,
      type: stockType,
      qty,
      before: oldStock,
      after: newStock,
      reason: reason.trim() || "Stock adjustment",
      by: "Admin",
    };

    const updatedLog = [...invLog, newMovement];

    saveInventoryData(updatedProducts, updatedLog);

    closeStockModal();

    setShowStockToast(true);
    window.setTimeout(() => setShowStockToast(false), 2500);

    // ══ NEW: central notification on stock adjustment ══
    addNotification?.({
      type: "stock_updated",
      title: "Stock Updated",
      message: `${product.name} stock changed from ${oldStock} to ${newStock}.`,
      action: () => navigate("/inventory"),
    });

    // ══ NEW: low-stock notification if this adjustment crosses the threshold ══
    const minStock = Number(product.minStock) || 2;
    if (newStock <= minStock) {
      addNotification?.({
        type: "low_stock",
        title: "Low Stock Alert",
        message: `${product.name} is at or below its minimum stock level.`,
        action: () => navigate("/inventory"),
      });
    }
  };

  const createPO = () => {
    setShowPOToast(true);
    window.setTimeout(() => setShowPOToast(false), 3000);
  };

  const getStockStatus = (product) => {
    const stock = Number(product.stock) || 0;
    const minStock = Number(product.minStock) || 2;

    if (stock === 0) return "out-stock";
    if (stock <= minStock) return "low-stock";
    return "in-stock";
  };

  const getStockPercentage = (product) => {
    const stock = Number(product.stock) || 0;
    const minStock = Number(product.minStock) || 2;

    return Math.min(100, (stock / Math.max(stock, minStock, 5)) * 100);
  };

  const selectedProduct = products.find((product) => product.id === selectedProductId);

  const movementLog = useMemo(() => {
    const validLog = invLog.filter((movement) => {
      const product = products.find((p) => String(p.id) === String(movement.productId));

      if (!product) return false;
      if (category && product.category !== category) return false;

      return true;
    });

    return [...validLog].slice(-20).reverse();
  }, [invLog, products, category]);

  // ══ NEW: unread count driven by the CENTRAL notifications list ══
  const unreadNotifications = notifications.filter(
    (notification) => !readNotifications.includes(notification.id)
  );

  return (
    <div id="app">
      <Sidebar />

      <div className="main">
        <div className="topbar">
          <div>
            <div className="tbh1">Inventory</div>
            <div className="tbsub">Stock levels, movements & purchase orders</div>
          </div>

          <div className="tbr">
            <input
              className="tsrch"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="tibtn" title="Price updates" onClick={() => navigate("/pricemonitor")}>
              <span>💱</span>
            </button>

            <button className="tibtn" title="New orders" onClick={() => navigate("/orders")}>
              <span>📦</span>
              <span className="ndot show"></span>
            </button>

            {/* ══ CHANGED: bell icon now uses central notifications, same pattern as Orders ══ */}
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

            {/* ══ NEW: central notification dropdown, same structure as Orders ══ */}
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
          </div>
        </div>

        {showPOToast && (
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              background: "#1a1f2e",
              color: "#fff",
              borderRadius: "10px",
              padding: ".7rem 1rem",
              fontSize: ".8rem",
              boxShadow: "0 8px 24px rgba(0,0,0,.3)",
              zIndex: 999,
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            ℹ️ Purchase Order feature — attach to supplier module
          </div>
        )}

        {showStockToast && (
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              background: "#1a1f2e",
              color: "#fff",
              borderRadius: "10px",
              padding: ".7rem 1rem",
              fontSize: ".8rem",
              boxShadow: "0 8px 24px rgba(0,0,0,.3)",
              zIndex: 999,
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            ✅ Stock updated!
          </div>
        )}

        <div className="content">
          <div className="view active" id="v-inventory">
            <div className="kg" id="IVK">
              <div className="kpi" style={{ cursor: "default" }}>
                <div className="kico ib">📦</div>
                <div>
                  <div className="kval">{products.length}</div>
                  <div className="klbl">Total Stock</div>
                </div>
              </div>

              <div className="kpi" style={{ cursor: "default" }}>
                <div className="kico ir">⚠️</div>
                <div>
                  <div className="kval">{lowStockCount}</div>
                  <div className="klbl">Low Stock</div>
                </div>
              </div>

              <div className="kpi" style={{ cursor: "default" }}>
                <div className="kico ir">🚫</div>
                <div>
                  <div className="kval">{outOfStockCount}</div>
                  <div className="klbl">Out of Stock</div>
                </div>
              </div>

              <div className="kpi" style={{ cursor: "default" }}>
                <div className="kico ig">💰</div>
                <div>
                  <div className="kval">{formatPKR(totalInventoryValue)}</div>
                  <div className="klbl">Inventory Value</div>
                </div>
              </div>
            </div>

            <div className="fr">
              <input
                className="sb"
                placeholder="Search inventory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select className="fsl" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="solar">☀️ Solar Inverters</option>
                <option value="battery">🔋 Batteries</option>
                <option value="panels">🌞 Solar Panels</option>
                <option value="accessories">🔌 Accessories</option>
                <option value="cctv">📷 CCTV</option>
                <option value="it">🖥️ IT Hardware</option>
              </select>

              <button className="btn bp" onClick={() => openStockModal()}>
                ± Adjust Stock
              </button>

              <button className="btn bou bsm" onClick={createPO}>
                📄 Purchase Order
              </button>
            </div>

            <div className="card">
              <div className="tw">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Min</th>
                      <th>Value</th>
                      <th>Status</th>
                      <th>Level</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody id="IVB">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => {
                        const status = getStockStatus(product);
                        const percentage = getStockPercentage(product);

                        return (
                          <tr key={product.id}>
                            <td>
                              <strong>
                                {product.emoji} {product.name}
                              </strong>
                            </td>

                            <td style={{ fontSize: ".7rem" }}>{product.sku || "—"}</td>

                            <td>
                              <Badge value={product.category || "unknown"} />
                            </td>

                            <td className="mn">
                              {product.stock || 0} {product.unit || "pcs"}
                            </td>

                            <td>{product.minStock || 2}</td>

                            <td className="mn">
                              {formatPKR((Number(product.cost) || 0) * (Number(product.stock) || 0))}
                            </td>

                            <td>
                              <Badge value={status} />
                            </td>

                            <td style={{ width: "110px" }}>
                              <div className="prog">
                                <div
                                  className={`progf ${
                                    status === "out-stock" ? "low" : status === "low-stock" ? "mid" : ""
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </td>

                            <td>
                              <button className="btn bgh bxs" onClick={() => openStockModal(product.id)}>
                                ± Adjust
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="9" style={{ textAlign: "center", color: "var(--mu)", padding: "1.5rem" }}>
                          No inventory products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card mt2">
              <div className="chd">
                <h3>📋 Stock Movement Log</h3>
              </div>

              <div className="tw">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Product</th>
                      <th>Type</th>
                      <th>Qty</th>
                      <th>Balance</th>
                      <th>Reason</th>
                      <th>By</th>
                    </tr>
                  </thead>

                  <tbody id="SLB">
                    {movementLog.length > 0 ? (
                      movementLog.map((movement, index) => (
                        <tr key={`${movement.date}-${movement.productId}-${index}`}>
                          <td>{formatDate(movement.date)}</td>
                          <td>{movement.pName}</td>

                          <td>
                            <span className={`bdg ${movement.type === "add" ? "d-active" : "d-declined"}`}>
                              {movement.type}
                            </span>
                          </td>

                          <td>
                            {movement.type === "add" ? "+" : "-"}
                            {movement.qty}
                          </td>

                          <td className="mn">{movement.after}</td>
                          <td>{movement.reason}</td>
                          <td>{movement.by || "Admin"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center", color: "var(--mu)", padding: "1.5rem" }}>
                          No stock movements yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {showStockModal && (
              <StockModal
                products={products}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
                stockType={stockType}
                setStockType={setStockType}
                quantity={quantity}
                setQuantity={setQuantity}
                reason={reason}
                setReason={setReason}
                selectedProduct={selectedProduct}
                onClose={closeStockModal}
                onSave={saveStock}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;