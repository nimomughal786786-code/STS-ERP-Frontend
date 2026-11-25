import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../component/SideBar/sidebar";
import Productmodel from "../../../models/productmodel";

function Products({
  notifications = [],
  readNotifications = [],
  addNotification,
  markAllNotificationsRead,
}) {
  const navigate = useNavigate();

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("sts_products");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("sts_products", JSON.stringify(products));
  }, [products]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [selectedProducts, setSelectedProducts] = useState([]);

  // ══ CHANGED: local notification dropdown state replaced with central pattern ══
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

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

  const emptyForm = {
    name: "",
    brand: "",
    category: "solar",
    subCategory: "",
    sku: "",
    unit: "",
    cost: "",
    salePrice: "",
    marginPercent: "25",
    priceNote: "",
    stock: "",
    minStock: "2",
    rating: "",
    emoji: "",
    description: "",
    specs: "",
    supplierUrl: "",
    image: "",
    status: "active",
    featured: "no",
    warranty: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const categoryLabels = {
    solar: "☀️ Solar Inverters",
    battery: "🔋 Batteries",
    panels: "🌞 Solar Panels",
    accessories: "🔌 Accessories",
    cctv: "📷 CCTV",
    it: "🖥️ IT Hardware",
  };

  const categoryIdBase = {
    solar: 35110,
    cctv: 45110,
    it: 55110,
    battery: 65110,
    panels: 75110,
    accessories: 85110,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "cost") {
        const cost = parseFloat(value) || 0;
        const margin = parseFloat(prev.marginPercent) || 0;
        const newSalePrice = cost + (cost * margin) / 100;
        updated.salePrice = cost ? newSalePrice.toFixed(2) : prev.salePrice;
      }

      if (name === "marginPercent") {
        const cost = parseFloat(prev.cost) || 0;
        const margin = parseFloat(value) || 0;
        const newSalePrice = cost + (cost * margin) / 100;
        updated.salePrice = cost ? newSalePrice.toFixed(2) : prev.salePrice;
      }

      if (name === "salePrice") {
        const cost = parseFloat(prev.cost) || 0;
        const salePrice = parseFloat(value) || 0;
        if (cost > 0) {
          const margin = ((salePrice - cost) / cost) * 100;
          updated.marginPercent = margin.toFixed(2);
        }
      }

      return updated;
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Image must be under 3MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const generateSKU = (name, category) => {
    const prefix = (category || "PR").slice(0, 3).toUpperCase();
    const namePart = (name || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
    return `${prefix}-${namePart}-${Date.now().toString().slice(-4)}`;
  };

  const getNextProductId = (selectedCategory) => {
    const categoryProducts = products.filter((p) => p.category === selectedCategory);

    if (categoryProducts.length === 0) {
      return categoryIdBase[selectedCategory] || 90000;
    }

    const maxId = Math.max(...categoryProducts.map((p) => Number(p.id) || 0));
    return maxId + 1;
  };

  const getHistoryStore = () => {
    const saved = localStorage.getItem("sts_product_history");
    return saved ? JSON.parse(saved) : {};
  };

  const addHistoryEntry = (productId, entry) => {
    const store = getHistoryStore();
    const existing = store[productId] || [];
    store[productId] = [{ ...entry, id: "H-" + Date.now() }, ...existing];
    localStorage.setItem("sts_product_history", JSON.stringify(store));
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setFormData({ ...emptyForm, ...product });
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = () => {
    if (!formData.name.trim()) {
      alert("Please enter Product Name");
      return;
    }

    if (!formData.category) {
      alert("Please select a Category");
      return;
    }

    if (!formData.salePrice) {
      alert("Please enter Sale Price");
      return;
    }

    const sku = formData.sku.trim() || generateSKU(formData.name, formData.category);

    if (editingProduct) {
      const newId = formData.id;
      const idTaken = products.some(
        (p) => String(p.id) === String(newId) && p.id !== editingProduct.id
      );

      if (idTaken) {
        alert("This Product ID is already in use by another product. Please choose a different ID.");
        return;
      }

      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id
            ? { ...formData, sku, id: newId }
            : product
        )
      );

      addHistoryEntry(newId, {
        date: new Date().toISOString(),
        cost: Number(formData.cost) || 0,
        salePrice: Number(formData.salePrice) || 0,
        marginPercent: Number(formData.marginPercent) || 0,
        stock: Number(formData.stock) || 0,
        rating: Number(formData.rating) || 0,
        note: newId !== editingProduct.id ? `Product updated (ID changed from ${editingProduct.id})` : "Product updated",
      });

      // ══ NEW: central notification on update ══
      addNotification?.({
        type: "product_updated",
        title: "Product Updated",
        message: `${formData.name} was updated.`,
        action: () => navigate(`/products/${newId}/history`),
      });

      // ══ NEW: low-stock notification if this update crosses the alert threshold ══
      if (Number(formData.stock) <= Number(formData.minStock)) {
        addNotification?.({
          type: "low_stock",
          title: "Low Stock Alert",
          message: `${formData.name} is at or below its minimum stock level.`,
          action: () => navigate("/inventory"),
        });
      }
    } else {
      const newId = getNextProductId(formData.category);

      const newProduct = {
        ...formData,
        sku,
        id: newId,
      };
      setProducts((prev) => [newProduct, ...prev]);

      addHistoryEntry(newId, {
        date: new Date().toISOString(),
        cost: Number(formData.cost) || 0,
        salePrice: Number(formData.salePrice) || 0,
        marginPercent: Number(formData.marginPercent) || 0,
        stock: Number(formData.stock) || 0,
        rating: Number(formData.rating) || 0,
        note: "Product added",
      });

      // ══ NEW: central notification on add ══
      addNotification?.({
        type: "product_added",
        title: "New Product Added",
        message: `${formData.name} (ID: ${newId}) has been added to the catalogue.`,
        action: () => navigate(`/products/${newId}/history`),
      });
    }

    closeProductModal();
  };

  const requestDeleteProduct = (product) => {
    setDeleteTarget(product);
  };

  const confirmDeleteProduct = () => {
    if (!deleteTarget) return;

    setProducts((prev) => prev.filter((product) => product.id !== deleteTarget.id));
    setSelectedProducts((prev) => prev.filter((productId) => productId !== deleteTarget.id));

    // ══ NEW: central notification on delete ══
    addNotification?.({
      type: "product_deleted",
      title: "Product Deleted",
      message: `${deleteTarget.name} was removed from the catalogue.`,
      action: () => navigate("/products"),
    });

    setDeleteTarget(null);
  };

  const cancelDeleteProduct = () => {
    setDeleteTarget(null);
  };

  const filteredProducts = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        !searchText ||
        `${product.name} ${product.brand} ${product.category} ${product.id}`
          .toLowerCase()
          .includes(searchText);

      const matchesCategory = !category || product.category === category;
      const matchesStatus = !status || product.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const exportCSV = () => {
    if (products.length === 0) {
      alert("No products available to export.");
      return;
    }

    setShowExportToast(true);
    window.setTimeout(() => setShowExportToast(false), 2500);

    const headers = ["ID", "Name", "Brand", "Category", "Cost", "Sale Price", "Stock", "Rating", "Status"];

    const rows = products.map((product) => [
      product.id,
      product.name,
      product.brand,
      categoryLabels[product.category] || product.category,
      product.cost,
      product.salePrice,
      product.stock,
      product.rating,
      product.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fPKR = (value) => `PKR ${Number(value || 0).toLocaleString("en-PK")}`;

  const totalProducts = products.length;
  const solarProducts = products.filter((p) => p.category === "solar").length;
  const cctvProducts = products.filter((p) => p.category === "cctv").length;
  const itProducts = products.filter((p) => p.category === "it").length;

  const batteryProducts = products.filter((p) => p.category === "battery").length;
  const panelsProducts = products.filter((p) => p.category === "panels").length;
  const accessoriesProducts = products.filter((p) => p.category === "accessories").length;

  const lowStockProducts = useMemo(
    () => products.filter((p) => Number(p.stock) <= Number(p.minStock)),
    [products]
  );

  // ══ NEW: unread count driven by the CENTRAL notifications list (shared across all pages) ══
  const unreadNotifications = notifications.filter(
    (notification) => !readNotifications.includes(notification.id)
  );

  return (
    <div id="app">
      <Sidebar />

      <div className="main">
        <div className="topbar">
          <div>
            <div className="tbh1">Products</div>
            <div className="tbsub">Catalogue, pricing & images</div>
          </div>

          <div className="tbr">
            <input
              className="tsrch"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              className="tibtn"
              title="Price updates"
              onClick={() => navigate("/pricemonitor")}
            >
              <span>💱</span>
            </button>

            <button
              className="tibtn"
              title="New orders"
              onClick={() => navigate("/orders")}
            >
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

            <button className="btn bp bsm" onClick={openAddProductModal}>
              + Add Product
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

        {lowStockProducts.length > 0 && (
          <div
            style={{
              background: "#fef3c7",
              border: "1px solid #f59e0b",
              color: "#92400e",
              padding: ".75rem 1.25rem",
              margin: "1rem 1.5rem 0",
              borderRadius: "8px",
              fontSize: ".82rem",
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            ⚠️ <strong>Low stock alert:</strong>{" "}
            {lowStockProducts.map((p) => p.name).join(", ")} — stock at or below minimum alert level.
          </div>
        )}

        {showExportToast && (
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
            ℹ️ Exporting products to CSV...
          </div>
        )}

        <div className="content">
          <div className="view active" id="v-products">
            <div className="fr">
              <input
                className="sb"
                placeholder="Search products or ID..."
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

              <select className="fsl" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button className="btn bp" onClick={openAddProductModal}>
                + Add Product
              </button>

              <button className="btn bgh bsm" onClick={exportCSV}>
                ⬇ Export
              </button>
            </div>

            <div className="kg" style={{ marginBottom: ".85rem" }}>
              <div className="kpi">
                <div className="kico ib">📦</div>
                <div>
                  <div className="kval">{totalProducts}</div>
                  <div className="klbl">Total Products</div>
                </div>
              </div>

              <div className="kpi">
                <div className="kico ig">☀️</div>
                <div>
                  <div className="kval">{solarProducts}</div>
                  <div className="klbl">Solar Products</div>
                </div>
              </div>

              <div className="kpi">
                <div className="kico io">📷</div>
                <div>
                  <div className="kval">{cctvProducts}</div>
                  <div className="klbl">CCTV Products</div>
                </div>
              </div>

              <div className="kpi">
                <div className="kico ip">🖥️</div>
                <div>
                  <div className="kval">{itProducts}</div>
                  <div className="klbl">IT Products</div>
                </div>
              </div>

              <div className="kpi">
                <div className="kico ig">🔋</div>
                <div>
                  <div className="kval">{batteryProducts}</div>
                  <div className="klbl">Battery Products</div>
                </div>
              </div>

              <div className="kpi">
                <div className="kico ig">🌞</div>
                <div>
                  <div className="kval">{panelsProducts}</div>
                  <div className="klbl">Solar Panel Products</div>
                </div>
              </div>

              <div className="kpi">
                <div className="kico io">🔌</div>
                <div>
                  <div className="kval">{accessoriesProducts}</div>
                  <div className="klbl">Accessory Products</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="chd">
                <h3>All Products</h3>
                <div className="fb">
                  <span style={{ fontSize: ".73rem", color: "var(--mu)" }}>
                    {selectedProducts.length > 0
                      ? `${selectedProducts.length} selected`
                      : `${filteredProducts.length} products`}
                  </span>
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
                          checked={
                            filteredProducts.length > 0 &&
                            filteredProducts.every((product) => selectedProducts.includes(product.id))
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Category</th>
                      <th>Cost</th>
                      <th>Sale Price</th>
                      <th>Stock</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          onClick={() => navigate(`/products/${product.id}/history`)}
                          style={{ cursor: "pointer" }}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="tck"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => handleSelectProduct(product.id)}
                            />
                          </td>

                          <td style={{ fontSize: ".75rem", color: "var(--mu)" }}>
                            {product.id}
                          </td>

                          <td>
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                  width: "42px",
                                  height: "42px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "42px",
                                  height: "42px",
                                  borderRadius: "6px",
                                  background: "var(--bg)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "1.1rem",
                                }}
                              >
                                {product.emoji || "📦"}
                              </div>
                            )}
                          </td>

                          <td>
                            <strong>{product.name}</strong>
                            {product.sku && (
                              <div style={{ fontSize: ".7rem", color: "var(--mu)", marginTop: "2px" }}>
                                {product.sku}
                              </div>
                            )}
                          </td>

                          <td>{product.brand || "—"}</td>

                          <td>
                            <span className="bdg d-new">
                              {categoryLabels[product.category] || product.category}
                            </span>
                          </td>

                          <td className="mn">{fPKR(product.cost)}</td>
                          <td className="mn">{fPKR(product.salePrice)}</td>
                          <td>{product.stock || 0}</td>
                          <td>{product.rating ? `⭐ ${product.rating}` : "—"}</td>

                          <td>
                            <span className={`bdg ${product.status === "active" ? "d-active" : "d-inactive"}`}>
                              {product.status}
                            </span>
                          </td>

                          <td onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: "flex", gap: ".28rem" }}>
                              <button className="btn bgh bxs" onClick={() => openEditProductModal(product)}>
                                ✏️
                              </button>
                              <button className="btn br2 bxs" onClick={() => requestDeleteProduct(product)}>
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12">
                          <div className="empty">
                            <div className="eico">📦</div>
                            <h3>No products found</h3>
                            <p>Add a product to start your catalogue.</p>
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
      </div>

      {showProductModal && (
        <Productmodel
          formData={formData}
          onChange={handleChange}
          onImageUpload={handleImageUpload}
          onClose={closeProductModal}
          onSave={handleSaveProduct}
          editingProduct={editingProduct}
        />
      )}

      {deleteTarget && (
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
            <h3 style={{ margin: "0 0 .5rem", fontSize: "1.05rem" }}>Delete Product</h3>
            <p style={{ margin: "0 0 1.25rem", fontSize: ".85rem", color: "#555" }}>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action
              cannot be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: ".6rem" }}>
              <button
                className="btn bgh"
                onClick={cancelDeleteProduct}
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
                onClick={confirmDeleteProduct}
                style={{
                  padding: ".5rem 1.1rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: ".85rem",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;