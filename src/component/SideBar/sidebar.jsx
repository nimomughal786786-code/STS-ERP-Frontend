import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";


function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();



  const toggleSB = () => {
    setIsCollapsed((prev) => !prev);
  };

  const nav = (page) => {
    // React Router navigation ko baad mein yahan connect karenge.
    // Original navigation keys preserve kiye gaye hain.
    navigate(page);
  };

  const logout = () => {
    // Original logout functionality ko yahan connect karenge.
    console.log("Logout");
  };

  const openWebsite = () => {
    window.open("index.html", "_blank");
  };

  const openStaffApp = () => {
    window.open("sts-staff.html", "_blank");
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`} id="SB">
      <div className="sbhd">
        <button className="sbtog" onClick={toggleSB}>
          ☰
        </button>

        <span className="ltxt">
          STS <span>ERP</span>
        </span>
      </div>

      <div className="ssec">
        <div className="slbl">Overview</div>

        <div className={`si ${location.pathname === "/dashboard" ? "active" : ""}`}
          onClick={() => nav("dashboard")}>
          <span className="sic">📊</span>
          <span className="lbl">Dashboard</span>
        </div>

        <div className={`si ${location.pathname === "/business-intelligence" ? "active" : ""
          }`}
          onClick={() => nav("/business-intelligence")}>
          <span className="sic">📈</span>
          <span className="lbl">Business Intelligence</span>
        </div>
      </div>

      <div className="ssec">
        <div className="slbl">Sales</div>

        <div className={`si ${location.pathname === "/orders" ? "active" : ""}`}
          onClick={() => nav("/orders")}>
          <span className="sic">📦</span>
          <span className="lbl">Orders</span>
          {/* <span className="sbadge rd" id="sbO">
            0
          </span> */}
        </div>

        <div className={`si ${location.pathname === "/quotes" ? "active" : ""}`}
          onClick={() => nav("/quotes")}>
          <span className="sic">📋</span>
          <span className="lbl">Quotes / LPO</span>
        </div>

        <div className={`si ${location.pathname === "/invoice" ? "active" : ""}`}
          onClick={() => nav("/invoice")}>
          <span className="sic">🧾</span>
          <span className="lbl">Invoices</span>
        </div>

        <div className={`si ${location.pathname === "/crm&leads" ? "active" : ""}`}
          onClick={() => nav("/crm&leads")}>
          <span className="sic">🤝</span>
          <span className="lbl">CRM & Leads</span>
          {/* <span className="sbadge" id="sbL">
            0
          </span> */}
        </div>
      </div>

      <div className="ssec">
        <div className="slbl">Catalogue</div>

        <div className={`si ${location.pathname === "/products" ? "active" : ""}`}
          onClick={() => nav("/products")}>
          <span className="sic">🏷️</span>
          <span className="lbl">Products</span>
        </div>

        <div className={`si ${location.pathname === "/inventory" ? "active" : ""}`}
          onClick={() => nav("/inventory")}>
          <span className="sic">🏭</span>
          <span className="lbl">Inventory</span>
        </div>

        <div className={`si ${location.pathname === "/pricemonitor" ? "active" : ""}`}
          onClick={() => nav("/pricemonitor")}>
          <span className="sic">💱</span>
          <span className="lbl">Price Monitor</span>
          {/* <span className="sbadge" id="sbP">
            0
          </span> */}
        </div>

        <div className={`si ${location.pathname === "/reviews" ? "active" : ""}`}
          onClick={() => nav("/reviews")}>            <span className="sic">⭐</span>
          <span className="lbl">Reviews</span>
        </div>
      </div>

      <div className="ssec">
        <div className="slbl">Finance</div>

        <div className={`si ${location.pathname === "/accounting" ? "active" : ""}`}
          onClick={() => nav("/accounting")}>
          <span className="sic">💰</span>
          <span className="lbl">Accounting</span>
        </div>

        <div className={`si ${location.pathname === "/expenses" ? "active" : ""}`}
          onClick={() => nav("/expenses")}>
          <span className="sic">💳</span>
          <span className="lbl">Expenses</span>
        </div>
      </div>

      <div className="ssec">
        <div className="slbl">HR</div>

        <div className={`si ${location.pathname === "/employee" ? "active" : ""}`}
          onClick={() => nav("/employee")}>            <span className="sic">👥</span>
          <span className="lbl">Employees</span>
        </div>

        <div className={`si ${location.pathname === "/attendence" ? "active" : ""}`}
          onClick={() => nav("/attendence")}>           <span className="sic">📍</span>
          <span className="lbl">Attendance</span>
        </div>
      </div>

      <div className="ssec">
        <div className="sdiv"></div>

        <div className={`si ${location.pathname === "/setting" ? "active" : ""}`}
          onClick={() => nav("/setting")}>
          <span className="sic">⚙️</span>
          <span className="lbl">Settings</span>
        </div>

        <div className="si" onClick={openWebsite}>
          <span className="sic">🌐</span>
          <span className="lbl">View Website</span>
        </div>

        <div className="si" onClick={openStaffApp}>
          <span className="sic">📱</span>
          <span className="lbl">Staff App</span>
        </div>
      </div>

      <div className="sbottom">
        <div className="fb">
          <div className="savatar" id="SAV">
            RA
          </div>

          <div className="ui">
            <strong id="SN">Rameez Ahmed</strong>
            <span id="SR">Super Admin</span>
          </div>
        </div>

        <button className="slo" onClick={logout}>
          ⬅ Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;