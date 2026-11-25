import { useState } from "react";

function PayableModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    vendor: "",
    amount: "",
    paidAmount: "",
    dueDate: "",
    status: "Pending",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.vendor.trim()) {
      alert("Please enter vendor name.");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      alert("Please enter amount.");
      return;
    }
    if (Number(formData.paidAmount || 0) > Number(formData.amount || 0)) {
      alert("Paid amount cannot be greater than total amount.");
      return;
    }
    if (!formData.dueDate) {
      alert("Please select due date.");
      return;
    }

    onSave({
      id: "PB-" + Date.now(),
      vendor: formData.vendor.trim(),
      amount: Number(formData.amount),
      due: formData.dueDate,
      status: formData.status,
      paidAmount: Number(formData.paidAmount || 0),
    });
  };

  return (
    <div
      className="payable-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="payable-modal">

        {/* HEADER */}
        <div className="payable-header">
          <div>
            <h2>Create New Payable</h2>
            <p>Add a vendor payable and track its status.</p>
          </div>

          <button
            type="button"
            className="payable-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="payable-body">

            {/* Vendor */}
            <div className="payable-field full">
              <label>Vendor</label>

              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                placeholder="Enter vendor name"
              />
            </div>

            {/* Amount + Due Date */}
            <div className="payable-grid">

              <div className="payable-field">
                <label>Amount</label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                />
              </div>

              <div className="payable-field">
                <label>Paid Amount</label>
                <input
                  type="number"
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleChange}
                  placeholder="Enter paid amount"
                  min="0"
                />
              </div>




              <div className="payable-field">
                <label>Due Date</label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* Status */}
            <div className="payable-field full">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

          </div>

          {/* FOOTER */}
          <div className="payable-footer">
            <button
              type="button"
              className="payable-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="payable-save"
            >
              Create Payable
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default PayableModal;