import { useState } from "react";

function PriceSourceModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("scrape");
  const [category, setCategory] = useState("all");

  const handleAddSource = () => {
    onSave({ name, url, type, category });
  };

  return (
    <div
      className="mbg"
      id="MPS"
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
        className="modal msm"
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "460px",
          maxWidth: "90vw",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="mhd"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #eee",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "1.15rem" }}>Add Price Source</h2>
            <p style={{ margin: "0.25rem 0 0", fontSize: ".82rem", color: "#666" }}>
              Configure a supplier for automated price monitoring
            </p>
          </div>

          <button
            className="mcl"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.1rem",
              cursor: "pointer",
              color: "#666",
            }}
          >
            ✕
          </button>
        </div>

        <div className="mbd" style={{ padding: "1.25rem 1.5rem" }}>
          <div className="fg1" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="fg">
              <label style={{ display: "block", fontSize: ".82rem", fontWeight: 600, marginBottom: ".3rem" }}>
                Source Name *
              </label>
              <input
                id="psNM"
                placeholder="e.g. Alladin.pk"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: ".55rem .7rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: ".85rem",
                }}
              />
            </div>

            <div className="fg">
              <label style={{ display: "block", fontSize: ".82rem", fontWeight: 600, marginBottom: ".3rem" }}>
                URL *
              </label>
              <input
                id="psURL"
                placeholder="https://alladin.pk/collections/solar-inverters"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{
                  width: "100%",
                  padding: ".55rem .7rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: ".85rem",
                }}
              />
            </div>

            <div className="fg">
              <label style={{ display: "block", fontSize: ".82rem", fontWeight: 600, marginBottom: ".3rem" }}>
                Type
              </label>
              <select
                id="psTY"
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{
                  width: "100%",
                  padding: ".55rem .7rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: ".85rem",
                }}
              >
                <option value="scrape">Web Scraping</option>
                <option value="api">REST API</option>
                <option value="email">Email Price List</option>
                <option value="manual">Manual Upload</option>
              </select>
            </div>

            <div className="fg">
              <label style={{ display: "block", fontSize: ".82rem", fontWeight: 600, marginBottom: ".3rem" }}>
                Category
              </label>
              <select
                id="psCT"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: ".55rem .7rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: ".85rem",
                }}
              >
                <option value="all">All</option>
                <option value="solar">Solar</option>
                <option value="battery">Battery</option>
                <option value="cctv">CCTV</option>
                <option value="it">IT</option>
              </select>
            </div>
          </div>
        </div>

        <div
          className="mft"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.6rem",
            padding: "1rem 1.5rem",
            borderTop: "1px solid #eee",
          }}
        >
          <button
            className="btn bgh"
            onClick={onClose}
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
            className="btn bp"
            onClick={handleAddSource}
            style={{
              padding: ".5rem 1.1rem",
              borderRadius: "8px",
              border: "none",
              background: "#0f172a",
              color: "#fff",
              cursor: "pointer",
              fontSize: ".85rem",
            }}
          >
            Add Source
          </button>
        </div>
      </div>
    </div>
  );
}

export default PriceSourceModal;