
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function Attendance({
  employees = [],
  attendance = [],
  onAttendanceChange,
  notifications = [],
  readNotifications = [],
  markAllNotificationsRead,
  markNotificationRead,
}) {
  const [selectedEmployee, setSelectedEmployee] = useState(
    employees.length > 0 ? employees[0].id : ""
  );

  const [refreshing, setRefreshing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const navigate = useNavigate();

  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const calendarData = useMemo(() => {
    const days = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];

    const statuses = [
      "atp",
      "atp",
      "atl",
      "atp",
      "ata",
      "atv",
      "atp",
      "atp",
      "atp",
      "atl",
      "atp",
      "atp",
      "ata",
      "atp",
      "atp",
      "atp",
      "atp",
      "atl",
      "ata",
      "atp",
      "atv",
      "atp",
      "atp",
      "atl",
      "atp",
      "atp",
      "atp",
      "atp",
    ];

    const labels = {
      atp: "P",
      ata: "A",
      atl: "L",
      atv: "V",
      atf: "—",
    };

    const statusTitles = {
      atp: "Present",
      ata: "Absent",
      atl: "Late",
      atv: "Leave",
      atf: "Future",
    };

    return days.map((day, dayIndex) => {
      const cells = [];

      for (let weekIndex = 0; weekIndex < 4; weekIndex++) {
        const status =
          statuses[(dayIndex + weekIndex * 7) % statuses.length];

        cells.push({
          status,
          label: labels[status],
          title: statusTitles[status],
        });
      }

      return {
        day,
        cells,
      };
    });
  }, [selectedEmployee]);






  const getLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };





  // =========================================
  // GLOBAL SEARCH
  // =========================================

  const handleGlobalSearch = (value) => {
    const q = value.trim().toLowerCase();

    if (!q) return;

    // Attendance records
    const attendanceFound = attendance.find((record) =>
      `${record.employeeName || ""}
     ${record.date || ""}
     ${record.status || ""}
     ${record.location || ""}`
        .toLowerCase()
        .includes(q)
    );

    if (attendanceFound) {
      const employee = employees.find(
        (emp) =>
          String(emp.id) === String(attendanceFound.employeeId)
      );

      if (employee) {
        setSelectedEmployee(employee.id);
      }

      return;
    }

    // Employee
    const employeeFound = employees.find((employee) =>
      `${employee.name || ""}
     ${employee.empId || ""}
     ${employee.email || ""}
     ${employee.phone || ""}
     ${employee.role || ""}
     ${employee.dept || ""}
     ${employee.location || ""}`
        .toLowerCase()
        .includes(q)
    );

    if (employeeFound) {
      setSelectedEmployee(employeeFound.id);
      return;
    }

    // Orders
    if (
      ["order", "orders"].some((word) =>
        q.includes(word)
      )
    ) {
      navigate("/orders");
      return;
    }

    // CRM
    if (
      ["customer", "customers", "client", "clients", "lead", "leads", "crm"].some(
        (word) => q.includes(word)
      )
    ) {
      navigate("/crm");
      return;
    }

    // Products / Inventory
    if (
      ["product", "products", "stock", "inventory"].some(
        (word) => q.includes(word)
      )
    ) {
      navigate("/products");
      return;
    }

    // Employees
    if (
      ["employee", "employees", "staff", "team"].some(
        (word) => q.includes(word)
      )
    ) {
      navigate("/employees");
      return;
    }

    // Accounting
    if (
      ["account", "accounting", "invoice", "expense", "payable"].some(
        (word) => q.includes(word)
      )
    ) {
      navigate("/accounting");
      return;
    }

    // Price Monitor
    if (
      ["price", "pricing", "rate"].some(
        (word) => q.includes(word)
      )
    ) {
      navigate("/pricemonitor");
      return;
    }

    alert("No matching record found.");
  };


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






  const attendanceData = useMemo(() => {
    const today = getLocalDate(new Date());

    return employees.map((employee) => {
      const record = attendance.find(
        (item) =>
          String(item.employeeId) === String(employee.id) &&
          item.date === today
      );

      return {
        id: employee.id,
        name: employee.name,
        checkIn: record?.checkIn || "—",
        location:
          record?.location ||
          employee.location ||
          "—",
        checkOut: record?.checkOut || "—",
        hours: record?.hours || "—",
        status: record?.status || "absent",
      };
    });
  }, [employees, attendance]);


  const liveStaff = useMemo(() => {
    const today = getLocalDate(new Date());

    return employees
      .filter((employee) => employee.status === "active")
      .map((employee) => {
        const record = attendance.find(
          (item) =>
            String(item.employeeId) === String(employee.id) &&
            item.date === today
        );

        return {
          ...employee,
          liveLocation:
            record?.location || employee.location || "Location not set",
          // Backend should eventually provide the latest location
          // from the employee's attendance/device record.
          isOnline: !!record?.checkIn && !record?.checkOut,
          checkIn: record?.checkIn || "",
        };
      });
  }, [employees, attendance]);



  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = (firstDay.getDay() + 6) % 7;

    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };





  const getAttendanceStatus = (date) => {
    if (!date || !selectedEmployee) {
      return "";
    }

    const dateString = getLocalDate(date);
    const today = getLocalDate(new Date());

    // Future date
    if (dateString > today) {
      return "";
    }

    const record = attendance.find(
      (item) =>
        String(item.employeeId) === String(selectedEmployee) &&
        item.date === dateString
    );

    // No attendance record
    if (!record) {
      return "";
    }

    // Leave
    if (record.status === "leave") {
      return "V";
    }

    // Late
    if (record.status === "late") {
      return "L";
    }

    // Present
    return "P";
  };



  const handleCheckIn = () => {
    console.log("CHECK IN CLICKED");

    if (!selectedEmployee) {
      alert("Please select an employee.");
      return;
    }

    const employee = employees.find(
      (emp) =>
        String(emp.id) === String(selectedEmployee)
    );

    console.log(
      "Selected Employee:",
      selectedEmployee
    );

    console.log(
      "Found Employee:",
      employee
    );

    if (!employee) {
      console.log("EMPLOYEE NOT FOUND");
      return;
    }

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Check if this employee already checked in today
    const existingRecord = attendance.find(
      (item) =>
        String(item.employeeId) === String(employee.id) &&
        item.date === today
    );

    console.log(
      "Existing Attendance Record:",
      existingRecord
    );

    // Already checked in
    if (existingRecord) {
      console.log("ALREADY CHECKED IN");
      return;
    }

    const checkInTime = now.toLocaleTimeString(
      "en-PK",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
    const officeStartHour = 9;
    const officeStartMinute = 0;

    const isLate =
      now.getHours() > officeStartHour ||
      (
        now.getHours() === officeStartHour &&
        now.getMinutes() > officeStartMinute
      );

    const attendanceStatus = isLate ? "late" : "present";
    const newAttendance = {
      id: `att-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      date: today,
      checkInAt: now.toISOString(),
      checkIn: checkInTime,

      // TEMPORARY LOCATION:
      // Currently using employee.location or "Office" as fallback.
      // Backend should later provide the actual employee/device location
      // from the attendance/biometric system when available.
      location: employee.location || "Office",

      checkOut: "",
      checkOutAt: "",
      hours: "",
      status: attendanceStatus,
    };

    console.log(
      "NEW ATTENDANCE:",
      newAttendance
    );

    onAttendanceChange?.((previous) => [
      ...previous,
      newAttendance,
    ]);
  };



  const handleCheckOut = () => {
    if (!selectedEmployee) {
      alert("Please select an employee.");
      return;
    }

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const now = new Date();

    const existingRecord = attendance.find(
      (item) =>
        String(item.employeeId) ===
        String(selectedEmployee) &&
        item.date === today
    );

    if (!existingRecord) {
      alert("Please check in first.");
      return;
    }

    if (existingRecord.checkOut) {
      return;
    }

    const checkOutTime = now.toLocaleTimeString(
      "en-PK",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    // Calculate working time
    const difference =
      now.getTime() -
      new Date(
        existingRecord.checkInAt
      ).getTime();

    const totalMinutes = Math.floor(
      difference / (1000 * 60)
    );

    const hours = Math.floor(
      totalMinutes / 60
    );

    const minutes = totalMinutes % 60;

    const formattedHours =
      `${hours}h ${minutes}m`;

    onAttendanceChange?.((previous) =>
      previous.map((record) => {
        if (
          String(record.employeeId) ===
          String(selectedEmployee) &&
          record.date === today
        ) {
          return {
            ...record,
            checkOut: checkOutTime,
            checkOutAt: now.toISOString(),
            hours: formattedHours,
          };
        }

        return record;
      })
    );
  };

  const handleSaveLeave = () => {
    if (!selectedEmployee) {
      alert("Please select an employee.");
      return;
    }

    if (!leaveDate) {
      alert("Please select leave date.");
      return;
    }

    const employee = employees.find(
      (emp) => String(emp.id) === String(selectedEmployee)
    );

    if (!employee) return;

    const existingRecord = attendance.find(
      (item) =>
        String(item.employeeId) === String(selectedEmployee) &&
        item.date === leaveDate
    );

    if (existingRecord) {
      alert("Attendance already exists for this date.");
      return;
    }

    const newLeave = {
      id: `att-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      date: leaveDate,
      checkIn: "",
      checkInAt: "",
      checkOut: "",
      checkOutAt: "",
      location: employee.location || "—",
      hours: "",
      status: "leave",
      leaveReason: leaveReason,
    };

    onAttendanceChange?.((previous) => [
      ...previous,
      newLeave,
    ]);

    setShowLeaveModal(false);
    setLeaveDate("");
    setLeaveReason("");

    alert("Leave marked successfully.");
  };

  const refreshLoc = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };



  const exportAttendance = () => {
    if (attendance.length === 0) {
      alert(
        "No attendance records available to export."
      );
      return;
    }

    const headers = [
      "Employee",
      "Date",
      "Check In",
      "Location",
      "Check Out",
      "Hours",
      "Status",
    ];

    const rows = attendance.map((record) => [
      record.employeeName || "",
      record.date || "",
      record.checkIn || "",
      record.location || "",
      record.checkOut || "",
      record.hours || "",
      record.status || "",
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `attendance-${new Date()
        .toISOString()
        .split("T")[0]}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };












  return (
    <>
     

        <div className="main">



          <div className="topbar">

            <div>
              <div className="tbh1">
                Attendance
              </div>

              <div className="tbsub">
                GPS-based attendance tracking
              </div>
            </div>

            <div className="tbr">

              <input
                className="tsrch"
                placeholder="Search..."
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


          <div className="content">

            <div className="view active">



              <div className="al ali">
                📍 Employee attendance is tracked via GPS
                check-in/check-out on the staff mobile app
                (sts-staff.html). Location is verified against
                approved work zones.
              </div>



              <div
                className="g2"
                style={{ marginBottom: "1rem" }}
              >


                <div className="card">

                  <div className="chd">
                    <h3>
                      📅 Today's Attendance
                    </h3>

                    <div style={{ display: "flex", gap: ".5rem" }}>

                      <button
                        className="btn bp bsm"
                        onClick={handleCheckIn}
                      >
                        🟢 Check In
                      </button>
                      <button
                        className="btn bgh bsm"
                        onClick={handleCheckOut}
                      >
                        🔴 Check Out
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => setShowLeaveModal(true)}
                      >
                        Mark Leave
                      </button>
                      <button
                        className="btn bgh bsm"
                        onClick={exportAttendance}
                      >
                        ⬇ Export
                      </button>

                    </div>
                  </div>

                  <div className="tw">

                    <table className="tbl">

                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Check In</th>
                          <th>Location</th>
                          <th>Check Out</th>
                          <th>Hours</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>

                        {attendanceData.length === 0 ? (

                          <tr>
                            <td
                              colSpan="6"
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

                          attendanceData.map((employee) => (

                            <tr key={employee.id}>

                              {/* EMPLOYEE */}

                              <td>
                                <strong>
                                  {employee.name}
                                </strong>
                              </td>

                              {/* CHECK IN */}

                              <td>
                                {employee.checkIn}
                              </td>

                              {/* LOCATION */}

                              <td
                                style={{
                                  fontSize: ".72rem",
                                }}
                              >
                                {employee.location}
                              </td>

                              {/* CHECK OUT */}

                              <td>
                                {employee.checkOut}
                              </td>

                              {/* HOURS */}

                              <td>
                                {employee.hours}
                              </td>

                              {/* STATUS */}

                              <td>
                                <span className="bdg d-active">
                                  Online
                                </span>
                              </td>

                            </tr>

                          ))

                        )}

                      </tbody>

                    </table>

                  </div>
                </div>





                <div className="card">
                  <div className="chd">
                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          fontSize: ".95rem",
                          margin: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        📊 Monthly Attendance
                      </h3>

                      <div
                        style={{
                          fontSize: ".65rem",
                          color: "var(--mu)",
                          marginTop: ".15rem",
                        }}
                      >
                        Employee attendance overview
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".35rem",
                        flexShrink: 0,
                      }}
                    >
                      <button
                        className="btn bgh bsm"
                        onClick={() =>
                          setCurrentMonth(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth() - 1,
                              1
                            )
                          )
                        }
                        title="Previous month"
                      >
                        ←
                      </button>

                      <div
                        style={{
                          minWidth: "105px",
                          textAlign: "center",
                          fontSize: ".78rem",
                          fontWeight: "700",
                          color: "var(--b)",
                        }}
                      >
                        {currentMonth.toLocaleString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </div>

                      <button
                        className="btn bgh bsm"
                        onClick={() =>
                          setCurrentMonth(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth() + 1,
                              1
                            )
                          )
                        }
                        title="Next month"
                      >
                        →
                      </button>
                    </div>
                  </div>

                  <div style={{ padding: "1rem" }}>

                    {/* EMPLOYEE SELECTOR */}
                    <div style={{ marginBottom: ".9rem" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: ".68rem",
                          fontWeight: "700",
                          color: "var(--mu)",
                          marginBottom: ".35rem",
                          textTransform: "uppercase",
                        }}
                      >
                        Employee
                      </label>

                      <select
                        className="fsl"
                        value={selectedEmployee}
                        onChange={(e) => {
                          setSelectedEmployee(e.target.value);
                        }}
                        style={{
                          width: "100%",
                        }}
                      >
                        {employees.length === 0 ? (
                          <option value="">No employees</option>
                        ) : (
                          employees.map((employee) => (
                            <option
                              key={employee.id}
                              value={employee.id}
                            >
                              {employee.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {/* CALENDAR */}
                    <div className="attg">

                      {/* WEEK DAYS */}
                      {[
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sun",
                      ].map((day) => (
                        <div
                          key={day}
                          className="attd"
                        >
                          <div className="attdh">
                            {day}
                          </div>
                        </div>
                      ))}

                      {/* EMPTY CELLS + DATES */}
                      {getDaysInMonth(currentMonth).map(
                        (date, index) => {

                          if (!date) {
                            return (
                              <div
                                key={`empty-${index}`}
                                className="attd"
                              >
                                <div className="attc atf">
                                  —
                                </div>
                              </div>
                            );
                          }

                          const status =
                            getAttendanceStatus(date);

                          let statusClass = "atf";
                          let statusLabel = "—";

                          if (status === "P") {
                            statusClass = "atp";
                            statusLabel = "P";
                          }

                          if (status === "A") {
                            statusClass = "ata";
                            statusLabel = "A";
                          }

                          if (status === "L") {
                            statusClass = "atl";
                            statusLabel = "L";
                          }

                          if (status === "V") {
                            statusClass = "atv";
                            statusLabel = "LV";
                          }

                          return (
                            <div
                              key={date.toISOString()}
                              className="attd"
                            >
                              <div
                                className={`attc ${statusClass}`}
                                title={`${date.toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )} - ${status === "P"
                                  ? "Present"
                                  : status === "A"
                                    ? "Absent"
                                    : status === "L"
                                      ? "Late"
                                      : status === "V"
                                        ? "Leave"
                                        : "Future"
                                  }`}
                              >
                                {date.getDate()}
                              </div>

                              <div
                                style={{
                                  fontSize: ".52rem",
                                  fontWeight: "700",
                                  color:
                                    status === "P"
                                      ? "var(--g)"
                                      : status === "A"
                                        ? "var(--r)"
                                        : status === "L"
                                          ? "var(--o)"
                                          : status === "V"
                                            ? "var(--p)"
                                            : "var(--mu)",
                                  marginTop: ".15rem",
                                }}
                              >
                                {statusLabel}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>

                    {/* LEGEND */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: ".7rem",
                        flexWrap: "wrap",
                        marginTop: "1rem",
                        paddingTop: ".8rem",
                        borderTop: "1px solid var(--br)",
                      }}
                    >
                      {/* PRESENT */}
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".35rem",
                          padding: ".3rem .55rem",
                          borderRadius: "6px",
                          background: "rgba(22, 163, 74, 0.08)",
                          fontSize: ".65rem",
                          fontWeight: "600",
                          color: "var(--g)",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "var(--g)",
                            display: "inline-block",
                          }}
                        ></span>
                        Present
                      </span>

                      {/* ABSENT */}
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".35rem",
                          padding: ".3rem .55rem",
                          borderRadius: "6px",
                          background: "rgba(220, 38, 38, 0.08)",
                          fontSize: ".65rem",
                          fontWeight: "600",
                          color: "var(--r)",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "var(--r)",
                            display: "inline-block",
                          }}
                        ></span>
                        Absent
                      </span>

                      {/* LATE */}
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".35rem",
                          padding: ".3rem .55rem",
                          borderRadius: "6px",
                          background: "rgba(245, 158, 11, 0.10)",
                          fontSize: ".65rem",
                          fontWeight: "600",
                          color: "var(--o)",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "var(--o)",
                            display: "inline-block",
                          }}
                        ></span>
                        Late
                      </span>

                      {/* LEAVE */}
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".35rem",
                          padding: ".3rem .55rem",
                          borderRadius: "6px",
                          background: "rgba(139, 92, 246, 0.08)",
                          fontSize: ".65rem",
                          fontWeight: "600",
                          color: "var(--p)",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "var(--p)",
                            display: "inline-block",
                          }}
                        ></span>
                        Leave
                      </span>
                    </div>
                  </div>
                </div>











              </div>



              <div className="card">

                <div className="chd">

                  <h3>
                    📍 Live Staff Locations
                  </h3>

                  <button
                    className="btn bgh bsm"
                    onClick={refreshLoc}
                    disabled={refreshing}
                  >
                    {refreshing
                      ? "⏳ Refreshing..."
                      : "🔄 Refresh"}
                  </button>

                </div>

                <div className="cbd">

                  {/* MAP PLACEHOLDER */}

                  <div
                    style={{
                      background:
                        "linear-gradient(135deg,var(--bl),#c5d8f7)",
                      borderRadius: "var(--rad)",
                      height: "180px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2.5rem",
                      border: "1px solid var(--br)",
                      marginBottom: ".9rem",
                    }}
                  >
                    📍
                  </div>

                  {/* STAFF LOCATIONS */}

                  <div>
                    {liveStaff.length === 0 ? (

                      <div
                        style={{
                          textAlign: "center",
                          padding: "1rem",
                          color: "var(--mu)",
                        }}
                      >
                        No active employees
                      </div>

                    ) : (

                      liveStaff.map((employee) => (

                        <div
                          key={employee.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".65rem",
                            padding: ".55rem",
                            background: "var(--bg)",
                            borderRadius: "8px",
                            marginBottom: ".35rem",
                            fontSize: ".79rem",
                          }}
                        >

                          {/* AVATAR */}

                          <div
                            style={{
                              width: "26px",
                              height: "26px",
                              borderRadius: "50%",
                              background: "var(--b)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: ".7rem",
                              flexShrink: 0,
                            }}
                          >
                            {employee.avatar}
                          </div>

                          {/* INFO */}

                          <div>

                            <strong>
                              {employee.name}
                            </strong>

                            <br />

                            <span
                              style={{
                                color: "var(--mu)",
                              }}
                            >
                              {employee.liveLocation}
                              {" · "}
                              {new Date().toLocaleTimeString(
                                "en-PK",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>

                          </div>

                          {/* ONLINE */}

                          <span
                            className="bdg d-active"
                            style={{
                              marginLeft: "auto",
                            }}
                          >
                            Online
                          </span>

                        </div>

                      ))

                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      
      {showLeaveModal && (
        <div className="leave-modal-overlay">
          <div className="leave-modal">

            <div className="leave-modal-header">
              <div>
                <h3>Mark Leave</h3>
                <p>Record employee leave</p>
              </div>

              <button
                className="leave-close-btn"
                onClick={() => setShowLeaveModal(false)}
              >
                ×
              </button>
            </div>

            <div className="leave-modal-body">

              {/* Employee */}
              <div className="leave-field">
                <label>Employee</label>

                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">Select Employee</option>

                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Leave Date */}
              <div className="leave-field">
                <label>Leave Date</label>

                <input
                  type="date"
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                />
              </div>

              {/* Leave Type */}
              <div className="leave-field">
                <label>Leave Type</label>

                <select>
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="annual">Annual Leave</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Reason */}
              <div className="leave-field">
                <label>Reason</label>

                <textarea
                  placeholder="Enter leave reason..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  rows="3"
                />
              </div>

            </div>

            <div className="leave-modal-footer">
              <button
                className="leave-cancel-btn"
                onClick={() => setShowLeaveModal(false)}
              >
                Cancel
              </button>

              <button
                className="leave-save-btn"
                onClick={handleSaveLeave}
              >
                Save Leave
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Attendance;