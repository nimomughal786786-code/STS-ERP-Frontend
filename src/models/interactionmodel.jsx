import { useState } from "react";

function InteractionModal({ onClose, onSave, contacts = [] }) {
  const [formData, setFormData] = useState({
    contact: "",
    dateTime: "",
    type: "Phone Call",
    notes: "",
    nextAction: "",
    nextActionDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.contact) {
      alert("Please select a Contact");
      return;
    }

    if (!formData.dateTime) {
      alert("Please select Date & Time");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="mbg open" id="MInter">
      <div className="modal msm">

        {/* HEADER */}
        <div className="mhd">
          <div>
            <h2>Log Interaction</h2>
          </div>

          <button className="mcl" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="mbd">
          <div className="fg1">

            {/* CONTACT */}
            <div className="fg">
              <label>Contact (Customer / Lead)</label>

              <select
                name="contact"
                value={formData.contact}
                onChange={handleChange}
              >
                <option value="">Select Contact</option>

                {contacts.map((contact) => (
                  <option
                    key={contact.id}
                    value={contact.id}
                  >
                    {contact.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE & TIME */}
            <div className="fg">
              <label>Date & Time</label>

              <input
                name="dateTime"
                type="datetime-local"
                value={formData.dateTime}
                onChange={handleChange}
              />
            </div>

            {/* TYPE */}
            <div className="fg">
              <label>Type</label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Phone Call">Phone Call</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Meeting">Meeting</option>
                <option value="Demo">Demo</option>
              </select>
            </div>

            {/* NOTES */}
            <div className="fg">
              <label>Notes / Outcome</label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="What was discussed..."
              />
            </div>

            {/* NEXT ACTION */}
            <div className="fg">
              <label>Next Action</label>

              <input
                name="nextAction"
                value={formData.nextAction}
                onChange={handleChange}
                placeholder="Follow up call, send quote..."
              />
            </div>

            {/* NEXT ACTION DATE */}
            <div className="fg">
              <label>Next Action Date</label>

              <input
                name="nextActionDate"
                type="date"
                value={formData.nextActionDate}
                onChange={handleChange}
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
            Log Interaction
          </button>
        </div>

      </div>
    </div>
  );
}

export default InteractionModal;