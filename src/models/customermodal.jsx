
import { useState } from "react";

function CustomerModal({ onClose, onSave, customer }) {
  const [formData, setFormData] = useState({
    name: customer?.name || "",
    company: customer?.company || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    city: customer?.city || "",
    address: customer?.address || "",
    notes: customer?.notes || "",
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

    if (!formData.name.trim()) {
      alert("Please enter customer name");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Please enter phone number");
      return;
    }

    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <div className="mbg open">
      <div className="modal mmd">

        {/* HEADER */}
        <div className="mhd">
          <div>
            <h2>
              {customer ? "Edit Customer" : "Add Customer"}
            </h2>

            <p>
              {customer
                ? "Update customer information."
                : "Add a new customer to your customer list."}
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

        {/* BODY */}
        <form onSubmit={handleSubmit}>

          <div className="mbd">

            <div className="fg2">

              {/* NAME */}
              <div className="fg">
                <label>Full Name *</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  required
                />
              </div>

              {/* COMPANY */}
              <div className="fg">
                <label>Company</label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name"
                />
              </div>

              {/* PHONE */}
              <div className="fg">
                <label>Phone *</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03XX XXXXXXX"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="fg">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>

              {/* CITY */}
              <div className="fg">
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Lahore"
                />
              </div>

              {/* ADDRESS */}
              <div className="fg">
                <label>Address</label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Customer address"
                />
              </div>

              {/* NOTES */}
              <div className="fg full">
                <label>Notes</label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Additional customer information..."
                />
              </div>

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
              {customer ? "Update Customer" : "Save Customer"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default CustomerModal;

