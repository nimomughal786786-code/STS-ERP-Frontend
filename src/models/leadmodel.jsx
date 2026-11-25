import { useState } from "react";

function LeadModal({ onClose, onSave, lead, employees = [] }) {
  const [formData, setFormData] = useState({
    id: lead?.id || "",
    name: lead?.name || "",
    company: lead?.company || "",
    phone: lead?.phone || "",
    email: lead?.email || "",
    city: lead?.city || "",
    service: lead?.service || "solar",
    value: lead?.value || "",
    priority: lead?.priority || "hot",
    stage: lead?.stage || "new",
    assignedTo: lead?.assignedTo || "",
    notes: lead?.notes || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Please enter Full Name");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Please enter Phone Number");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="mbg open" id="MLead">
      <div className="modal mmd">

        {/* HEADER */}
        <div className="mhd">
          <div>
            <h2>{lead ? "Edit Lead" : "Add Lead"}</h2>
          </div>

          <button className="mcl" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="mbd">
          <div className="fg2">

            {/* FULL NAME */}
            <div className="fg">
              <label>Full Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
              />
            </div>

            {/* COMPANY */}
            <div className="fg">
              <label>Company</label>
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company (optional)"
              />
            </div>

            {/* PHONE */}
            <div className="fg">
              <label>Phone *</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="03XX XXXXXXX"
              />
            </div>

            {/* EMAIL */}
            <div className="fg">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </div>

            {/* CITY */}
            <div className="fg">
              <label>City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Lahore, DHA..."
              />
            </div>

            {/* SERVICE */}
            <div className="fg">
              <label>Service</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option value="solar">Solar System</option>
                <option value="cctv">CCTV</option>
                <option value="it">IT Hardware</option>
                <option value="fence">Electric Fence</option>
              </select>
            </div>

            {/* VALUE */}
            <div className="fg">
              <label>Est. Value (PKR)</label>
              <input
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            {/* PRIORITY */}
            <div className="fg">
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="hot">🔥 Hot</option>
                <option value="warm">🌡️ Warm</option>
                <option value="cold">❄️ Cold</option>
              </select>
            </div>

            {/* STAGE */}
            <div className="fg">
              <label>Stage</label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
              >
                <option value="new">New</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            {/* ASSIGN TO */}
            <div className="fg">
              <label>Assign To</label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
              >
                <option value="">Select Employee</option>

                {employees.map((employee) => (
                  <option key={employee.id} value={employee.name}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            {/* NOTES */}
            <div className="fg full">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
              />
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="mft">
          <button className="btn bgh" onClick={onClose}>
            Cancel
          </button>

          <button className="btn bp" onClick={handleSubmit}>
            {lead ? "Update Lead" : "Save Lead"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default LeadModal;