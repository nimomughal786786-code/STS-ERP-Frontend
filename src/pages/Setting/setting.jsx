import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultSettings = {
  companyName: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  whatsapp: "***********",
  adminPass: "",

  logo: "",

  primaryColor: "#0A3D62",
  accentColor: "#F0A500",
  heroTitle: "",
  heroSub: "",
  announce: "",

  jzMid: "",
  jzMode: "sandbox",
  jzPassword: "",
  jzSalt: "",

  smtpHost: "",
  smtpPort: "587",
  smtpUsername: "",
  smtpPassword: "",

  googleMapsKey: "",

  facebook: "",
  instagram: "",
  whatsappBusiness: "",
  linkedin: "",
  youtube: "",
  tiktok: "",
  facebookPixel: "",
  googleAnalytics: "",

  nextQ: 1001,
  nextI: 1001,
  quoteValidity: 7,
  payTerms: "50% advance, 50% on delivery",
  terms: "This quotation is valid for 7 days from the date of issue...",
};



function Settings({
  notifications = [],
  readNotifications = [],
  markAllNotificationsRead,
  markNotificationRead,
}) {
  const [activeTab, setActiveTab] = useState("company");
  const navigate = useNavigate();
  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  /*
   * FRONTEND ONLY FOR NOW
   *
   * Settings are intentionally kept only in React state.
   * They will disappear after page refresh.
   *
   * BACKEND:
   * Later replace this initial state with:
   * GET /api/settings
   * to load settings from the database.
   */
  const [settings, setSettings] = useState(defaultSettings);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [message, setMessage] = useState({
    text: "",
    type: "",
  });
  const [accountingMessage, setAccountingMessage] = useState("");
  const [socialErrors, setSocialErrors] = useState({});



  // =========================================
  // GLOBAL SEARCH
  // =========================================

  const handleGlobalSearch = (value) => {
    const q = value.trim().toLowerCase();

    if (!q) return;

    // Settings tabs
    if (
      ["company", "company info", "business", "profile"].some(
        (word) => q.includes(word)
      )
    ) {
      setActiveTab("company");
      return;
    }

    if (
      ["design", "theme", "cms", "color", "colors", "website"].some(
        (word) => q.includes(word)
      )
    ) {
      setActiveTab("design");
      return;
    }

    if (
      ["integration", "integrations", "jazzcash", "smtp", "email", "maps"].some(
        (word) => q.includes(word)
      )
    ) {
      setActiveTab("integrations");
      return;
    }

    if (
      ["social", "analytics", "facebook", "instagram", "linkedin", "youtube"].some(
        (word) => q.includes(word)
      )
    ) {
      setActiveTab("social");
      return;
    }

    if (
      ["security", "password", "admin password", "login"].some(
        (word) => q.includes(word)
      )
    ) {
      setActiveTab("security");
      return;
    }

    if (
      ["numbering", "quote number", "invoice number", "terms"].some(
        (word) => q.includes(word)
      )
    ) {
      setActiveTab("numbering");
      return;
    }

    // Other ERP modules
    if (
      ["order", "orders"].some((word) => q.includes(word))
    ) {
      navigate("/orders");
      return;
    }

    if (
      ["employee", "employees", "staff", "team"].some(
        (word) => q.includes(word)
      )
    ) {
      navigate("/employees");
      return;
    }

    if (
      ["attendance"].some((word) => q.includes(word))
    ) {
      navigate("/attendance");
      return;
    }

    if (
      ["customer", "customers", "lead", "leads", "crm"].some(
        (word) => q.includes(word)
      )
    ) {
      navigate("/crm");
      return;
    }

    if (
      ["product", "products", "stock", "inventory"].some(
        (word) => q.includes(word)
      )
    ) {
      navigate("/products");
      return;
    }

    if (
      ["account", "accounting", "invoice", "expense", "payable"].some(
        (word) => q.includes(word)
      )
    ) {
      navigate("/accounting");
      return;
    }

    if (
      ["price", "pricing", "rate"].some(
        (word) => q.includes(word)
      )
    ) {
      navigate("/pricemonitor");
      return;
    }

    alert("No matching result found.");
  };



  // =========================
  // CENTRAL NOTIFICATIONS
  // =========================

  const unreadNotifications = notifications.filter(
    (notification) =>
      !readNotifications.includes(notification.id)
  );

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2500);
  };

  /*
   * BACKEND:
   * No localStorage is used here.
   *
   * When backend is ready, each Save function below should
   * send the relevant settings to the backend API/database.
   *
   * Example future API:
   * PUT /api/settings/company
   * PUT /api/settings/design
   * PUT /api/settings/integrations
   * PUT /api/settings/social
   * PUT /api/settings/numbering
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Design & CMS theme live preview
    if (name === "primaryColor") {
      document.documentElement.style.setProperty("--b", value);

      // Primary color ke related shades
      document.documentElement.style.setProperty("--bm", value);
      document.documentElement.style.setProperty("--bd", value);
      document.documentElement.style.setProperty("--bdk", value);

      // Sidebar bhi primary theme se connected
      document.documentElement.style.setProperty("--sidebar-bg", value);
    }

    if (name === "accentColor") {
      document.documentElement.style.setProperty("--a", value);
      document.documentElement.style.setProperty("--ad", value);
    }
  };




  const saveCompany = () => {
    if (!settings.companyName.trim()) {
      showMessage("Company name is required", "error");
      return;
    }

    /*
     * BACKEND:
     * Save company information to database.
     *
     * Suggested API:
     * PUT /api/settings/company
     *
     * Send:
     * {
     *   companyName,
     *   email,
     *   phone,
     *   website,
     *   address,
     *   whatsapp,
     *   adminPass
     * }
     */

    showMessage("Company info saved!");
  };






  const uploadLogo = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("Please select an image file", "error");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const updatedSettings = {
        ...settings,
        logo: event.target.result,
      };

      setSettings(updatedSettings);

      /*
       * BACKEND:
       * Upload company logo to backend/storage.
       *
       * Suggested API:
       * POST /api/settings/company/logo
       *
       * Recommended:
       * Use FormData and upload the original image file.
       * Backend should store the file and return its URL.
       */

      showMessage("Logo uploaded!");
    };

    reader.readAsDataURL(file);
  };





  const removeLogo = () => {
    const updatedSettings = {
      ...settings,
      logo: "",
    };

    setSettings(updatedSettings);

    /*
     * BACKEND:
     * Remove/delete company logo from backend storage.
     *
     * Suggested API:
     * DELETE /api/settings/company/logo
     */

    showMessage("Logo removed");
  };





  const saveDesign = () => {
    // Apply theme colors to complete ERP dashboard
    document.documentElement.style.setProperty(
      "--b",
      settings.primaryColor
    );

    document.documentElement.style.setProperty(
      "--a",
      settings.accentColor
    );

    // BACKEND:
    // PUT /api/settings/design
    // send primaryColor, accentColor, heroTitle,
    // heroSub, announce, whatsapp

    showMessage("Design settings applied successfully!");
  };





  const restoreDefaultTheme = () => {
    const defaultPrimary = "#0A3D62";
    const defaultAccent = "#F0A500";

    // Restore original/default theme in frontend
    setSettings((prev) => ({
      ...prev,
      primaryColor: defaultPrimary,
      accentColor: defaultAccent,
    }));

    // Apply original theme immediately
    document.documentElement.style.setProperty(
      "--b",
      defaultPrimary
    );

    document.documentElement.style.setProperty(
      "--bm",
      "#1565a8"
    );

    document.documentElement.style.setProperty(
      "--bl",
      "#dbeafe"
    );

    document.documentElement.style.setProperty(
      "--bd",
      "#071f35"
    );

    document.documentElement.style.setProperty(
      "--bdk",
      "#040e1a"
    );

    document.documentElement.style.setProperty(
      "--a",
      defaultAccent
    );

    document.documentElement.style.setProperty(
      "--al",
      "#FFF4D6"
    );

    document.documentElement.style.setProperty(
      "--ad",
      "#c07d00"
    );

    // Restore sidebar to original/default theme
    document.documentElement.style.setProperty(
      "--sidebar-bg",
      "#061321"
    );

    // BACKEND:
    // PUT /api/settings/design/reset
    // Backend should restore the original/default theme values
    // in MySQL:
    // primaryColor = "#0A3D62"
    // accentColor = "#F0A500"
    // and related theme colors/shades.

    showMessage("Default theme restored!");
  };





  const saveJazzCash = () => {
    /*
     * FRONTEND:
     * Validate the required JazzCash configuration fields.
     */

    if (!settings.jzMid.trim()) {
      showMessage("Please enter JazzCash Merchant ID", "error");
      return;
    }

    if (!settings.jzPassword.trim()) {
      showMessage("Please enter JazzCash Merchant Password", "error");
      return;
    }

    if (!settings.jzSalt.trim()) {
      showMessage("Please enter JazzCash Integrity Salt", "error");
      return;
    }

    /*
     * BACKEND TODO:
     *
     * JazzCash cannot be connected securely from React frontend.
     * When PHP/MySQL backend is ready:
     *
     * PUT /api/settings/integrations/jazzcash
     *
     * Backend should securely store:
     * - Merchant ID
     * - Mode
     * - Merchant Password
     * - Integrity Salt
     *
     * IMPORTANT:
     * Password and Integrity Salt must NOT be stored
     * in localStorage or exposed to the customer website.
     */

    showMessage("JazzCash configuration is valid!");
  };





  const saveSMTP = () => {
    /*
     * FRONTEND:
     * Validate the required SMTP configuration fields.
     */

    if (!settings.smtpHost.trim()) {
      showMessage("Please enter SMTP Host", "error");
      return;
    }

    if (!settings.smtpPort.trim()) {
      showMessage("Please enter SMTP Port", "error");
      return;
    }

    if (!settings.smtpUsername.trim()) {
      showMessage("Please enter SMTP Username", "error");
      return;
    }

    if (!settings.smtpPassword.trim()) {
      showMessage("Please enter SMTP Password", "error");
      return;
    }

    /*
     * BACKEND TODO:
     *
     * SMTP cannot be securely connected from the React frontend.
     * When PHP/MySQL backend is ready:
     *
     * PUT /api/settings/integrations/smtp
     *
     * Backend should securely store:
     * - SMTP Host
     * - SMTP Port
     * - SMTP Username
     * - SMTP Password
     *
     * IMPORTANT:
     * SMTP password must NOT be stored in localStorage
     * or exposed to the customer-facing website.
     *
     * Backend will use these credentials to send:
     * - Quotation emails
     * - Invoice emails
     * - Payment notifications
     * - Other ERP emails
     */

    showMessage("SMTP configuration is valid!");
  };

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





  const saveGoogleMaps = () => {
    /*
     * FRONTEND:
     * Validate the Google Maps API key.
     */

    if (!settings.googleMapsKey.trim()) {
      showMessage("Please enter Google Maps API key", "error");
      return;
    }

    /*
     * BACKEND TODO:
     *
     * When PHP/MySQL backend is ready:
     *
     * PUT /api/settings/integrations/google-maps
     *
     * Backend should securely manage the Google Maps API key.
     *
     * IMPORTANT:
     * The API key should be properly restricted in
     * Google Cloud Console according to its usage.
     *
     * Backend / website will use this integration for:
     * - Employee location tracking
     * - Map display
     * - Approved work zones
     * - Location-based attendance features
     */

    showMessage("Google Maps API key is valid!");
  };













  const saveSocial = () => {
    const errors = {};

    // =========================
    // REQUIRED FIELDS
    // =========================

    if (!settings.facebook.trim()) {
      errors.facebook = "This field is required";
    }

    if (!settings.instagram.trim()) {
      errors.instagram = "This field is required";
    }

    if (!settings.whatsappBusiness.trim()) {
      errors.whatsappBusiness = "This field is required";
    }

    if (!settings.linkedin.trim()) {
      errors.linkedin = "This field is required";
    }

    if (!settings.youtube.trim()) {
      errors.youtube = "This field is required";
    }

    if (!settings.tiktok.trim()) {
      errors.tiktok = "This field is required";
    }

    if (!settings.facebookPixel.trim()) {
      errors.facebookPixel = "This field is required";
    }

    if (!settings.googleAnalytics.trim()) {
      errors.googleAnalytics = "This field is required";
    }

    // =========================
    // URL VALIDATION
    // =========================

    if (
      settings.facebook.trim() &&
      !/^https?:\/\/.+/i.test(settings.facebook.trim())
    ) {
      errors.facebook = "Please enter a valid Facebook URL";
    }

    if (
      settings.instagram.trim() &&
      !/^https?:\/\/.+/i.test(settings.instagram.trim())
    ) {
      errors.instagram = "Please enter a valid Instagram URL";
    }

    if (
      settings.linkedin.trim() &&
      !/^https?:\/\/.+/i.test(settings.linkedin.trim())
    ) {
      errors.linkedin = "Please enter a valid LinkedIn URL";
    }

    if (
      settings.youtube.trim() &&
      !/^https?:\/\/.+/i.test(settings.youtube.trim())
    ) {
      errors.youtube = "Please enter a valid YouTube URL";
    }

    if (
      settings.tiktok.trim() &&
      !/^https?:\/\/.+/i.test(settings.tiktok.trim())
    ) {
      errors.tiktok = "Please enter a valid TikTok URL";
    }

    // =========================
    // WHATSAPP VALIDATION
    // =========================

    if (
      settings.whatsappBusiness.trim() &&
      !/^\d{10,15}$/.test(settings.whatsappBusiness.trim())
    ) {
      errors.whatsappBusiness =
        "Please enter a valid WhatsApp Business number";
    }

    // =========================
    // GOOGLE ANALYTICS
    // =========================

    if (
      settings.googleAnalytics.trim() &&
      !/^G-[A-Z0-9]+$/i.test(settings.googleAnalytics.trim())
    ) {
      errors.googleAnalytics =
        "Please enter a valid Google Analytics ID";
    }

    // =========================
    // FACEBOOK PIXEL
    // =========================

    if (
      settings.facebookPixel.trim() &&
      !/^\d+$/.test(settings.facebookPixel.trim())
    ) {
      errors.facebookPixel =
        "Please enter a valid Facebook Pixel ID";
    }

    // Show ALL errors together
    setSocialErrors(errors);

    // Stop saving if there are errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    /*
     * BACKEND TODO:
     *
     * When PHP/MySQL backend is ready:
     *
     * PUT /api/settings/social
     *
     * Backend should save:
     * - Facebook URL
     * - Instagram URL
     * - WhatsApp Business number
     * - LinkedIn URL
     * - YouTube URL
     * - TikTok URL
     * - Facebook Pixel ID
     * - Google Analytics ID
     *
     * These settings will later be loaded by the
     * customer-facing website.
     */

    showMessage("Social & Analytics settings saved!");
  };









  const changePassword = () => {
    const current = passwordData.current.trim();
    const newPassword = passwordData.newPassword;
    const confirm = passwordData.confirm;

    // =========================
    // FRONTEND VALIDATION
    // =========================

    if (!current) {
      showMessage("Enter current password", "error");
      return;
    }

    /*
     * FRONTEND DEVELOPMENT MODE:
     *
     * At the moment there is no backend authentication system.
     * Therefore, the current password is temporarily checked
     * against settings.adminPass.
     *
     * IMPORTANT:
     * This is ONLY for frontend testing.
     * It must be removed when the PHP/MySQL backend is connected.
     */

    if (!settings.adminPass) {
      showMessage(
        "No current password is set. Set Admin Panel Password in Company first.",
        "error"
      );
      return;
    }

    if (current !== settings.adminPass) {
      showMessage("Current password is incorrect", "error");
      return;
    }

    if (!newPassword) {
      showMessage("Enter new password", "error");
      return;
    }

    if (newPassword.length < 6) {
      showMessage(
        "Password must be at least 6 characters",
        "error"
      );
      return;
    }

    if (!confirm) {
      showMessage("Confirm your new password", "error");
      return;
    }

    if (newPassword !== confirm) {
      showMessage("Passwords do not match", "error");
      return;
    }



    setSettings((prev) => ({
      ...prev,
      adminPass: newPassword,
    }));

    // Clear password fields after successful change
    setPasswordData({
      current: "",
      newPassword: "",
      confirm: "",
    });

    showMessage("Password changed successfully!");
  };







  const EyeIcon = ({ hidden = false }) => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Eye shape */}
      <path
        d="M2.5 12C4.5 8.5 8 6.5 12 6.5C16 6.5 19.5 8.5 21.5 12C19.5 15.5 16 17.5 12 17.5C8 17.5 4.5 15.5 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Eye pupil */}
      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      {/* Slash when password is hidden */}
      {hidden && (
        <path
          d="M4 4L20 20"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      )}
    </svg>
  );













  const saveNumbering = () => {
    const updatedSettings = {
      ...settings,
      nextQ: parseInt(settings.nextQ) || 1001,
      nextI: parseInt(settings.nextI) || 1001,
      quoteValidity: parseInt(settings.quoteValidity) || 7,
    };

    setSettings(updatedSettings);

    /*
 * BACKEND:
 * Save document numbering and quotation terms.
 *
 * Suggested API:
 * PUT /api/settings/numbering
 *
 * These values will later be used by:
 * - Quotes
 * - LPO
 * - Invoices
 * - Terms & Conditions
 *
 * Backend should generate unique sequential document numbers
 * to prevent duplicate Quote/Invoice numbers when multiple
 * users create documents at the same time.
 */

    showMessage("Numbering & terms saved!");
  };




  const accountingSoftware = [
    "QuickBooks",
    "Xero",
    "Zoho Books",
    "Tally ERP",
  ];






  const securityItems = [
    ["Session Timeout", "2 hours inactivity", "backend"],
    ["HTTPS Enforcement", "Redirect all HTTP to HTTPS", "backend"],
    ["Brute Force Protection", "5 failed attempts → lockout", "backend"],
    ["CSRF Protection", "All forms protected", "backend"],
    ["SQL Injection Prevention", "Prepared statements throughout", "backend"],
    ["Audit Logging", "All admin actions logged", "backend"],
    ["PCI DSS Ready", "Payment security standards", "backend"],
  ];
  // =====================================================
  // BACKEND TODO - SECURITY IMPLEMENTATION
  // These security features are currently frontend-only.
  // Implement them properly when PHP/MySQL backend is added.
  //
  // 1. Session Timeout
  //    - Implement server-side session expiration after
  //      2 hours of inactivity.
  //
  // 2. HTTPS Enforcement
  //    - Configure server to redirect HTTP requests to HTTPS.
  //
  // 3. Brute Force Protection
  //    - Track failed login attempts on the server.
  //    - Lock the account after 5 failed attempts.
  //    - Add proper unlock/reset mechanism.
  //
  // 4. CSRF Protection
  //    - Generate and validate CSRF tokens for all
  //      state-changing forms/API requests.
  //
  // 5. SQL Injection Prevention
  //    - Use PHP prepared statements / parameterized queries
  //      for all MySQL queries.
  //
  // 6. Audit Logging
  //    - Store important admin actions in a database table,
  //      including user, action, date/time and relevant details.
  //
  // 7. PCI DSS Ready
  //    - Review and implement required payment-security
  //      controls when real payment processing is connected.
  // =====================================================








  return (
    <>
     

        <div className="main">
          <div className="topbar">
            <div>
              <div className="tbh1">Settings</div>

              <div className="tbsub">
                Company, design & integrations
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
              <div className="tabs">
                <button
                  className={`tab ${activeTab === "company" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("company")}
                >
                  🏢 Company
                </button>

                <button
                  className={`tab ${activeTab === "design" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("design")}
                >
                  🎨 Design & CMS
                </button>

                <button
                  className={`tab ${activeTab === "integrations"
                    ? "active"
                    : ""
                    }`}
                  onClick={() =>
                    setActiveTab("integrations")
                  }
                >
                  🔌 Integrations
                </button>

                <button
                  className={`tab ${activeTab === "social" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("social")}
                >
                  📱 Social & Analytics
                </button>

                <button
                  className={`tab ${activeTab === "security" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("security")}
                >
                  🔐 Security
                </button>

                <button
                  className={`tab ${activeTab === "numbering"
                    ? "active"
                    : ""
                    }`}
                  onClick={() => setActiveTab("numbering")}
                >
                  🔢 Numbering
                </button>
              </div>

              {message.text && (
                <div
                  className={`al ${message.type === "error"
                    ? "ale"
                    : "als"
                    }`}
                  style={{ marginBottom: "1rem" }}
                >
                  {message.type === "error" ? "⚠️" : "✅"}{" "}
                  {message.text}
                </div>
              )}

              {activeTab === "company" && (
                <div className="g2">
                  <div className="card">
                    <div className="chd">
                      <h3>🏢 Company Info</h3>
                    </div>

                    <div className="cbd">
                      <div
                        className="fg2"
                        style={{ marginBottom: ".85rem" }}
                      >
                        <div className="fg">
                          <label>Company Name</label>
                          <input
                            name="companyName"
                            value={settings.companyName}
                            onChange={handleChange}
                            placeholder="Your company name"
                          />
                        </div>

                        <div className="fg">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            value={settings.email}
                            onChange={handleChange}
                            placeholder="company@email.com"
                          />
                        </div>

                        <div className="fg">
                          <label>Phone</label>
                          <input
                            name="phone"
                            value={settings.phone}
                            onChange={handleChange}
                            placeholder="+92..."
                          />
                        </div>

                        <div className="fg">
                          <label>Website</label>
                          <input
                            name="website"
                            value={settings.website}
                            onChange={handleChange}
                            placeholder="https://yourwebsite.com"
                          />
                        </div>

                        <div className="fg full">
                          <label>Address</label>
                          <textarea
                            name="address"
                            rows="2"
                            value={settings.address}
                            onChange={handleChange}
                            placeholder="Company address"
                          />
                        </div>

                        <div className="fg">
                          <label>WhatsApp Number</label>
                          <input
                            name="whatsapp"
                            value={settings.whatsapp}
                            onChange={handleChange}
                            placeholder="***********"
                          />
                        </div>

                        <div className="fg">
                          <label>
                            Admin Panel Password
                          </label>
                          <input
                            type="password"
                            name="adminPass"
                            value={settings.adminPass}
                            onChange={handleChange}
                            placeholder="Set admin password"
                          />
                        </div>
                      </div>

                      <button
                        className="btn bp"
                        onClick={saveCompany}
                      >
                        💾 Save Company Info
                      </button>
                    </div>
                  </div>

                  <div className="card">
                    <div className="chd">
                      <h3>🖼️ Company Logo</h3>
                    </div>

                    <div className="cbd">
                      <label
                        className="iud"
                        style={{
                          cursor: "pointer",
                          display: "block",
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={uploadLogo}
                          style={{ display: "none" }}
                        />

                        {!settings.logo && (
                          <>
                            <div
                              style={{
                                fontSize: "1.7rem",
                                opacity: ".3",
                              }}
                            >
                              🏢
                            </div>

                            <p>
                              Click to upload
                              <br />
                              PNG, JPG, SVG
                              <br />
                              Used in PDF & sidebar
                            </p>
                          </>
                        )}

                        {settings.logo && (
                          <img
                            src={settings.logo}
                            alt="Company Logo"
                            style={{
                              maxHeight: "120px",
                              maxWidth: "100%",
                              objectFit: "contain",
                              borderRadius: "6px",
                            }}
                          />
                        )}
                      </label>

                      <button
                        className="btn bgh bsm"
                        style={{
                          marginTop: ".5rem",
                          width: "100%",
                        }}
                        onClick={removeLogo}
                      >
                        Remove Logo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "design" && (
                <div className="card">
                  <div className="chd">
                    <h3>🎨 Website Design & CMS</h3>

                    <p
                      style={{
                        fontSize: ".7rem",
                        color: "var(--mu)",
                      }}
                    >
                      Changes apply to customer-facing website
                    </p>
                  </div>

                  <div className="cbd">
                    <div className="fg2">
                      <div className="fg">
                        <label>Primary Color</label>
                        <input
                          type="color"
                          name="primaryColor"
                          value={settings.primaryColor}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="fg">
                        <label>Accent Color</label>
                        <input
                          type="color"
                          name="accentColor"
                          value={settings.accentColor}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="fg">
                        <label>Hero Title</label>
                        <input
                          name="heroTitle"
                          value={settings.heroTitle}
                          onChange={handleChange}
                          placeholder="Welcome to our company"
                        />
                      </div>

                      <div className="fg">
                        <label>Hero Subtitle</label>
                        <input
                          name="heroSub"
                          value={settings.heroSub}
                          onChange={handleChange}
                          placeholder="Your subtitle"
                        />
                      </div>

                      <div className="fg full">
                        <label>Announcement Bar</label>
                        <input
                          name="announce"
                          value={settings.announce}
                          onChange={handleChange}
                          placeholder="Special announcement..."
                        />
                      </div>

                      <div className="fg">
                        <label>WhatsApp Number (displayed)</label>
                        <input
                          name="whatsapp"
                          value={settings.whatsapp}
                          onChange={handleChange}
                        />
                      </div>
                    </div>




                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "nowrap",
                      }}
                    >
                      <button
                        className="btn bp"
                        style={{ marginTop: ".9rem" }}
                        onClick={saveDesign}
                      >
                        💾 Apply to Website
                      </button>

                      <button
                        type="button"
                        onClick={restoreDefaultTheme}
                        style={{
                          marginTop: ".9rem",
                          background: "#fff",
                          color: "var(--b)",
                          border: "1.5px solid var(--b)",
                          borderRadius: "8px",
                          padding: "5px 5px",
                          fontWeight: "700",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--b)";
                          e.currentTarget.style.color = "#fff";
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.12)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#fff";
                          e.currentTarget.style.color = "var(--b)";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        ↩ Restore Default Theme
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "integrations" && (
                <div className="g2">
                  <div className="card">
                    <div className="chd">
                      <h3>💳 JazzCash Payment Gateway</h3>
                    </div>

                    <div className="cbd">
                      <div className="al ali">
                        ℹ️ Pre-wired for future integration.
                        Add credentials when ready to go live.
                      </div>

                      <div className="fg2">
                        <div className="fg">
                          <label>Merchant ID</label>
                          <input
                            name="jzMid"
                            value={settings.jzMid}
                            onChange={handleChange}
                            placeholder="Your JazzCash Merchant ID"
                          />
                        </div>

                        <div className="fg">
                          <label>Mode</label>
                          <select
                            name="jzMode"
                            value={settings.jzMode}
                            onChange={handleChange}
                          >
                            <option value="sandbox">
                              Sandbox (Test)
                            </option>
                            <option value="live">
                              Live (Production)
                            </option>
                          </select>
                        </div>

                        <div className="fg">
                          <label>Merchant Password</label>
                          <input
                            type="password"
                            name="jzPassword"
                            value={settings.jzPassword}
                            onChange={handleChange}
                            placeholder="Merchant Password"
                          />
                        </div>

                        <div className="fg">
                          <label>Integrity Salt</label>
                          <input
                            type="password"
                            name="jzSalt"
                            value={settings.jzSalt}
                            onChange={handleChange}
                            placeholder="Integrity Salt"
                          />
                        </div>
                      </div>

                      <button
                        className="btn bp bsm"
                        style={{ marginTop: ".75rem" }}
                        onClick={saveJazzCash}
                      >
                        💾 Save JazzCash
                      </button>
                    </div>
                  </div>

                  <div className="card">
                    <div className="chd">
                      <h3>📧 Email (SMTP)</h3>
                    </div>

                    <div className="cbd">
                      <div className="fg2">
                        <div className="fg">
                          <label>SMTP Host</label>
                          <input
                            name="smtpHost"
                            value={settings.smtpHost}
                            onChange={handleChange}
                            placeholder="mail.yourdomain.com"
                          />
                        </div>

                        <div className="fg">
                          <label>Port</label>
                          <input
                            name="smtpPort"
                            value={settings.smtpPort}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="fg">
                          <label>Username</label>
                          <input
                            name="smtpUsername"
                            value={settings.smtpUsername}
                            onChange={handleChange}
                            placeholder="email@domain.com"
                          />
                        </div>

                        <div className="fg">
                          <label>Password</label>
                          <input
                            type="password"
                            name="smtpPassword"
                            value={settings.smtpPassword}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <button
                        className="btn bp bsm"
                        style={{ marginTop: ".75rem" }}
                        onClick={saveSMTP}
                      >
                        💾 Save SMTP
                      </button>
                    </div>
                  </div>

                  <div className="card">
                    <div className="chd">
                      <h3>🗺️ Google Maps API</h3>
                    </div>

                    <div className="cbd">
                      <p
                        style={{
                          fontSize: ".79rem",
                          color: "var(--mu)",
                          marginBottom: ".75rem",
                        }}
                      >
                        Required for live employee location
                        tracking & map display on website.
                      </p>

                      <div className="fg">
                        <label>API Key</label>
                        <input
                          name="googleMapsKey"
                          value={settings.googleMapsKey}
                          onChange={handleChange}
                          placeholder="AIzaSy..."
                        />
                      </div>

                      <button
                        className="btn bp bsm"
                        style={{ marginTop: ".6rem" }}
                        onClick={saveGoogleMaps}
                      >
                        Save Key
                      </button>
                    </div>
                  </div>



                  {/* Accounting Software */}


                  <div className="card">
                    <div className="chd">
                      <h3>📊 Accounting Software</h3>
                    </div>

                    <div className="cbd">
                      {accountingMessage && (
                        <div
                          className="al ali"
                          style={{
                            marginBottom: ".75rem",
                          }}
                        >
                          ✅ {accountingMessage}
                        </div>
                      )}

                      {accountingSoftware.map((software) => (
                        <div
                          key={software}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: ".55rem",
                            background: "var(--bg)",
                            borderRadius: "8px",
                            marginBottom: ".35rem",
                            fontSize: ".8rem",
                            gap: ".75rem",
                          }}
                        >
                          <span>{software}</span>

                          <button
                            className="btn bp bsm"
                            onClick={() => {
                              /*
                               * BACKEND TODO:
                               *
                               * Each accounting software will have its own
                               * API/OAuth integration.
                               *
                               * When PHP backend is ready:
                               *
                               * POST /api/settings/integrations/accounting/connect
                               *
                               * Backend should:
                               * - Start OAuth/API connection
                               * - Store credentials securely
                               * - Sync customers
                               * - Sync invoices
                               * - Sync payments
                               * - Sync accounting transactions
                               */

                              setAccountingMessage(
                                `${software} integration is ready for backend connection!`
                              );

                              setTimeout(() => {
                                setAccountingMessage("");
                              }, 3000);
                            }}
                          >
                            Connect
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}


















              {activeTab === "social" && (
                <div className="card">
                  <div className="chd">
                    <h3>📱 Social Media & Analytics</h3>
                  </div>

                  <div className="cbd">
                    <div className="fg2">

                      {/* Facebook */}
                      <div className="fg">
                        <label>🔵 Facebook Page URL</label>

                        <input
                          name="facebook"
                          value={settings.facebook}
                          onChange={(e) => {
                            handleChange(e);

                            if (socialErrors.facebook) {
                              setSocialErrors((prev) => ({
                                ...prev,
                                facebook: "",
                              }));
                            }
                          }}
                          placeholder="https://facebook.com/..."
                        />

                        {socialErrors.facebook && (
                          <small
                            style={{
                              color: "#dc2626",
                              marginTop: "4px",
                              display: "block",
                            }}
                          >
                            {socialErrors.facebook}
                          </small>
                        )}
                      </div>

                      {/* Instagram */}
                      <div className="fg">
                        <label>🟣 Instagram URL</label>

                        <input
                          name="instagram"
                          value={settings.instagram}
                          onChange={(e) => {
                            handleChange(e);

                            if (socialErrors.instagram) {
                              setSocialErrors((prev) => ({
                                ...prev,
                                instagram: "",
                              }));
                            }
                          }}
                          placeholder="https://instagram.com/..."
                        />

                        {socialErrors.instagram && (
                          <small
                            style={{
                              color: "#dc2626",
                              marginTop: "4px",
                              display: "block",
                            }}
                          >
                            {socialErrors.instagram}
                          </small>
                        )}
                      </div>

                      {/* WhatsApp */}
                      <div className="fg">
                        <label>🟢 WhatsApp Business</label>

                        <input
                          name="whatsappBusiness"
                          value={settings.whatsappBusiness}
                          onChange={(e) => {
                            handleChange(e);

                            if (socialErrors.whatsappBusiness) {
                              setSocialErrors((prev) => ({
                                ...prev,
                                whatsappBusiness: "",
                              }));
                            }
                          }}
                          placeholder="***********"
                        />

                        {socialErrors.whatsappBusiness && (
                          <small
                            style={{
                              color: "#dc2626",
                              marginTop: "4px",
                              display: "block",
                            }}
                          >
                            {socialErrors.whatsappBusiness}
                          </small>
                        )}
                      </div>

                      {/* LinkedIn */}
                      <div className="fg">
                        <label>🔵 LinkedIn URL</label>

                        <input
                          name="linkedin"
                          value={settings.linkedin}
                          onChange={(e) => {
                            handleChange(e);

                            if (socialErrors.linkedin) {
                              setSocialErrors((prev) => ({
                                ...prev,
                                linkedin: "",
                              }));
                            }
                          }}
                          placeholder="https://linkedin.com/company/..."
                        />

                        {socialErrors.linkedin && (
                          <small
                            style={{
                              color: "#dc2626",
                              marginTop: "4px",
                              display: "block",
                            }}
                          >
                            {socialErrors.linkedin}
                          </small>
                        )}
                      </div>

                      {/* YouTube */}
                      <div className="fg">
                        <label>🔴 YouTube Channel</label>

                        <input
                          name="youtube"
                          value={settings.youtube}
                          onChange={(e) => {
                            handleChange(e);

                            if (socialErrors.youtube) {
                              setSocialErrors((prev) => ({
                                ...prev,
                                youtube: "",
                              }));
                            }
                          }}
                          placeholder="https://youtube.com/@..."
                        />

                        {socialErrors.youtube && (
                          <small
                            style={{
                              color: "#dc2626",
                              marginTop: "4px",
                              display: "block",
                            }}
                          >
                            {socialErrors.youtube}
                          </small>
                        )}
                      </div>

                      {/* TikTok */}
                      <div className="fg">
                        <label>⚫ TikTok Profile</label>

                        <input
                          name="tiktok"
                          value={settings.tiktok}
                          onChange={(e) => {
                            handleChange(e);

                            if (socialErrors.tiktok) {
                              setSocialErrors((prev) => ({
                                ...prev,
                                tiktok: "",
                              }));
                            }
                          }}
                          placeholder="https://tiktok.com/@..."
                        />

                        {socialErrors.tiktok && (
                          <small
                            style={{
                              color: "#dc2626",
                              marginTop: "4px",
                              display: "block",
                            }}
                          >
                            {socialErrors.tiktok}
                          </small>
                        )}
                      </div>

                      {/* Facebook Pixel */}
                      <div className="fg">
                        <label>📊 Facebook Pixel ID</label>

                        <input
                          name="facebookPixel"
                          value={settings.facebookPixel}
                          onChange={(e) => {
                            handleChange(e);

                            if (socialErrors.facebookPixel) {
                              setSocialErrors((prev) => ({
                                ...prev,
                                facebookPixel: "",
                              }));
                            }
                          }}
                          placeholder="For website conversion tracking"
                        />

                        {socialErrors.facebookPixel && (
                          <small
                            style={{
                              color: "#dc2626",
                              marginTop: "4px",
                              display: "block",
                            }}
                          >
                            {socialErrors.facebookPixel}
                          </small>
                        )}
                      </div>

                      {/* Google Analytics */}
                      <div className="fg">
                        <label>📈 Google Analytics ID</label>

                        <input
                          name="googleAnalytics"
                          value={settings.googleAnalytics}
                          onChange={(e) => {
                            handleChange(e);

                            if (socialErrors.googleAnalytics) {
                              setSocialErrors((prev) => ({
                                ...prev,
                                googleAnalytics: "",
                              }));
                            }
                          }}
                          placeholder="G-XXXXXXXXXX"
                        />

                        {socialErrors.googleAnalytics && (
                          <small
                            style={{
                              color: "#dc2626",
                              marginTop: "4px",
                              display: "block",
                            }}
                          >
                            {socialErrors.googleAnalytics}
                          </small>
                        )}
                      </div>

                    </div>

                    <button
                      className="btn bp"
                      style={{ marginTop: ".85rem" }}
                      onClick={saveSocial}
                    >
                      💾 Save Social Settings
                    </button>
                  </div>
                </div>
              )}











              {activeTab === "security" && (
                <div className="g2">
                  <div className="card">
                    <div className="chd">
                      <h3>🔐 Change Password</h3>
                    </div>

                    <div className="cbd">
                      <div className="fg1">


                        <div className="fg">
                          <label>Current Password</label>
                          <div style={{ position: "relative" }}>
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordData.current}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  current: e.target.value,
                                }))
                              }
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setShowCurrentPassword((prev) => !prev)
                              }
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                border: "none",
                                background: "transparent",
                                padding: 0,
                                cursor: "pointer",
                                color: "var(--mu)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <EyeIcon hidden={!showCurrentPassword} />
                            </button>
                          </div>
                        </div>


                        <div className="fg">
                          <label>New Password</label>

                          <div style={{ position: "relative" }}>
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  newPassword: e.target.value,
                                }))
                              }
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword((prev) => !prev)
                              }
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                border: "none",
                                background: "transparent",
                                padding: 0,
                                cursor: "pointer",
                                color: "var(--mu)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <EyeIcon hidden={!showNewPassword} />
                            </button>
                          </div>
                        </div>


                        <div className="fg">
                          <label>Confirm New Password</label>

                          <div style={{ position: "relative" }}>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordData.confirm}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  confirm: e.target.value,
                                }))
                              }
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                border: "none",
                                background: "transparent",
                                padding: 0,
                                cursor: "pointer",
                                color: "var(--mu)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <EyeIcon hidden={!showConfirmPassword} />
                            </button>
                          </div>
                        </div>
                      </div>




                      <button
                        className="btn bp"
                        style={{ marginTop: ".75rem" }}
                        onClick={changePassword}
                      >
                        🔐 Change Password
                      </button>
                    </div>
                  </div>

                  <div className="card">
                    <div className="chd">
                      <h3>🛡️ Security Status</h3>
                    </div>

                    <div className="cbd">
                      {securityItems.map(([label, description, status]) => (
                        <div
                          key={label}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: ".55rem",
                            background: "var(--bg)",
                            borderRadius: "8px",
                            marginBottom: ".35rem",
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: ".8rem" }}>
                              {label}
                            </strong>

                            <div
                              style={{
                                fontSize: ".68rem",
                                color: "var(--mu)",
                              }}
                            >
                              {description}
                            </div>
                          </div>

                          <span className="bdg">
                            {status === "frontend" ? "frontend" : "backend"}
                          </span>
                        </div>
                      ))}

                      <div className="al als mt1">
                        ✅ System is production-ready with
                        enterprise security standards.
                      </div>
                    </div>
                  </div>

                </div>

              )}























              {activeTab === "numbering" && (
                <div
                  className="card"
                  style={{ maxWidth: "480px" }}
                >
                  <div className="chd">
                    <h3>🔢 Document Numbering</h3>
                  </div>

                  <div className="cbd">
                    <div className="fg2">
                      <div className="fg">
                        <label>Next Quote Number</label>
                        <input
                          type="number"
                          name="nextQ"
                          value={settings.nextQ}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="fg">
                        <label>Next Invoice Number</label>
                        <input
                          type="number"
                          name="nextI"
                          value={settings.nextI}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="fg">
                        <label>Quote Validity (days)</label>
                        <input
                          type="number"
                          name="quoteValidity"
                          value={settings.quoteValidity}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="fg">
                        <label>Default Payment Terms</label>
                        <input
                          name="payTerms"
                          value={settings.payTerms}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="fg full">
                        <label>
                          Default Terms & Conditions
                        </label>
                        <textarea
                          name="terms"
                          rows="8"
                          value={settings.terms}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <button
                      className="btn bp"
                      style={{ marginTop: ".85rem" }}
                      onClick={saveNumbering}
                    >
                      💾 Save Numbering & Terms
                    </button>
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
    </>
  );
}

export default Settings;