import { useEffect, useState } from "react";

function EmployeeModal({ employee, employeesCount = 0, onClose, onSave }) {
const today = new Date().toISOString().split("T")[0];

const getDefaultForm = () => ({
name: "",
empId: `STS-${String(employeesCount + 1).padStart(3, "0")}`,
email: "",
phone: "",
role: "staff",
dept: "Sales",
pass: "",
status: "active",
location: "",
target: 0,
joining: today,
cnic: "",
});

const [form, setForm] = useState(getDefaultForm());

useEffect(() => {
if (employee) {
setForm({
name: employee.name || "",
empId: employee.empId || "",
email: employee.email || "",
phone: employee.phone || "",
role: employee.role || "staff",
dept: employee.dept || "Sales",
pass: "",
status: employee.status || "active",
location: employee.location || "",
target: employee.target || 0,
joining: employee.joining || today,
cnic: employee.cnic || "",
});
} else {
setForm(getDefaultForm());
}
}, [employee]);

const handleChange = (e) => {
const { name, value } = e.target;


setForm((prev) => ({
  ...prev,
  [name]: value,
}));


};

const handleSubmit = (e) => {
e.preventDefault();


const name = form.name.trim();
const email = form.email.trim();

if (!name || !email) {
  alert("Name and email required");
  return;
}

onSave({
  ...form,
  name,
  email,
  target: parseFloat(form.target) || 0,
});


};

return (
<div
className="mbg open"
onMouseDown={(e) => {
if (e.target === e.currentTarget) {
onClose();
}
}}
> <div className="modal mmd">


    {/* HEADER */}
    <div className="mhd">
      <div>
        <h2>
          {employee ? "Edit Employee" : "Add Employee"}
        </h2>
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
    <div className="mbd">
      <form onSubmit={handleSubmit}>

        <div className="fg2">

          {/* Full Name */}
          <div className="fg">
            <label>Full Name *</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              required
            />
          </div>

          {/* Employee ID */}
          <div className="fg">
            <label>Employee ID</label>

            <input
              name="empId"
              value={form.empId}
              onChange={handleChange}
              placeholder="STS-001"
            />
          </div>

          {/* Email */}
          <div className="fg">
            <label>Email *</label>

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="employee@email.com"
              required
            />
          </div>

          {/* Phone */}
          <div className="fg">
            <label>Phone</label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="03XXXXXXXXX"
            />
          </div>

          {/* Role */}
          <div className="fg">
            <label>Role *</label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="superadmin">
                Super Admin
              </option>

              <option value="admin">
                Admin
              </option>

              <option value="sales">
                Sales Staff
              </option>

              <option value="technician">
                Technician
              </option>

              <option value="accountant">
                Accountant
              </option>

              <option value="staff">
                General Staff
              </option>
            </select>
          </div>

          {/* Department */}
          <div className="fg">
            <label>Department</label>

            <select
              name="dept"
              value={form.dept}
              onChange={handleChange}
            >
              <option value="Sales">
                Sales
              </option>

              <option value="Technical">
                Technical
              </option>

              <option value="Finance">
                Finance
              </option>

              <option value="Management">
                Management
              </option>
            </select>
          </div>

          {/* Password */}
          <div className="fg">
            <label>App Password</label>

            <input
              name="pass"
              type="password"
              value={form.pass}
              onChange={handleChange}
              placeholder="For staff app login"
            />
          </div>

          {/* Status */}
          <div className="fg">
            <label>Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>

          {/* Location */}
          <div className="fg">
            <label>Work Location / Zone</label>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="DHA Lahore, Gulberg..."
            />
          </div>

          {/* Target */}
          <div className="fg">
            <label>Sales Target (PKR/month)</label>

            <input
              name="target"
              type="number"
              min="0"
              value={form.target}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          {/* Joining Date */}
          <div className="fg">
            <label>Joining Date</label>

            <input
              name="joining"
              type="date"
              value={form.joining}
              onChange={handleChange}
            />
          </div>

          {/* CNIC */}
          <div className="fg">
            <label>CNIC</label>

            <input
              name="cnic"
              value={form.cnic}
              onChange={handleChange}
              placeholder="00000-0000000-0"
            />
          </div>

        </div>

        {/* FOOTER */}
        <div className="mft">

          <button
            className="btn bgh"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn bp"
            type="submit"
          >
            {employee
              ? "Update Employee"
              : "Save Employee"}
          </button>

        </div>

      </form>
    </div>
  </div>
</div>


);
}

export default EmployeeModal;
