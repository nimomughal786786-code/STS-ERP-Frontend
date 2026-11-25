import { useState } from "react";

function ProductModal({ formData, onChange, onImageUpload, onClose, onSave, editingProduct }) {
  // ══ NEW: ID field starts locked (read-only) — owner must click the edit icon to unlock it ══
  const [idUnlocked, setIdUnlocked] = useState(false);

  return (
    <div className="mbg open" id="MProd">
      <div className="modal mxl">
        <div className="mhd">
          <div>
            <h2 id="MPT">{editingProduct ? "Edit Product" : "Add Product"}</h2>
            <p>Complete product information, images and pricing</p>
          </div>

          <button className="mcl" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mbd">
          <div className="fg3" style={{ marginBottom: ".85rem" }}>

            {/* ══ NEW: Product ID field — only shown when editing an existing product ══ */}
            {editingProduct && (
              <div className="fg">
                <label>Product ID</label>
                <div style={{ display: "flex", gap: ".4rem" }}>
                  <input
                    name="id"
                    value={formData.id}
                    onChange={onChange}
                    readOnly={!idUnlocked}
                    style={{
                      background: idUnlocked ? "#fff" : "var(--bg)",
                      flex: 1,
                    }}
                  />
                  <button
                    type="button"
                    className="btn bgh bxs"
                    title={idUnlocked ? "Lock ID" : "Edit ID"}
                    onClick={() => setIdUnlocked((prev) => !prev)}
                  >
                    {idUnlocked ? "🔒" : "✏️"}
                  </button>
                </div>
              </div>
            )}

            <div className="fg">
              <label>Product Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Product name"
              />
            </div>

            <div className="fg">
              <label>Brand</label>
              <input
                name="brand"
                value={formData.brand}
                onChange={onChange}
                placeholder="Brand name"
              />
            </div>

            <div className="fg">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={onChange}>
                <option value="solar">☀️ Solar Inverter</option>
                <option value="battery">🔋 Battery</option>
                <option value="panels">🌞 Solar Panels</option>
                <option value="accessories">🔌 Accessories</option>
                <option value="cctv">📷 CCTV</option>
                <option value="it">🖥️ IT Hardware</option>
              </select>
            </div>

            <div className="fg">
              <label>Sub-Category</label>
              <input
                name="subCategory"
                value={formData.subCategory}
                onChange={onChange}
                placeholder="e.g. Hybrid Inverter"
              />
            </div>

            <div className="fg">
              <label>SKU</label>
              <input
                name="sku"
                value={formData.sku}
                onChange={onChange}
                placeholder="Auto-generated"
              />
            </div>

            <div className="fg">
              <label>Unit</label>
              <input
                name="unit"
                value={formData.unit}
                onChange={onChange}
                placeholder="pcs, WATT, panel..."
              />
            </div>

            <div className="fg">
              <label>Cost Price (PKR)</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={onChange}
                placeholder="0"
              />
            </div>

            <div className="fg">
              <label>Margin %</label>
              <input
                type="number"
                name="marginPercent"
                value={formData.marginPercent}
                onChange={onChange}
                placeholder="25"
              />
            </div>

            <div className="fg">
              <label>Sale Price (PKR) *</label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={onChange}
                placeholder="0"
              />
            </div>

            <div className="fg">
              <label>Price Note</label>
              <input
                name="priceNote"
                value={formData.priceNote}
                onChange={onChange}
                placeholder="per unit, per panel..."
              />
            </div>

            <div className="fg">
              <label>Initial Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={onChange}
                placeholder="0"
              />
            </div>

            <div className="fg">
              <label>Min Stock Alert</label>
              <input
                type="number"
                name="minStock"
                value={formData.minStock}
                onChange={onChange}
                placeholder="2"
              />
            </div>

            <div className="fg">
              <label>Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={onChange}
                min="0"
                max="5"
                step="0.1"
                placeholder="0 - 5"
              />
            </div>

            <div className="fg">
              <label>Emoji</label>
              <input
                name="emoji"
                value={formData.emoji}
                onChange={onChange}
                placeholder="⚡"
                maxLength="4"
              />
            </div>

            <div className="fg full">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                rows="3"
                placeholder="Detailed product description..."
              />
            </div>

            <div className="fg full">
              <label>Specs / Tags (comma-separated)</label>
              <input
                name="specs"
                value={formData.specs}
                onChange={onChange}
                placeholder="6kW, Hybrid, IP65, MPPT, WiFi"
              />
            </div>

            <div className="fg full">
              <label>Supplier Product URL (for price monitoring)</label>
              <input
                name="supplierUrl"
                value={formData.supplierUrl}
                onChange={onChange}
                placeholder="https://alladin.pk/products/..."
              />
            </div>

            <div className="fg full">
              <label>Product Image</label>

              <label className="iud" htmlFor="pmIF" style={{ cursor: "pointer", display: "block" }}>
                <input
                  type="file"
                  id="pmIF"
                  accept="image/*"
                  onChange={onImageUpload}
                  style={{ display: "none" }}
                />

                <div style={{ fontSize: "1.7rem", opacity: ".3" }}>📷</div>

                <p>Click to upload (JPG, PNG, WebP — max 3MB)</p>

                {formData.image && (
                  <img
                    src={formData.image}
                    alt=""
                    style={{
                      maxHeight: "90px",
                      maxWidth: "100%",
                      objectFit: "contain",
                      borderRadius: "7px",
                      marginTop: ".6rem",
                    }}
                  />
                )}
              </label>

              <input
                name="image"
                value={formData.image}
                onChange={onChange}
                placeholder="Or paste image URL..."
                style={{
                  marginTop: ".4rem",
                  width: "100%",
                  background: "var(--bg)",
                  border: "1.5px solid var(--br)",
                  borderRadius: "8px",
                  padding: ".48rem .78rem",
                  fontSize: ".78rem",
                  outline: "none",
                }}
              />
            </div>

            <div className="fg">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={onChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="fg">
              <label>Featured on Website</label>
              <select name="featured" value={formData.featured} onChange={onChange}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="fg">
              <label>Warranty</label>
              <input
                name="warranty"
                value={formData.warranty}
                onChange={onChange}
                placeholder="1 year, 5 years..."
              />
            </div>
          </div>
        </div>

        <div className="mft">
          <button className="btn bgh" onClick={onClose}>
            Cancel
          </button>

          <button className="btn bp" onClick={onSave}>
            💾 {editingProduct ? "Update Product" : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;