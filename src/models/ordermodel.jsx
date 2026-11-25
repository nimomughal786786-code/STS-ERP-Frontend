import { useState } from "react";

function OrderModal({
  onClose,
  onSave,
  onAddRow,
  orderItems,
  onRemoveRow,
  onItemChange,
  customers = [],
  employees = [],
}) {


  const [customer, setCustomer] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [category, setCategory] = useState("solar");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
const [salesPerson, setSalesPerson] = useState("");
  const subtotal = orderItems.reduce(
    (sum, item) =>
      sum + Number(item.qty || 0) * Number(item.rate || 0),
    0
  );
  
  return (
    <div className="mbg open" id="MOrd">
      <div className="modal mlg">
        <div className="mhd">
          <div>
            <h2 id="MOT">New Order</h2>
          </div>

          <button className="mcl" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mbd">
          <div className="fg2" style={{ marginBottom: ".85rem" }}>
            <div className="fg">
              <label>Customer *</label>

              <select
                id="omCU"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              >
                <option value="">Select customer...</option>

                {customers.map((cust) => (
                  <option key={cust.id} value={cust.name}>
                    {cust.name}
                  </option>
                ))}
              </select>
            </div>
<div className="fg">
  <label>Sales Person</label>

  <select
    id="omSP"
    value={salesPerson}
    onChange={(e) => setSalesPerson(e.target.value)}
  >
    <option value="">Select sales person...</option>

    {employees.map((emp) => (
      <option key={emp.id} value={emp.name}>
        {emp.name}
      </option>
    ))}
  </select>
</div>



            <div className="fg">
              <label>Order Date</label>
              <input
                id="omDT"
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />            </div>

            <div className="fg">
              <label>Category</label>
              <select
                id="omCA"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="solar">Solar</option>
                <option value="cctv">CCTV</option>
                <option value="it">IT</option>
              </select>
            </div>

            <div className="fg">
              <label>Delivery Address</label>
              <input
                id="omAD"
                placeholder="Delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />            </div>

            <div className="fg full">
              <label>Notes</label>
              <input
                id="omNO"
                placeholder="Order notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />            </div>
          </div>

          <h4
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: ".83rem",
              marginBottom: ".55rem",
            }}
          >
            Line Items
          </h4>

          <div
            style={{
              border: "1.5px solid var(--br)",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: ".7rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 80px 100px 100px 30px",
                gap: ".35rem",
                padding: ".45rem .75rem",
                background: "var(--bg)",
                fontSize: ".62rem",
                fontWeight: 700,
                color: "var(--mu)",
                textTransform: "uppercase",
                letterSpacing: ".05em",
              }}
            >
              <span>Item</span>
              <span>Qty</span>
              <span>Rate</span>
              <span>Amount</span>
              <span></span>
            </div>

            <div id="OIL">
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 80px 100px 100px 30px",
                    gap: ".35rem",
                    padding: ".5rem .75rem",
                    alignItems: "center",
                    borderTop: "1px solid var(--br)",
                  }}
                >
                  <input
                    className="fg input"
                    placeholder="Item"
                    value={item.name}
                    onChange={(e) =>
                      onItemChange(index, "name", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      onItemChange(index, "qty", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      onItemChange(index, "rate", e.target.value)
                    }
                  />

                  <span>
                    PKR{" "}
                    {(Number(item.qty || 0) * Number(item.rate || 0)).toLocaleString()}
                  </span>

                  <button
                    type="button"
                    className="btn br2 bxs"
                    onClick={() => onRemoveRow(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>



          </div>





          <button className="btn bgh bsm" onClick={onAddRow}>
            + Add Row
          </button>


          <div
            style={{
              marginTop: ".85rem",
              background: "var(--bg)",
              borderRadius: "8px",
              padding: ".75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: ".8rem",
                color: "var(--mu)",
                marginBottom: ".28rem",
              }}
            >
              <span>Sub Total</span>


              <span id="OST">
                PKR {subtotal.toLocaleString()}
              </span>

            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: ".97rem",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                color: "var(--b)",
                borderTop: "1px solid var(--br2)",
                paddingTop: ".45rem",
              }}
            >
              <span>TOTAL</span>


              <span id="OTT">
                PKR {subtotal.toLocaleString()}
              </span>

            </div>
          </div>

          <input type="hidden" id="omID" />
        </div>

        <div className="mft">
          <button className="btn bgh" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn bp"
            onClick={() =>
              onSave({
                customer,
                  salesPerson,
                orderDate,
                category,
                address,
                notes,
                items: orderItems,
              })
            }
          >
            💾 Save Order
          </button>



        </div>

      </div>
    </div>
  );
}

export default OrderModal;