import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../component/SideBar/sidebar";
import ReviewReplyModal from "../../../models/reviewreplymodal";

function Reviews({
  notifications = [],
  readNotifications = [],
  addNotification,
  markAllNotificationsRead,
}) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("pending");

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("sts_reviews");
    if (saved) return JSON.parse(saved);

    return [
      {
        id: "rv1",
        productName: "Inverex Nitrox 6.6KW",
        customerName: "Ahmed Raza",
        rating: 5,
        text: "Excellent installation! Solar engineers were very professional and the inverter is amazing. System performing perfectly.",
        status: "pending",
        date: "2026-08-27",
        adminReply: "",
      },
      {
        id: "rv2",
        productName: "Knox Battery 5.12kWh",
        customerName: "Tariq Mehmood",
        rating: 4,
        text: "Good battery providing 6+ hours backup. Fast delivery. Would recommend to others.",
        status: "pending",
        date: "2026-08-24",
        adminReply: "",
      },
      {
        id: "rv3",
        productName: "Hikvision 4MP Dome",
        customerName: "Sara Khalid",
        rating: 5,
        text: "Crystal clear footage day and night. Professional installation by the team.",
        status: "published",
        date: "2026-08-14",
        adminReply: "",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("sts_reviews", JSON.stringify(reviews));
  }, [reviews]);

  const [priceUpdates] = useState(() => {
    const saved = localStorage.getItem("sts_price_updates");
    return saved ? JSON.parse(saved) : [];
  });
  const pendingPriceCount = priceUpdates.filter(
    (p) => p.status === "pending"
  ).length;

  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info", duration = 2500) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const notificationArea = event.target.closest("[data-notification-area]");
      if (!notificationArea) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const totalReviews = reviews.length;

  // ══ CHANGED: avg rating now reflects PUBLISHED reviews only — this is what's live on the site ══
  const publishedReviews = reviews.filter((review) => review.status === "published");
  const avgRating = publishedReviews.length
    ? (
        publishedReviews.reduce((sum, review) => sum + review.rating, 0) /
        publishedReviews.length
      ).toFixed(1)
    : "0";

  const pendingCount = reviews.filter(
    (review) => review.status === "pending"
  ).length;

  const publishedCount = publishedReviews.length;

  const filteredReviews = reviews
    .filter((review) => review.status === activeTab)
    .filter((review) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        review.productName.toLowerCase().includes(term) ||
        review.customerName.toLowerCase().includes(term)
      );
    });

  const approveReview = (id) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, status: "published" } : review
      )
    );

    const review = reviews.find((r) => r.id === id);
    if (review) {
      addNotification?.({
        type: "review_published",
        title: "Review Published",
        message: `${review.customerName}'s review for ${review.productName} is now live.`,
        action: () => navigate("/reviews"),
      });
      showToast("Review published on website!", "success");
    }
  };

  const rejectReview = (id) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, status: "rejected" } : review
      )
    );
    showToast("Review rejected successfully", "info");
  };

  const restoreToPending = (id) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, status: "pending" } : review
      )
    );
    showToast("Review moved back to pending", "info");
  };

  const openReplyModal = (review) => {
    setReplyTarget(review);
  };

  const closeReplyModal = () => {
    setReplyTarget(null);
  };

  const handleSaveReply = (replyText) => {
    if (!replyText?.trim()) {
      showToast("Reply can't be empty", "error");
      return;
    }

    setReviews((prev) =>
      prev.map((review) =>
        review.id === replyTarget.id
          ? { ...review, adminReply: replyText }
          : review
      )
    );

    showToast(`Reply sent to ${replyTarget.customerName}`, "success");

    addNotification?.({
      type: "review_reply_sent",
      title: "Reply Sent",
      message: `You replied to ${replyTarget.customerName}'s review.`,
      action: () => navigate("/reviews"),
    });

    setReplyTarget(null);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const unreadNotifications = notifications.filter(
    (notification) => !readNotifications.includes(notification.id)
  );

  return (
    <div id="app">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <div>
            <div className="tbh1" id="TTL">
              Customer Reviews
            </div>
            <div className="tbsub" id="TSUB">
              Manage ratings & testimonials
            </div>
          </div>

          <div className="tbr">
            <input
              className="tsrch"
              placeholder="Search..."
              id="GSI"
              value={searchTerm}
              onInput={(e) => setSearchTerm(e.target.value)}
            />

            <button
              className="tibtn"
              title="Price updates"
              onClick={() => navigate("/pricemonitor")}
            >
              <span>💱</span>
              <span
                className={`ndot ${pendingPriceCount > 0 ? "show" : ""}`}
              ></span>
            </button>

            <button
              className="tibtn"
              title="New orders"
              onClick={() => navigate("/orders")}
            >
              <span>📦</span>
              <span className="ndot show" id="ND"></span>
            </button>

            <button
              className="tibtn"
              title="Notifications"
              data-notification-area
              onClick={() => setShowNotifications((prev) => !prev)}
              style={{ position: "relative" }}
            >
              <span>🔔</span>
              {unreadNotifications.length > 0 && (
                <span className="ndot show" id="NBD"></span>
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
                        notification.action();
                        setShowNotifications(false);
                      }}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        background: readNotifications.includes(notification.id)
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
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        {notification.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            <div id="TBA"></div>
          </div>
        </div>

        <div className="content">
          <div className="view active " id="v-reviews">
            <div className="kg">
              <div className="kpi" style={{ cursor: "default" }}>
                <div className="kico ia">⭐</div>
                <div>
                  <div className="kval">{avgRating}</div>
                  <div className="klbl">Avg Rating</div>
                </div>
              </div>

              <div className="kpi" style={{ cursor: "default" }}>
                <div className="kico ib">📝</div>
                <div>
                  <div className="kval">{totalReviews}</div>
                  <div className="klbl">Total Reviews</div>
                </div>
              </div>

              <div className="kpi" style={{ cursor: "default" }}>
                <div className="kico io">⏳</div>
                <div>
                  <div className="kval">{pendingCount}</div>
                  <div className="klbl">Pending</div>
                </div>
              </div>

              <div className="kpi" style={{ cursor: "default" }}>
                <div className="kico ig">✅</div>
                <div>
                  <div className="kval">{publishedCount}</div>
                  <div className="klbl">Published</div>
                </div>
              </div>
            </div>

            <div className="tabs">
              <button
                className={`tab ${activeTab === "pending" ? "active" : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                ⏳ Pending
              </button>

              <button
                className={`tab ${activeTab === "published" ? "active" : ""}`}
                onClick={() => setActiveTab("published")}
              >
                ✅ Published
              </button>

              <button
                className={`tab ${activeTab === "rejected" ? "active" : ""}`}
                onClick={() => setActiveTab("rejected")}
              >
                ❌ Rejected
              </button>
            </div>

            <div id="RVC">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <div className="rcard" key={review.id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: ".5rem",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: ".7rem", color: "var(--mu)" }}>
                          <span className={`bdg d-${review.status}`}>
                            {review.status}
                          </span>
                          <span
                            style={{ fontSize: ".7rem", color: "var(--mu)" }}
                          >
                            {" "}
                            · {formatDate(review.date)}
                          </span>
                        </div>

                        <div
                          style={{
                            fontFamily: "'Syne', sans-serif",
                            fontSize: ".85rem",
                            fontWeight: "700",
                            color: "var(--b)",
                            marginTop: ".15rem",
                          }}
                        >
                          {review.productName}
                        </div>
                      </div>
                    </div>

                    <div className="rstars">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>

                    <p
                      style={{
                        fontSize: ".82rem",
                        color: "var(--mu)",
                        lineHeight: "1.65",
                        marginBottom: ".55rem",
                        fontStyle: "italic",
                      }}
                    >
                      "{review.text}"
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".5rem",
                        fontSize: ".75rem",
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "var(--b)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: ".72rem",
                        }}
                      >
                        {review.customerName[0]}
                      </div>

                      <strong>{review.customerName}</strong>
                    </div>

                    {review.adminReply && (
                      <div
                        style={{
                          marginTop: ".55rem",
                          padding: ".55rem .7rem",
                          background: "#f1f5f9",
                          borderRadius: "8px",
                          fontSize: ".75rem",
                          color: "var(--b)",
                        }}
                      >
                        <strong>Your reply: </strong>
                        {review.adminReply}
                      </div>
                    )}

                    {activeTab === "pending" && (
                      <div
                        style={{
                          display: "flex",
                          gap: ".35rem",
                          marginTop: ".65rem",
                        }}
                      >
                        <button
                          className="btn bg2 bsm"
                          onClick={() => approveReview(review.id)}
                        >
                          ✅ Publish
                        </button>

                        <button
                          className="btn br2 bsm"
                          onClick={() => rejectReview(review.id)}
                        >
                          ✕ Reject
                        </button>

                        <button
                          className="btn bgh bsm"
                          onClick={() => openReplyModal(review)}
                        >
                          💬 Reply
                        </button>
                      </div>
                    )}

                    {/* ══ NEW: Published tab — let admin move back to pending or reject a mistakenly-published review ══ */}
                    {activeTab === "published" && (
                      <div
                        style={{
                          display: "flex",
                          gap: ".35rem",
                          marginTop: ".65rem",
                        }}
                      >
                        <button
                          className="btn bgh bsm"
                          onClick={() => restoreToPending(review.id)}
                        >
                          ↩ Move to Pending
                        </button>

                        <button
                          className="btn br2 bsm"
                          onClick={() => rejectReview(review.id)}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}

                    {activeTab === "rejected" && (
                      <div
                        style={{
                          display: "flex",
                          gap: ".35rem",
                          marginTop: ".65rem",
                        }}
                      >
                        <button
                          className="btn bgh bsm"
                          onClick={() => restoreToPending(review.id)}
                        >
                          ↩ Move to Pending
                        </button>

                        <button
                          className="btn bg2 bsm"
                          onClick={() => approveReview(review.id)}
                        >
                          ✅ Publish
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty">
                  <div className="eico">⭐</div>
                  <h3>No {activeTab} reviews</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {replyTarget && (
        <ReviewReplyModal
          review={replyTarget}
          onClose={closeReplyModal}
          onSave={handleSaveReply}
        />
      )}

      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          zIndex: 100,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: t.type === "error" ? "#dc2626" : "#111827",
              color: "#fff",
              padding: "0.65rem 1rem",
              borderRadius: "8px",
              fontSize: ".8rem",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            {t.type === "success" ? "✅" : t.type === "error" ? "⚠️" : "ℹ️"}{" "}
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;