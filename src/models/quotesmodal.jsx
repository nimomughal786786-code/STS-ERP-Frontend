import { useEffect, useState } from "react";
function QuotesModal({ onClose, onSave,quote }) {
  const [formData, setFormData] = useState({
    customerName: "",
    subject: "",
    date: "",
    validUntil: "",
    notes: "",
    status: "",
  });

  const [items, setItems] = useState([
    {
      product: "",
      quantity: 1,
      rate: 0,
    },
  ]);
useEffect(() => {
  if (quote) {
    setFormData({
      customerName: quote.customerName || "",
      subject: quote.subject || "",
      date: quote.date || "",
      validUntil: quote.validUntil || "",
      notes: quote.notes || "",
       status: quote.status || "draft",
    });

    setItems(
      quote.items && quote.items.length > 0
        ? quote.items
        : [
            {
              product: "",
              quantity: 1,
              rate: 0,
            },
          ]
    );
  }
}, [quote]);
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
            [field]:
              field === "quantity" || field === "rate"
                ? value
                : value,
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

    const quote = {
      ...formData,
      items,
      total: subtotal,
    };

    if (onSave) {
      onSave(quote);
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
            <h2>New Quote</h2>

            <p>
              Create a professional quotation for your customer
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

            {/* CUSTOMER INFORMATION */}
            <div style={{ marginBottom: "1.4rem" }}>

              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: ".82rem",
                  fontWeight: "700",
                  marginBottom: ".8rem",
                  color: "var(--tx)",
                }}
              >
                Customer Information
              </div>


              <div className="fg2">

                <div className="fg">

                  <label>
                    Customer *
                  </label>

                  <input
                    type="text"
                    name="customerName"
                    placeholder="Enter customer name"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="fg">

                  <label>
                    Subject *
                  </label>

                  <input
                    type="text"
                    name="subject"
                    placeholder="e.g. Solar Installation"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="fg">

                  <label>
                    Quote Date *
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="fg">

                  <label>
                    Valid Until
                  </label>

                  <input
                    type="date"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleChange}
                  />

                </div>

                <div className="fg">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                    <option value="invoiced">Invoiced</option>
                  </select>

                </div>

              </div>

            </div>


            {/* ITEMS SECTION */}
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
                Quotation Items
              </div>


              {/* COLUMN HEADINGS */}
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


              {/* ITEM ROWS */}
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
                    onWheel={(e) => e.currentTarget.blur()}
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
                    onWheel={(e) => e.currentTarget.blur()}
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
                style={{ marginTop: ".2rem" }}
              >
                + Add Item
              </button>

            </div>


            {/* SUMMARY */}
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
                    marginBottom: ".4rem",
                  }}
                >
                  <span>Subtotal</span>

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
                  <span>Total</span>

                  <span>
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>

              </div>

            </div>


            {/* NOTES */}
            <div
              className="fg"
              style={{ marginTop: "1.3rem" }}
            >

              <label>
                Notes
              </label>

              <textarea
                name="notes"
                rows="3"
                placeholder="Add any additional information for the customer..."
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
              Save Quote
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default QuotesModal;