function StockModal({
  products,
  selectedProductId,
  setSelectedProductId,
  stockType,
  setStockType,
  quantity,
  setQuantity,
  reason,
  setReason,
  selectedProduct,
  onClose,
  onSave,
}) {
  return (
    <div
      className="mbg open"
      id="MStock"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal msm">
        <div className="mhd">
          <div>
            <h2>Adjust Stock</h2>
            <p style={{ fontSize: ".7rem", color: "var(--mu)", marginTop: ".15rem" }}>
              Add, remove or set product stock
            </p>
          </div>

          <button className="mcl" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cbd">
          <div className="fg">
            <label>Product</label>
            <select
              className="fsl"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              style={{ width: "100%" }}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div
              style={{
                background: "var(--bg)",
                padding: ".7rem",
                borderRadius: "8px",
                marginTop: ".7rem",
                marginBottom: ".7rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: ".75rem", color: "var(--mu)" }}>Current Stock</span>
              <strong className="mn">
                {selectedProduct.stock || 0} {selectedProduct.unit || "pcs"}
              </strong>
            </div>
          )}

          <div className="fg">
            <label>Adjustment Type</label>
            <select
              className="fsl"
              value={stockType}
              onChange={(e) => setStockType(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="add">Add Stock</option>
              <option value="remove">Remove Stock</option>
              <option value="set">Set Stock</option>
            </select>
          </div>

          {/* FIX 2: removed min="0" so negative quantities (-1, -2 ...) can be entered */}
          <div className="fg" style={{ marginTop: ".7rem" }}>
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
          </div>

          <div className="fg" style={{ marginTop: ".7rem" }}>
            <label>Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. New purchase, damaged, sold..."
            />
          </div>
        </div>

        <div className="mft" style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem" }}>
          <button className="btn bgh" onClick={onClose}>
            Cancel
          </button>

          <button className="btn bp" onClick={onSave}>
            💾 Update Stock
          </button>
        </div>
      </div>
    </div>
  );
}

export default StockModal;