
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";




function Expenses({ 
  expenses = [],
  onExpensesChange,
  notifications = [], 
  readNotifications = [], 
  addNotification, 
  markAllNotificationsRead, 
  markNotificationRead, 
}) {

  const expenseAccounts = [
    { code: "20010", name: "Rent" },
    { code: "20011", name: "Utility Bill" },
    { code: "20012", name: "Staff Cost" },
    { code: "20013", name: "Transportation" },
    { code: "20014", name: "Office Supplies" },
  ];
  const navigate = useNavigate();
  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);


  const today = new Date().toISOString().split("T")[0];



  const fPKR = (amount) => {
    return (
      "PKR " +
      Number(amount || 0).toLocaleString("en-PK", {
        minimumFractionDigits: 0,
      })
    );
  };



  const fD = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ================= GLOBAL SEARCH =================

  const handleGlobalSearch = (value) => {
    const text = value.toLowerCase().trim();

    if (!text) return;

    // Search current expenses
    const expenseMatch = expenses.find((expense) =>
      `${expense.desc || ""} ${expense.vendor || ""} ${expense.cat || ""} ${expense.amount || ""} ${expense.date || ""}`
        .toLowerCase()
        .includes(text)
    );

    if (expenseMatch) {
      setSearch(value);
      return;
    }

    // Open Orders
    if (
      text.includes("order") ||
      text.includes("sales")
    ) {
      navigate("/orders");
      return;
    }

    // Open CRM
    if (
      text.includes("customer") ||
      text.includes("lead") ||
      text.includes("crm")
    ) {
      navigate("/crm");
      return;
    }

    // Open Products
    if (
      text.includes("product") ||
      text.includes("stock") ||
      text.includes("inventory")
    ) {
      navigate("/products");
      return;
    }

    // Open Employees
    if (
      text.includes("employee") ||
      text.includes("staff") ||
      text.includes("team")
    ) {
      navigate("/employees");
      return;
    }

    // Open Accounting
    if (
      text.includes("account") ||
      text.includes("invoice") ||
      text.includes("payable") ||
      text.includes("receivable")
    ) {
      navigate("/accounting");
      return;
    }

    // Open Price Monitor
    if (
      text.includes("price") ||
      text.includes("rate")
    ) {
      navigate("/pricemonitor");
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

  // Close notification dropdown when clicking outside
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



  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowExpenseModal(true);
  };



  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseModal(true);
  };


  const handleSaveExpense = (expenseData) => {
    if (!expenseData.desc.trim()) {
      alert("Description is required.");
      return;
    }

    if (!expenseData.amount || Number(expenseData.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (editingExpense) {
      const updatedExpense = {
  ...expenseData,
  accountName:
    expenseAccounts.find(
      (account) => account.code === expenseData.accountCode
    )?.name || "",
  id: editingExpense.id,
  amount: Number(expenseData.amount),
};

      onExpensesChange((prev) =>
        prev.map((expense) =>
          expense.id === editingExpense.id
            ? updatedExpense
            : expense
        )
      );

      // TODO: Backend - update expense in PHP/MySQL database here

      addNotification?.({
        type: "expense_updated",
        title: "Expense Updated",
        message: `${updatedExpense.desc} — ${fPKR(
          updatedExpense.amount
        )}`,
        action: () => {
          setSearch(updatedExpense.desc);
        },
      });
    } else {
     const newExpense = {
  ...expenseData,
  accountName:
    expenseAccounts.find(
      (account) => account.code === expenseData.accountCode
    )?.name || "",
  id: "x" + Date.now(),
  amount: Number(expenseData.amount),
};

onExpensesChange((prev) => [newExpense, ...prev]);
      // TODO: Backend - insert new expense into PHP/MySQL database here

      addNotification?.({
        type: "expense_created",
        title: "New Expense Added",
        message: `${newExpense.desc} — ${fPKR(
          newExpense.amount
        )}`,
        action: () => {
          setSearch(newExpense.desc);
        },
      });

      // High-value expense notification
      if (Number(newExpense.amount) >= 100000) {
        addNotification?.({
          type: "high_expense",
          title: "High Expense",
          message: `${newExpense.desc} — ${fPKR(
            newExpense.amount
          )}`,
          action: () => {
            setSearch(newExpense.desc);
          },
        });
      }
    }

    setShowExpenseModal(false);
    setEditingExpense(null);
  };

  // -----------------------------------
  // DELETE EXPENSE
  // -----------------------------------

  const handleDeleteExpense = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    const deletedExpense = expenses.find(
      (expense) => expense.id === id
    );

    onExpensesChange((prev) => 
  prev.filter((expense) => expense.id !== id)
);

    // TODO: Backend - delete expense from PHP/MySQL database here

    if (deletedExpense) {
      addNotification?.({
        type: "expense_deleted",
        title: "Expense Deleted",
        message: `${deletedExpense.desc} — ${fPKR(
          deletedExpense.amount
        )} has been deleted.`,
      });
    }
  };

  // -----------------------------------
  // TOTAL EXPENSES
  // -----------------------------------

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount || 0),
      0
    );
  }, [expenses]);

  // -----------------------------------
  // THIS MONTH
  // -----------------------------------

  const thisMonth = useMemo(() => {
    const currentMonth = today.slice(0, 7);

    return expenses
      .filter(
        (expense) =>
          expense.date &&
          expense.date.startsWith(currentMonth)
      )
      .reduce(
        (sum, expense) =>
          sum + Number(expense.amount || 0),
        0
      );
  }, [expenses, today]);

  // -----------------------------------
  // SEARCH + CATEGORY FILTER
  // -----------------------------------

  const filteredExpenses = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return expenses.filter((expense) => {
      const matchesSearch =
  !searchText ||
  `${expense.desc || ""} ${expense.vendor || ""} ${expense.accountCode || ""} ${expense.accountName || ""}`
    .toLowerCase()
    .includes(searchText);

      const matchesCategory =
        category === "All" ||
        expense.cat === category;

      return matchesSearch && matchesCategory;
    });
  }, [expenses, search, category]);

  return (


    <div className="main">

      {/* ================= TOPBAR ================= */}

      <div className="topbar">

        <div>
          <div className="tbh1">
            Expenses
          </div>

          <div className="tbsub">
            Track operational costs
          </div>
        </div>

        <div
          className="tbr"
          style={{ position: "relative" }}
        >
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
            type="button"
            data-notification-area
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            🔔

            {unreadNotifications.length > 0 && (
              <span className="ndot"></span>
            )}
          </button>


          <button
            className="btn bp bsm"
            type="button"
            onClick={handleAddExpense}
          >
            + Expense
          </button>
          {showNotifications && (
            <div
              data-notification-area
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: "0",
                width: "330px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                boxShadow: "0 10px 30px rgba(0,0,0,.15)",
                zIndex: 1000,
                overflow: "hidden",
              }}
            >
              {/* HEADER */}
              <div
                style={{
                  padding: "12px 14px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong>Notifications</strong>

                {unreadNotifications.length > 0 && (
                  <button
                    type="button"
                    className="btn bgh bxs"
                    onClick={markAllNotificationsRead}                    >
                    Mark all read
                  </button>
                )}
              </div>

              {/* NOTIFICATIONS */}
              <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                {notifications.length > 0 ? (
                  notifications.map((notification) => {
                    const isRead = readNotifications.includes(notification.id);

                    return (
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
                          padding: "12px 14px",
                          borderBottom: "1px solid var(--border)",
                          cursor: "pointer",
                          background: isRead
                            ? "transparent"
                            : "var(--bg)",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: ".82rem",
                            marginBottom: "3px",
                          }}
                        >
                          {notification.title}
                        </div>

                        <div
                          style={{
                            fontSize: ".75rem",
                            color: "var(--muted)",
                          }}
                        >
                          {notification.message}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: "25px 15px",
                      textAlign: "center",
                      color: "var(--muted)",
                      fontSize: ".8rem",
                    }}
                  >
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ================= CONTENT ================= */}

      <div className="content">

        <div
          className="view active"
          id="v-expenses"
        >

          {/* ================= KPIs ================= */}

          <div className="kg">

            {/* Total Expenses */}

            <div
              className="kpi"
              style={{ cursor: "default" }}
            >

              <div className="kico ir">
                💳
              </div>

              <div>
                <div className="kval">
                  {fPKR(totalExpenses)}
                </div>

                <div className="klbl">
                  Total Expenses
                </div>
              </div>

            </div>

            {/* This Month */}

            <div
              className="kpi"
              style={{ cursor: "default" }}
            >

              <div className="kico io">
                📅
              </div>

              <div>
                <div className="kval">
                  {fPKR(thisMonth)}
                </div>

                <div className="klbl">
                  This Month
                </div>
              </div>

            </div>

            {/* Total Entries */}

            <div
              className="kpi"
              style={{ cursor: "default" }}
            >

              <div className="kico ib">
                📊
              </div>

              <div>
                <div className="kval">
                  {expenses.length}
                </div>

                <div className="klbl">
                  Total Entries
                </div>
              </div>

            </div>

          </div>

          {/* ================= FILTERS ================= */}

          <div className="fr">

            <input
              className="sb"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              className="fsl"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="All">
                All
              </option>

              <option value="Utilities">
                Utilities
              </option>

              <option value="Transport">
                Transport
              </option>

              <option value="Salaries">
                Salaries
              </option>

              <option value="Supplies">
                Supplies
              </option>

              <option value="Marketing">
                Marketing
              </option>

              <option value="Rent">
                Rent
              </option>

              <option value="Equipment">
                Equipment
              </option>

              <option value="Other">
                Other
              </option>

            </select>

            <button
              className="btn bp"
              type="button"
              onClick={handleAddExpense}
            >
              + Add Expense
            </button>

          </div>

          {/* ================= EXPENSE TABLE ================= */}

          <div className="card">

            <div className="tw">

              <table className="tbl">

                <thead>

                  <tr>
  <th>Date</th>
  <th>Description</th>
  <th>Category</th>
  <th>Account</th>
  <th>Vendor</th>
  <th>Amount</th>
  <th>Actions</th>
</tr>

                </thead>

                <tbody>

                  {filteredExpenses.length > 0 ? (

                    filteredExpenses.map((expense) => (

                      <tr key={expense.id}>

                        <td>
                          {fD(expense.date)}
                        </td>

                        <td>
                          <strong>
                            {expense.desc}
                          </strong>
                        </td>

                        <td>

  <span
    style={{
      fontSize: ".68rem",
      background: "var(--bg)",
      padding: "2px 7px",
      borderRadius: "5px",
    }}
  >
    {expense.cat}
  </span>

</td>

{/* ACCOUNT */}

<td>

  {expense.accountCode ? (
    <span
      style={{
        fontSize: ".68rem",
        background: "var(--bg)",
        padding: "2px 7px",
        borderRadius: "5px",
      }}
    >
      {expense.accountCode} - {expense.accountName}
    </span>
  ) : (
    "—"
  )}

</td>

<td>
  {expense.vendor || "—"}
</td>




                        <td
                          className="mn"
                          style={{
                            color: "var(--r)",
                            fontWeight: 700,
                          }}
                        >
                          {fPKR(expense.amount)}
                        </td>

                        <td>

                          <div
                            style={{
                              display: "flex",
                              gap: ".28rem",
                            }}
                          >

                            {/* EDIT */}

                            <button
                              className="btn bgh bxs"
                              type="button"
                              title="Edit Expense"
                              onClick={() =>
                                handleEditExpense(expense)
                              }
                            >
                              ✏️
                            </button>

                            {/* DELETE */}

                            <button
                              className="btn br2 bxs"
                              type="button"
                              title="Delete Expense"
                              onClick={() =>
                                handleDeleteExpense(
                                  expense.id
                                )
                              }
                            >
                              🗑
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td colSpan="7">

                        <div className="empty">

                          <div className="eico">
                            💳
                          </div>

                          <h3>
                            No expenses found
                          </h3>

                        </div>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>



      {/* ================= EXPENSE MODAL ================= */}

      {showExpenseModal && (

        <ExpenseModal
          expense={editingExpense}
          onClose={() => {
            setShowExpenseModal(false);
            setEditingExpense(null);
          }}
          onSave={handleSaveExpense}
          expenseAccounts={expenseAccounts}
        />

      )}

    </div>
  );
}


// =====================================================
// EXPENSE MODAL
// =====================================================

function ExpenseModal({
  expense,
  onClose,
  onSave,
  expenseAccounts,
}) {

  const getToday = () =>
    new Date()
      .toISOString()
      .split("T")[0];

  const [form, setForm] = useState(
    expense
      ? { ...expense }
      : {
        date: getToday(),
        desc: "",
        cat: "Other",
        accountCode: "",
        vendor: "",
        amount: "",
        payMethod: "Cash",
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

    if (!form.desc.trim()) {
      alert("Description is required.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    onSave({
      ...form,
      amount: Number(form.amount),
    });

  };

  return (

    <div className="mbg open">

      <div className="modal msm">

        {/* HEADER */}

        <div className="mhd">

          <div>

            <h2>
              {expense
                ? "Edit Expense"
                : "Add Expense"}
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

            <div className="fg1">

              {/* DATE */}

              <div className="fg">

                <label>
                  Date *
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div className="fg">

                <label>
                  Description *
                </label>

                <input
                  name="desc"
                  value={form.desc}
                  onChange={handleChange}
                  placeholder="Expense description"
                  required
                />

              </div>

              {/* CATEGORY */}

              <div className="fg">

                <label>
                  Category
                </label>

                <select
                  name="cat"
                  value={form.cat}
                  onChange={handleChange}
                >

                  <option value="Utilities">
                    Utilities
                  </option>

                  <option value="Transport">
                    Transport
                  </option>

                  <option value="Salaries">
                    Salaries
                  </option>

                  <option value="Supplies">
                    Supplies
                  </option>

                  <option value="Marketing">
                    Marketing
                  </option>

                  <option value="Rent">
                    Rent
                  </option>

                  <option value="Equipment">
                    Equipment
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>



              {/* account  */}
              <div className="fg">
                <label>Account</label>
                <select
                  name="accountCode"
                  value={form.accountCode}
                  onChange={(e) =>
                    setForm({ ...form, accountCode: e.target.value })
                  }
                >
                  <option value="">Select Account</option>

                  {expenseAccounts.map((account) => (
                    <option key={account.code} value={account.code}>
                      {account.code} - {account.name}
                    </option>
                  ))}
                </select>
              </div>









              {/* VENDOR */}

              <div className="fg">

                <label>
                  Vendor
                </label>

                <input
                  name="vendor"
                  value={form.vendor}
                  onChange={handleChange}
                  placeholder="Vendor name"
                />

              </div>

              {/* AMOUNT */}

              <div className="fg">

                <label>
                  Amount (PKR) *
                </label>

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0"
                  min="1"
                  required
                />

              </div>

              {/* PAYMENT METHOD */}

              <div className="fg">

                <label>
                  Payment Method
                </label>

                <select
                  name="payMethod"
                  value={form.payMethod}
                  onChange={handleChange}
                >

                  <option value="Cash">
                    Cash
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                  <option value="Cheque">
                    Cheque
                  </option>

                  <option value="Online">
                    Online
                  </option>

                </select>

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
                {expense
                  ? "Update Expense"
                  : "Save"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  );
}

export default Expenses;

