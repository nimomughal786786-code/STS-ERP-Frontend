
import { useEffect, useMemo, useState } from "react";
import EmployeeModal from "../../../models/employeemodel";
import { useNavigate } from "react-router-dom";




function Employees({
  employees = [],
  onEmployeesChange,
  orders = [],
  notifications = [],
  readNotifications = [],
  addNotification,
  markAllNotificationsRead,
  markNotificationRead,
}) {
  const today = new Date().toISOString().split("T")[0];

  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("list");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const navigate = useNavigate();

  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);



  const formatPKR = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getRoleName = (role) => {
    const roles = {
      superadmin: "Super Admin",
      admin: "Admin",
      sales: "Sales Staff",
      technician: "Technician",
      accountant: "Accountant",
      staff: "General Staff",
    };

    return roles[role] || role;
  };


  const filteredEmployees = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return employees;

    return employees.filter((employee) =>
      `${employee.name || ""}
     ${employee.empId || ""}
     ${employee.email || ""}
     ${employee.phone || ""}
     ${employee.role || ""}
     ${employee.dept || ""}
     ${employee.location || ""}`
        .toLowerCase()
        .includes(value)
    );
  }, [employees, search]);

  // =========================================
  // GLOBAL SEARCH
  // =========================================

  const handleGlobalSearch = (value) => {
    const text = value.toLowerCase().trim();

    if (!text) return;

    // Search employees
    const employeeMatch = employees.find((employee) =>
      `${employee.name || ""}
     ${employee.empId || ""}
     ${employee.email || ""}
     ${employee.phone || ""}
     ${employee.role || ""}
     ${employee.dept || ""}
     ${employee.location || ""}`
        .toLowerCase()
        .includes(text)
    );

    if (employeeMatch) {
      setSearch(value);
      setActiveTab("list");
      return;
    }

    // Orders
    if (text.includes("order")) {
      navigate("/orders");
      return;
    }

    // CRM
    if (
      text.includes("customer") ||
      text.includes("lead") ||
      text.includes("crm")
    ) {
      navigate("/crm");
      return;
    }

    // Products
    if (
      text.includes("product") ||
      text.includes("inventory") ||
      text.includes("stock")
    ) {
      navigate("/products");
      return;
    }

    // Accounting
    if (
      text.includes("account") ||
      text.includes("invoice") ||
      text.includes("expense") ||
      text.includes("payable")
    ) {
      navigate("/accounting");
      return;
    }

    // Price Monitor
    if (
      text.includes("price") ||
      text.includes("rate")
    ) {
      navigate("/pricemonitor");
      return;
    }

    // Attendance
    if (text.includes("attendance")) {
      navigate("/attendance");
      return;
    }

    alert("No result found.");
  };

  // =========================
  // CENTRAL NOTIFICATIONS
  // =========================

  const unreadNotifications = notifications.filter(
    (notification) =>
      !readNotifications.includes(notification.id)
  );
  useEffect(() => {
    const handleOutsideClick = (event) => {
      const notificationArea =
        event.target.closest("[data-notification-area]");

      if (!notificationArea) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);





  // =========================================
  // ADD EMPLOYEE
  // =========================================

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  // =========================================
  // EDIT EMPLOYEE
  // =========================================

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  // =========================================
  // CLOSE MODAL
  // =========================================

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
  };

  // =========================================
  // SAVE EMPLOYEE
  // =========================================

  const handleSaveEmployee = (formData) => {
    const name = String(formData.name || "").trim();
    const email = String(formData.email || "").trim();

    if (!name || !email) {
      alert("Name and email required");
      return;
    }

    // =========================
    // EDIT EXISTING EMPLOYEE
    // =========================

    if (editingEmployee) {
      onEmployeesChange?.((prev) =>
        prev.map((employee) => {
          if (employee.id !== editingEmployee.id) {
            return employee;
          }

          return {
            ...employee,
            ...formData,

            name,
            email,

            target: parseFloat(formData.target) || 0,

            achieved:
              Number(formData.achieved) ||
              Number(employee.achieved) ||
              0,

            pass:
              formData.pass ||
              employee.pass ||
              "staff123",

            lastActive: today,

            avatar: name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()
              .slice(0, 2),
          };
        })
      );

      handleCloseModal();
      return;
    }

    // =========================
    // ADD NEW EMPLOYEE
    // =========================

    const newEmployee = {
      id: `e${Date.now()}`,

      name,

      empId:
        formData.empId ||
        `STS-${String(employees.length + 1).padStart(3, "0")}`,

      email,

      phone: formData.phone || "",

      role: formData.role || "staff",

      dept: formData.dept || "Sales",

      status: formData.status || "active",

      target: parseFloat(formData.target) || 0,

      achieved: 0,

      location: formData.location || "",

      joining: formData.joining || today,

      lastActive: today,

      avatar: name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),

      pass: formData.pass || "staff123",

      cnic: formData.cnic || "",
    };

    onEmployeesChange?.((prev) => [
      ...prev,
      newEmployee,
    ]);

    handleCloseModal();
  };

  // =========================================
  // DELETE EMPLOYEE
  // =========================================

  const handleDeleteEmployee = (employee) => {
    setDeleteEmployee(employee);
  };

  const confirmDeleteEmployee = () => {
    if (!deleteEmployee) return;

    onEmployeesChange?.((prev) =>
      prev.filter(
        (employee) =>
          employee.id !== deleteEmployee.id
      )
    );

    setDeleteEmployee(null);
  };

  // =========================================
  // ROLES & PERMISSIONS
  // =========================================

  const permissions = [
    "dashboard",
    "orders",
    "products",
    "crm",
    "finance",
    "employees",
    "inventory",
    "prices",
    "reviews",
    "settings",
  ];

  const roles = [
    {
      id: "superadmin",
      name: "Super Admin",
      perms: ["all"],
    },
    {
      id: "admin",
      name: "Admin",
      perms: [
        "dashboard",
        "orders",
        "products",
        "crm",
        "finance",
      ],
    },
    {
      id: "sales",
      name: "Sales Staff",
      perms: [
        "dashboard",
        "crm",
        "quotes",
      ],
    },
    {
      id: "technician",
      name: "Technician",
      perms: [
        "dashboard",
        "orders",
      ],
    },
    {
      id: "accountant",
      name: "Accountant",
      perms: [
        "dashboard",
        "finance",
        "invoices",
        "expenses",
      ],
    },
  ];

  // =========================================
  // TARGET DATA
  // =========================================

  const targetData = useMemo(() => {
    const currentDate = new Date();

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return employees.map((employee) => {
      const target = Number(employee.target) || 0;

      const achieved = orders
        .filter((order) => {



          if (!order.salesPerson) return false;

          // Sales person match
          if (order.salesPerson !== employee.name) return false;
          if (order.status === "cancelled") return false;
          // Order date check
          if (!order.date) return false;

          const orderDate = new Date(order.date);

          // Current month ke orders only
          return (
            orderDate.getMonth() === currentMonth &&
            orderDate.getFullYear() === currentYear
          );
        })
        .reduce(
          (total, order) =>
            total + Number(order.total || 0),
          0
        );

      const percentage = target
        ? Math.min(
          150,
          Math.round((achieved / target) * 100)
        )
        : 0;

      return {
        ...employee,
        achieved,
        percentage,
      };
    });
  }, [employees, orders]);

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <>
     

        <div className="main">

          {/* ================================= */}
          {/* TOPBAR */}
          {/* ================================= */}

          <div className="topbar">

            <div>
              <div className="tbh1">
                Employees
              </div>

              <div className="tbsub">
                Team, roles & targets
              </div>
            </div>

            <div className="tbr">

              <input
                className="tsrch"
                placeholder="Search..."
                id="GSI"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGlobalSearch(globalSearch);
                  }
                }}
              />

              <button
                className="tibtn"
                title="Price updates"
                onClick={() => navigate("/pricemonitor")}
              >
                💱
              </button>

              <button
                className="tibtn"
                title="New orders"
                onClick={() => navigate("/orders")}
              >
                📦
              </button>

              <button
                className="tibtn"
                title="Notifications"
                data-notification-area
                onClick={() =>
                  setShowNotifications((previous) => !previous)
                }
                style={{ position: "relative" }}
              >
                <span>🔔</span>

                {unreadNotifications.length > 0 && (
                  <span
                    className="ndot show"
                    id="NBD"
                  ></span>
                )}
              </button>

              <button
                className="btn bp bsm"
                onClick={handleAddEmployee}
              >
                + Add Employee
              </button>
              {showNotifications && (
                <div
                  data-notification-area
                  style={{
                    position: "absolute",
                    top: "58px",
                    right: "0",
                    width: "320px",
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    boxShadow: "0 8px 25px rgba(0,0,0,.12)",
                    zIndex: 1000,
                    padding: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <strong>Notifications</strong>

                    {unreadNotifications.length > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        style={{
                          border: "none",
                          background: "none",
                          color: "#1565a8",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div
                      style={{
                        padding: "20px 10px",
                        textAlign: "center",
                        color: "#64748b",
                        fontSize: "13px",
                      }}
                    >
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => {
                          if (!readNotifications.includes(notification.id)) {
                            markNotificationRead?.(notification.id);
                          }

                          setShowNotifications(false);

                          if (notification.action) {
                            notification.action?.();
                          } else if (notification.route) {
                            navigate(notification.route);
                          }
                        }}
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          background: readNotifications.includes(
                            notification.id
                          )
                            ? "#fff"
                            : "#f1f5f9",
                          marginBottom: "6px",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: "600",
                            fontSize: "13px",
                            marginBottom: "3px",
                          }}
                        >
                          {notification.title}
                        </div>

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                          }}
                        >
                          {notification.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ================================= */}
          {/* CONTENT */}
          {/* ================================= */}

          <div className="content">

            <div className="view active" id="v-employees">

              {/* ================================= */}
              {/* TABS */}
              {/* ================================= */}

              <div className="tabs">

                <button
                  className={`tab ${activeTab === "list"
                    ? "active"
                    : ""
                    }`}
                  onClick={() => {
                    setActiveTab("list");
                    setSearch("");
                  }}
                >
                  👥 Team
                </button>

                <button
                  className={`tab ${activeTab === "roles"
                    ? "active"
                    : ""
                    }`}
                  onClick={() => {
                    setActiveTab("roles");
                    setSearch("");
                  }}
                >
                  🔐 Roles & Permissions
                </button>

                <button
                  className={`tab ${activeTab === "targets"
                    ? "active"
                    : ""
                    }`}
                  onClick={() => {
                    setActiveTab("targets");
                    setSearch("");
                  }}
                >
                  🎯 Targets
                </button>

              </div>

              {/* ================================= */}
              {/* TEAM TAB */}
              {/* ================================= */}

              {activeTab === "list" && (
                <>

                  <div className="fr">

                    <input
                      className="sb"
                      placeholder="Search employees..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                    />

                    <button
                      className="btn bp"
                      onClick={handleAddEmployee}
                    >
                      + Add Employee
                    </button>

                  </div>

                  <div className="card">

                    <div className="tw">

                      <table className="tbl">

                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Role</th>
                            <th>Dept</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Target</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>

                        <tbody>

                          {filteredEmployees.length === 0 ? (
                            <tr>
                              <td
                                colSpan="8"
                                style={{
                                  textAlign: "center",
                                  padding: "2rem",
                                  color: "var(--mu)",
                                }}
                              >
                                No employees found
                              </td>
                            </tr>
                          ) : (
                            filteredEmployees.map(
                              (employee) => (
                                <tr
                                  key={employee.id}
                                >

                                  {/* EMPLOYEE */}

                                  <td>

                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems:
                                          "center",
                                        gap: ".55rem",
                                      }}
                                    >

                                      <div
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                          minWidth: "30px",
                                          borderRadius:
                                            "50%",
                                          background:
                                            "var(--b)",
                                          display:
                                            "flex",
                                          alignItems:
                                            "center",
                                          justifyContent:
                                            "center",
                                          color: "#fff",
                                          fontSize:
                                            ".72rem",
                                        }}
                                      >
                                        {employee.avatar}
                                      </div>

                                      <div>

                                        <strong>
                                          {employee.name}
                                        </strong>

                                        <br />

                                        <span
                                          style={{
                                            fontSize:
                                              ".67rem",
                                            color:
                                              "var(--mu)",
                                          }}
                                        >
                                          {employee.empId}
                                        </span>

                                      </div>

                                    </div>

                                  </td>

                                  {/* ROLE */}

                                  <td>

                                    <span className="bdg">
                                      {getRoleName(
                                        employee.role
                                      )}
                                    </span>

                                  </td>

                                  {/* DEPARTMENT */}

                                  <td>
                                    {employee.dept}
                                  </td>

                                  {/* PHONE */}

                                  <td>
                                    {employee.phone || "—"}
                                  </td>

                                  {/* EMAIL */}

                                  <td>
                                    {employee.email}
                                  </td>

                                  {/* TARGET */}

                                  <td className="mn">
                                    {formatPKR(
                                      employee.target
                                    )}
                                  </td>

                                  {/* STATUS */}

                                  <td>

                                    <span className="bdg">
                                      {employee.status}
                                    </span>

                                  </td>

                                  {/* ACTIONS */}

                                  <td>

                                    <div
                                      style={{
                                        display: "flex",
                                        gap: ".28rem",
                                      }}
                                    >

                                      <button
                                        className="btn bgh bxs"
                                        onClick={() =>
                                          handleEditEmployee(
                                            employee
                                          )
                                        }
                                      >
                                        ✏️
                                      </button>

                                      <button
                                        className="btn br2 bxs"
                                        onClick={() =>
                                          handleDeleteEmployee(
                                            employee
                                          )
                                        }
                                      >
                                        🗑
                                      </button>

                                    </div>

                                  </td>

                                </tr>
                              )
                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                </>
              )}

              {/* ================================= */}
              {/* ROLES TAB */}
              {/* ================================= */}

              {activeTab === "roles" && (
                <div className="g2">

                  <div className="card">

                    <div className="chd">
                      <h3>
                        🔐 Role Definitions
                      </h3>
                    </div>

                    <div className="cbd">

                      {roles.map((role) => (
                        <div
                          key={role.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              "space-between",
                            padding: ".65rem",
                            background:
                              "var(--bg)",
                            borderRadius: "8px",
                            marginBottom: ".4rem",
                          }}
                        >

                          <strong
                            style={{
                              fontSize: ".82rem",
                            }}
                          >
                            {role.name}
                          </strong>

                          <span className="bdg">
                            {role.id}
                          </span>

                        </div>
                      ))}

                    </div>

                  </div>

                  <div className="card">

                    <div className="chd">
                      <h3>
                        Module Access Matrix
                      </h3>
                    </div>

                    <div
                      style={{
                        overflowX: "auto",
                        padding: "1.1rem",
                      }}
                    >

                      <table
                        style={{
                          width: "100%",
                          borderCollapse:
                            "collapse",
                          fontSize: ".7rem",
                        }}
                      >

                        <thead>
                          <tr>

                            <th
                              style={{
                                padding: ".35rem",
                                textAlign: "left",
                                color:
                                  "var(--mu)",
                              }}
                            >
                              Module
                            </th>

                            {roles.map((role) => (
                              <th
                                key={role.id}
                                style={{
                                  padding: ".35rem",
                                  textAlign:
                                    "center",
                                  color:
                                    "var(--mu)",
                                }}
                              >
                                {role.name}
                              </th>
                            ))}

                          </tr>
                        </thead>

                        <tbody>

                          {permissions.map(
                            (permission) => (
                              <tr
                                key={permission}
                                style={{
                                  borderBottom:
                                    "1px solid var(--br)",
                                }}
                              >

                                <td
                                  style={{
                                    padding:
                                      ".35rem .55rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  {permission
                                    .charAt(0)
                                    .toUpperCase() +
                                    permission.slice(1)}
                                </td>

                                {roles.map((role) => {

                                  const allowed =
                                    role.perms.includes(
                                      "all"
                                    ) ||
                                    role.perms.includes(
                                      permission
                                    );

                                  return (
                                    <td
                                      key={role.id}
                                      style={{
                                        textAlign:
                                          "center",
                                        padding:
                                          ".35rem",
                                      }}
                                    >
                                      {allowed ? (
                                        <span
                                          style={{
                                            color:
                                              "var(--g)",
                                          }}
                                        >
                                          ✓
                                        </span>
                                      ) : (
                                        <span
                                          style={{
                                            color:
                                              "var(--mu2)",
                                          }}
                                        >
                                          —
                                        </span>
                                      )}
                                    </td>
                                  );
                                })}

                              </tr>
                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                </div>
              )}

              {/* ================================= */}
              {/* TARGETS TAB */}
              {/* ================================= */}

              {activeTab === "targets" && (
                <div className="card">

                  <div className="chd">
                    <h3>
                      🎯 Monthly Sales Targets
                    </h3>
                  </div>

                  <div
                    style={{
                      padding: "1.2rem",
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill,minmax(190px,1fr))",
                      gap: ".9rem",
                    }}
                  >

                    {targetData.length === 0 ? (
                      <div
                        style={{
                          color: "var(--mu)",
                          padding: "1rem",
                        }}
                      >
                        No employees found
                      </div>
                    ) : (
                      targetData.map((employee) => {

                        const percentage =
                          employee.percentage;

                        return (
                          <div
                            key={employee.id}
                            style={{
                              background:
                                "var(--bg)",
                              borderRadius:
                                "var(--rad)",
                              padding: ".9rem",
                              border:
                                "1px solid var(--br)",
                            }}
                          >

                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: ".83rem",
                                marginBottom:
                                  ".25rem",
                              }}
                            >
                              {employee.name}
                            </div>

                            <div
                              style={{
                                fontSize: ".7rem",
                                color: "var(--mu)",
                                marginBottom:
                                  ".65rem",
                              }}
                            >
                              {getRoleName(
                                employee.role
                              )}{" "}
                              · {employee.dept}
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent:
                                  "space-between",
                                fontSize: ".77rem",
                                marginBottom:
                                  ".35rem",
                              }}
                            >

                              <span>
                                Target:{" "}
                                {formatPKR(
                                  employee.target
                                )}
                              </span>

                              <span
                                style={{
                                  fontWeight: 700,
                                  color:
                                    percentage >= 100
                                      ? "var(--g)"
                                      : "var(--o)",
                                }}
                              >
                                {percentage}%
                              </span>

                            </div>

                            <div className="prog">

                              <div
                                className={`progf ${percentage < 50
                                  ? "low"
                                  : percentage < 100
                                    ? "mid"
                                    : ""
                                  }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    percentage
                                  )}%`,
                                }}
                              />

                            </div>

                            <div
                              style={{
                                fontSize: ".7rem",
                                color: "var(--mu)",
                                marginTop:
                                  ".35rem",
                              }}
                            >
                              Achieved:{" "}
                              {formatPKR(
                                employee.achieved
                              )}
                            </div>

                          </div>
                        );
                      })
                    )}

                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      

      {/* ================================= */}
      {/* EMPLOYEE MODAL */}
      {/* ================================= */}

      {showModal && (
        <EmployeeModal
          employee={editingEmployee}
          employeesCount={employees.length}
          onClose={handleCloseModal}
          onSave={handleSaveEmployee}
        />
      )}

      {/* ================================= */}
      {/* DELETE MODAL */}
      {/* ================================= */}

      {deleteEmployee && (
        <div
          className="mbg open"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setDeleteEmployee(null);
            }
          }}
        >

          <div
            className="modal"
            style={{ maxWidth: "400px" }}
          >

            <div className="mhd">

              <div>
                <h2>Delete Employee</h2>
              </div>

              <button
                className="mcl"
                type="button"
                onClick={() =>
                  setDeleteEmployee(null)
                }
              >
                ✕
              </button>

            </div>

            <div className="mbd">

              <p>
                Are you sure you want to delete{" "}
                <strong>
                  {deleteEmployee.name}
                </strong>
                ?
              </p>

              <p
                style={{
                  color: "var(--mu)",
                  fontSize: ".8rem",
                }}
              >
                This employee will be removed from
                the team.
              </p>

            </div>

            <div className="mft">

              <button
                className="btn bgh"
                type="button"
                onClick={() =>
                  setDeleteEmployee(null)
                }
              >
                Cancel
              </button>

              <button
                className="btn br2"
                type="button"
                onClick={confirmDeleteEmployee}
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default Employees;

