import { useEffect, useState } from "react";


function LPOModal({ onClose, onSave, lpo }) {

  const [formData, setFormData] = useState({
    supplier: "",
    email: "",
    lpoDate: "",
    deliveryDate: "",
    paymentTerms: "",
     status: "draft",
    notes: "",
  });

  const [items, setItems] = useState([
    {
      product: "",
      quantity: 1,
      rate: 0,
    },
  ]);


useEffect(() => {
  if (lpo) {
    setFormData({
      supplier: lpo.supplier || "",
      email: lpo.email || "",
      lpoDate: lpo.lpoDate || "",
      deliveryDate: lpo.deliveryDate || "",
      paymentTerms: lpo.paymentTerms || "",
      status: lpo.status || "draft",
      notes: lpo.notes || "",
    });

    setItems(
      lpo.items && lpo.items.length > 0
        ? lpo.items
        : [
            {
              product: "",
              quantity: 1,
              rate: 0,
            },
          ]
    );
  }
}, [lpo]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        product: "",
        quantity: 1,
        rate: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;

    setItems((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const getAmount = (item) => {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;

    return quantity * rate;
  };

  const subtotal = items.reduce(
    (total, item) => total + getAmount(item),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const lpo = {
  ...formData,
  items,
  total: subtotal,
};

    if (onSave) {
      onSave(lpo);
    }
  };












  return (
    <div className="mbg open">

      <div
        className="modal mlg"
        style={{
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >

        {/* HEADER */}
        <div className="mhd">

          <div>
<h2>{lpo ? "Edit LPO" : "Create LPO"}</h2>
            <p>
              Create a local purchase order for your supplier
            </p>
          </div>

          <button
            className="mcl"
            type="button"
            onClick={onClose}
          >
            ✕
          </button>

        </div>


        <form onSubmit={handleSubmit}>

          <div className="mbd">

            {/* SUPPLIER INFORMATION */}
            <div style={{ marginBottom: "1.5rem" }}>

              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: ".82rem",
                  fontWeight: "700",
                  marginBottom: ".8rem",
                  color: "var(--tx)",
                }}
              >
                Supplier Information
              </div>


              <div className="fg2">

                {/* SUPPLIER */}
                <div className="fg">

                  <label>
                    Supplier / Vendor *
                  </label>

                  <input
                    type="text"
                    name="supplier"
                    placeholder="Enter supplier name"
                    value={formData.supplier}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* EMAIL */}
                <div className="fg">

                  <label>
                    Supplier Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="supplier@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>


                {/* LPO DATE */}
                <div className="fg">

                  <label>
                    LPO Date *
                  </label>

                  <input
                    type="date"
                    name="lpoDate"
                    value={formData.lpoDate}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* DELIVERY DATE */}
                <div className="fg">

                  <label>
                    Expected Delivery Date
                  </label>

                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                  />

                </div>


                {/* PAYMENT TERMS */}
                <div className="fg">

                  <label>
                    Payment Terms
                  </label>

                  <select
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select payment terms
                    </option>

                    <option value="cash">
                      Cash
                    </option>

                    <option value="advance">
                      100% Advance
                    </option>

                    <option value="50-50">
                      50% Advance / 50% on Delivery
                    </option>

                    <option value="credit">
                      Credit
                    </option>
                  </select>




<label>
    Status
  </label>

  <select
    name="status"
    value={formData.status}
    onChange={handleChange}
  >
    <option value="draft">
      Draft
    </option>

    <option value="sent">
      Sent
    </option>

    <option value="approved">
      Approved
    </option>

   

    <option value="received">
      Received
    </option>

    <option value="cancelled">
      Cancelled
    </option>

  </select>




                </div>

              </div>

            </div>


            {/* PURCHASE ITEMS */}
            <div>

              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: ".82rem",
                  fontWeight: "700",
                  marginBottom: ".8rem",
                  color: "var(--tx)",
                }}
              >
                Purchase Items
              </div>


              {/* COLUMN HEADERS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(220px, 1fr) 100px 130px 140px 42px",
                  gap: ".6rem",
                  padding: "0 .2rem .4rem",
                  fontSize: ".65rem",
                  fontWeight: "700",
                  color: "var(--mu)",
                  textTransform: "uppercase",
                  letterSpacing: ".04em",
                }}
              >

                <div>Product / Service</div>

                <div>Quantity</div>

                <div>Rate (PKR)</div>

                <div>Amount (PKR)</div>

                <div></div>

              </div>


              {/* ITEMS */}
              {items.map((item, index) => (

                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(220px, 1fr) 100px 130px 140px 42px",
                    gap: ".6rem",
                    alignItems: "center",
                    marginBottom: ".6rem",
                  }}
                >

                  {/* PRODUCT */}
                  <input
                    type="text"
                    placeholder="Product or service"
                    value={item.product}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "product",
                        e.target.value
                      )
                    }
                    required
                    style={{
                      background: "var(--bg)",
                      border: "1.5px solid var(--br)",
                      borderRadius: "8px",
                      padding: ".52rem .7rem",
                      fontSize: ".8rem",
                      outline: "none",
                      width: "100%",
                    }}
                  />


                  {/* QUANTITY */}
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        e.target.value
                      )
                    }
                    onWheel={(e) =>
                      e.currentTarget.blur()
                    }
                    style={{
                      background: "var(--bg)",
                      border: "1.5px solid var(--br)",
                      borderRadius: "8px",
                      padding: ".52rem .6rem",
                      fontSize: ".8rem",
                      outline: "none",
                      width: "100%",
                    }}
                  />


                  {/* RATE */}
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "rate",
                        e.target.value
                      )
                    }
                    onWheel={(e) =>
                      e.currentTarget.blur()
                    }
                    style={{
                      background: "var(--bg)",
                      border: "1.5px solid var(--br)",
                      borderRadius: "8px",
                      padding: ".52rem .6rem",
                      fontSize: ".8rem",
                      outline: "none",
                      width: "100%",
                    }}
                  />


                  {/* AMOUNT */}
                  <div
                    style={{
                      background: "var(--bg)",
                      border: "1.5px solid var(--br)",
                      borderRadius: "8px",
                      padding: ".52rem .7rem",
                      fontSize: ".78rem",
                      fontWeight: "700",
                      color: "var(--tx)",
                      textAlign: "right",
                    }}
                  >
                    {getAmount(item).toLocaleString()}
                  </div>


                  {/* REMOVE */}
                  <button
                    type="button"
                    className="btn bgh bxs"
                    onClick={() => removeItem(index)}
                    title="Remove item"
                  >
                    ✕
                  </button>

                </div>

              ))}


              {/* ADD ITEM */}
              <button
                type="button"
                className="btn bou bsm"
                onClick={addItem}
              >
                + Add Item
              </button>

            </div>


            {/* TOTAL */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1.3rem",
              }}
            >

              <div
                style={{
                  width: "280px",
                  borderTop: "1px solid var(--br)",
                  paddingTop: ".8rem",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: ".78rem",
                    color: "var(--mu)",
                    marginBottom: ".45rem",
                  }}
                >

                  <span>
                    Subtotal
                  </span>

                  <span>
                    PKR {subtotal.toLocaleString()}
                  </span>

                </div>


                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "Syne, sans-serif",
                    fontWeight: "800",
                    fontSize: ".95rem",
                    color: "var(--tx)",
                  }}
                >

                  <span>
                    Total
                  </span>

                  <span>
                    PKR {subtotal.toLocaleString()}
                  </span>

                </div>

              </div>

            </div>


            {/* NOTES */}
            <div
              className="fg"
              style={{
                marginTop: "1.3rem",
              }}
            >

              <label>
                Notes
              </label>

              <textarea
                name="notes"
                rows="3"
                placeholder="Add delivery instructions or other notes..."
                value={formData.notes}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* FOOTER */}
          <div className="mft">

            <button
              type="button"
              className="btn bgh"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn bp"
            >
             {lpo ? "Update LPO" : "Save LPO"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default LPOModal;