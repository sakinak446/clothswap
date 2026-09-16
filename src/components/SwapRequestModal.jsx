import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SwapRequestModal({ item, onClose }) {
  const navigate = useNavigate();
  const savedUser = localStorage.getItem("user");
  const currentUser = savedUser ? JSON.parse(savedUser) : null;
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!currentUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        "https://clothswap-53da.onrender.com/api/swap-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            itemId: item._id,
            message: message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send swap request");
      }

      console.log("Swap request created:", data);

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error sending swap request:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="swap-modal">

        {!isSubmitted ? (
          <>
            <button
              className="close-modal-btn"
              onClick={onClose}
            >
              ×
            </button>

            <h2>Request Swap</h2>

            <p>Send a Swap request for:</p>

            <strong>{item.title}</strong>

            <form onSubmit={handleSubmit}>
              <label>Your Message</label>

              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write a message to the owner..."
                rows="5"
                required
              />

              <button
                type="submit"
                className="send-request-btn"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Swap Request"}
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>

            <h2>Request Sent!</h2>

            <p>
              Your swap request has been sent successfully.
            </p>

            <button
              className="send-request-btn"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default SwapRequestModal;