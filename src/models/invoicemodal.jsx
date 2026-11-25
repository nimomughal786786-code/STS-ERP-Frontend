
import { useState } from "react";

function InvoiceModal({
  invoice,
  onClose,
  onSave,
  paymentMode = false,
}) {
  const [form, setForm] = useState(
    invoice
      ? { ...invoice }
      : {
        customerName: "",
        date: "",
        dueDate: "",
        total: "",
        paidAmount: "",
        status: "unpaid",
        revenueAccountCode: "",
      }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // =========================
    // PAYMENT MODE
    // =========================
    if (paymentMode) {
      const paymentAmount = Number(form.paymentAmount || 0);
      const currentPaid = Number(invoice?.paidAmount || 0);
      const total = Number(invoice?.total || 0);
      const remainingBalance = total - currentPaid;

      if (paymentAmount <= 0) {
        alert("Please enter a valid payment amount.");
        return;
      }

      if (paymentAmount > remainingBalance) {
        alert(
          "Payment amount cannot be greater than remaining balance."
        );
        return;
      }

      const newPaidAmount = currentPaid + paymentAmount;
      const newBalance = total - newPaidAmount;

      let newStatus = "partial";

      if (newBalance === 0) {
        newStatus = "paid";
      }

      const paymentRecord = {
  id: `pay-${Date.now()}`,
  amount: paymentAmount,
  method: form.paymentMethod,
  date: new Date().toISOString(),
};

onSave({
  ...invoice,
  paidAmount: newPaidAmount,
  status: newStatus,
  paymentMethod: form.paymentMethod,
  paymentHistory: [
    ...(invoice?.paymentHistory || []),
    paymentRecord,
  ],
});

      return;
    }

    // =========================
    // NORMAL INVOICE MODE
    // =========================
    onSave({
      ...form,
      total: Number(form.total || 0),
      paidAmount: Number(form.paidAmount || 0),
    });
  };

  return (
    <div className="mbg open">
      <div className="modal msm invoice-payment-modal">

        {/* ================= HEADER ================= */}

        <div className="mhd">
          <div>
            <h2>
              {paymentMode
                ? "Record Payment"
                : invoice
                  ? "Edit Invoice"
                  : "Create New Invoice"}
            </h2>

            <p>
              {paymentMode
                ? "Record a payment received for this invoice."
                : invoice
                  ? "Update invoice details and payment information."
                  : "Create a new invoice and track its payment status."}
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

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit}>

          {paymentMode ? (

            // =====================================
            // PAYMENT MODE
            // =====================================

            <>
              <div className="fg">
                <label>Customer Name</label>

                <input
                  value={invoice?.customerName || ""}
                  readOnly
                />
              </div>

              <div className="fg">
                <label>Invoice #</label>

                <input
                  value={invoice?.number || ""}
                  readOnly
                />
              </div>

              <div className="fg2">

                <div className="fg">
                  <label>Total Amount</label>

                  <input
                    value={invoice?.total || 0}
                    readOnly
                  />
                </div>

                <div className="fg">
                  <label>Already Paid</label>

                  <input
                    value={invoice?.paidAmount || 0}
                    readOnly
                  />
                </div>

              </div>


              <div className="fg">
                <label>Revenue Account</label>

                <select
                  name="revenueAccountCode"
                  value={form.revenueAccountCode}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Revenue Account</option>
                  <option value="40010">Solar Sales</option>
                  <option value="40020">Battery Sales</option>
                  <option value="40030">CCTV Products Sales</option>
                  <option value="40040">IT Products Sales</option>
                </select>
              </div>








              <div className="fg">
                <label>Remaining Balance</label>

                <input
                  value={
                    Number(invoice?.total || 0) -
                    Number(invoice?.paidAmount || 0)
                  }
                  readOnly
                />
              </div>

              <div className="fg">
                <label>Payment Amount</label>

                <input
                  type="number"
                  name="paymentAmount"
                  value={form.paymentAmount || ""}
                  onChange={handleChange}
                  placeholder="Enter payment amount"
                  min="1"
                  max={
                    Number(invoice?.total || 0) -
                    Number(invoice?.paidAmount || 0)
                  }
                  required
                />
              </div>

              <div className="fg">
                <label>Payment Method</label>

                <select
                  name="paymentMethod"
                  value={form.paymentMethod || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                </select>
              </div>




            </>

          ) : (

            // =====================================
            // NORMAL INVOICE MODE
            // =====================================

            <>
              <div className="fg2">

                <div className="fg">
                  <label>Customer Name</label>

                  <input
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="fg">
                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="unpaid">
                      Unpaid
                    </option>

                    <option value="partial">
                      Partial
                    </option>

                    <option value="paid">
                      Paid
                    </option>

                    <option value="overdue">
                      Overdue
                    </option>
                  </select>
                </div>

              </div>

              <div className="fg2">

                <div className="fg">
                  <label>Invoice Date</label>

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="fg">
                  <label>Due Date</label>

                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="fg2">

                <div className="fg">
                  <label>Total Amount</label>

                  <input
                    type="number"
                    name="total"
                    value={form.total}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    required
                  />
                </div>

                <div className="fg">
                  <label>Paid Amount</label>

                  <input
                    type="number"
                    name="paidAmount"
                    value={form.paidAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                  />
                </div>

              </div>
            </>
          )}

          {/* ================= FOOTER ================= */}

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
              {paymentMode
                ? "Save Payment"
                : invoice
                  ? "Update Invoice"
                  : "Create Invoice"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default InvoiceModal;

