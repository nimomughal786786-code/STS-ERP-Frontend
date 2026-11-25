import { useState } from "react";

function ReviewReplyModal({ review, onClose, onSave }) {
  const [replyText, setReplyText] = useState(review?.adminReply || "");

  const handleSubmit = () => {
    onSave(replyText);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "420px",
          maxWidth: "90vw",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          padding: "1.5rem",
        }}
      >
        <h3 style={{ margin: "0 0 .3rem", fontSize: "1.05rem" }}>
          Reply to {review.customerName}
        </h3>

        <p
          style={{
            margin: "0 0 1rem",
            fontSize: ".8rem",
            color: "#666",
            fontStyle: "italic",
          }}
        >
          "{review.text}"
        </p>

        <textarea
          autoFocus
          rows={5}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply to the customer..."
          style={{
            width: "100%",
            resize: "vertical",
            padding: ".6rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: ".85rem",
            fontFamily: "inherit",
            marginBottom: "1.25rem",
            boxSizing: "border-box",
          }}
        />

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: ".6rem" }}
        >
          <button
            onClick={onClose}
            style={{
              padding: ".5rem 1.1rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "#f5f5f5",
              cursor: "pointer",
              fontSize: ".85rem",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: ".5rem 1.1rem",
              borderRadius: "8px",
              border: "none",
              background: "#1565a8",
              color: "#fff",
              cursor: "pointer",
              fontSize: ".85rem",
            }}
          >
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewReplyModal;