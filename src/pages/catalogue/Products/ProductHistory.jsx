import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../component/SideBar/sidebar";

function ProductHistory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const products = JSON.parse(localStorage.getItem("sts_products") || "[]");
  const product = products.find((p) => String(p.id) === String(id));

  const historyStore = JSON.parse(localStorage.getItem("sts_product_history") || "{}");
  const history = historyStore[id] || [];

  const fPKR = (value) => `PKR ${Number(value || 0).toLocaleString("en-PK")}`;

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  // ══ NEW: profit amount = selling price − cost price ══
  const getProfit = (entry) => (Number(entry.salePrice) || 0) - (Number(entry.cost) || 0);

  if (!product) {
    return (
      <div id="app">
        <Sidebar />
        <div className="main">
          <div className="content">
            <div className="empty">
              <div className="eico">📦</div>
              <h3>Product not found</h3>
              <button className="btn bp bsm" onClick={() => navigate("/products")}>
                ← Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══ NEW: current profit for the Product Info card ══
  const currentProfit = (Number(product.salePrice) || 0) - (Number(product.cost) || 0);

  return (
    <div id="app">
      <Sidebar />

      <div className="main">
        <div className="topbar">
          <div>
            <div className="tbh1">{product.name}</div>
            <div className="tbsub">
              ID: {product.id} · Price & stock history
            </div>
          </div>

          <div className="tbr">
            <button className="btn bgh bsm" onClick={() => navigate("/products")}>
              ← Back to Products
            </button>
          </div>
        </div>

        <div className="content">
          <div className="card" style={{ marginBottom: "1rem" }}>
            <div className="chd">
              <h3>📦 Product Info</h3>
            </div>
            <div className="cbd" style={{ display: "flex", gap: "2rem", flexWrap: "wrap", padding: "1rem" }}>
              <div>
                <div style={{ fontSize: ".7rem", color: "var(--mu)" }}>Current Cost</div>
                <div style={{ fontWeight: 700 }}>{fPKR(product.cost)}</div>
              </div>
              <div>
                <div style={{ fontSize: ".7rem", color: "var(--mu)" }}>Current Sale Price</div>
                <div style={{ fontWeight: 700 }}>{fPKR(product.salePrice)}</div>
              </div>
              <div>
                <div style={{ fontSize: ".7rem", color: "var(--mu)" }}>Current Margin</div>
                <div style={{ fontWeight: 700 }}>{product.marginPercent || 0}%</div>
              </div>
              {/* ══ NEW: current profit ══ */}
              <div>
                <div style={{ fontSize: ".7rem", color: "var(--mu)" }}>Current Profit</div>
                <div style={{ fontWeight: 700, color: "#16a34a" }}>{fPKR(currentProfit)}</div>
              </div>
              <div>
                <div style={{ fontSize: ".7rem", color: "var(--mu)" }}>Current Stock</div>
                <div style={{ fontWeight: 700 }}>{product.stock || 0}</div>
              </div>
              {/* ══ NEW: current rating ══ */}
              <div>
                <div style={{ fontSize: ".7rem", color: "var(--mu)" }}>Current Rating</div>
                <div style={{ fontWeight: 700 }}>
                  {product.rating ? `⭐ ${product.rating}` : "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="chd">
              <h3>📋 History</h3>
              <span className="bdg d-review">{history.length} entries</span>
            </div>

            <div className="tw">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Cost Price</th>
                    <th>Selling Price</th>
                    <th>Margin %</th>
                    {/* ══ NEW ══ */}
                    <th>Profit</th>
                    <th>Stock</th>
                    {/* ══ NEW ══ */}
                    <th>Rating</th>
                    <th>Note</th>
                  </tr>
                </thead>

                <tbody>
                  {history.length > 0 ? (
                    history.map((entry) => (
                      <tr key={entry.id}>
                        <td style={{ fontSize: ".75rem", color: "var(--mu)" }}>
                          {formatDate(entry.date)}
                        </td>
                        <td className="mn">{fPKR(entry.cost)}</td>
                        <td className="mn">{fPKR(entry.salePrice)}</td>
                        <td>{entry.marginPercent}%</td>
                        {/* ══ NEW ══ */}
                        <td className="mn" style={{ color: "#16a34a", fontWeight: 600 }}>
                          {fPKR(getProfit(entry))}
                        </td>
                        <td>{entry.stock}</td>
                        {/* ══ NEW ══ */}
                        <td>{entry.rating ? `⭐ ${entry.rating}` : "—"}</td>
                        <td style={{ fontSize: ".75rem", color: "var(--mu)" }}>{entry.note}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">
                        <div className="empty">
                          <div className="eico">📋</div>
                          <h3>No history yet</h3>
                          <p>Edit this product to start tracking its history.</p>
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
  );
}

export default ProductHistory;