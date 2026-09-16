import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function SwapRequests({ wishlist }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the logged-in user
  const savedUser = localStorage.getItem("user");
  const currentUser = savedUser ? JSON.parse(savedUser) : null;

  // Get swap requests from MongoDB
  useEffect(() => {
    fetch("http://localhost:5000/api/swap-requests", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();

          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("Your login session has expired. Please login again.");
            window.location.href = "/login";

            return;
          }

          throw new Error(
            errorData.message || "Failed to fetch swap requests"
          );
        }

        return response.json();
      })
      .then((data) => {
        console.log("Swap requests from MongoDB:", data);
        setRequests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching swap requests:", error);
        setLoading(false);
      });
  }, []);

  // Accept / Reject request
  async function updateStatus(id, status) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/swap-requests/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          alert("Your login session has expired. Please login again.");
          window.location.href = "/login";

          return;
        }

        throw new Error(
          errorData.message || "Failed to update request"
        );
      }

      const updatedRequest = await response.json();

      // Update the screen immediately
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === updatedRequest._id
            ? updatedRequest
            : request
        )
      );

      console.log("Swap request updated:", updatedRequest);
    } catch (error) {
      console.error("Error updating swap request:", error);
      alert(error.message || "Failed to update swap request");
    }
  }

  return (
    <>
      <Navbar wishlist={wishlist} />

      <main className="swap-requests-page">

        <section className="swap-requests-header">
          <p>MANAGE YOUR EXCHANGES</p>

          <h1>Swap Requests</h1>

          <span>
            View and manage your clothing exchange requests.
          </span>
        </section>

        <section className="swap-requests-list">

          {loading ? (
            <div className="no-requests">
              <h2>Loading...</h2>
              <p>Loading swap requests from MongoDB.</p>
            </div>

          ) : requests.length === 0 ? (

            <div className="no-requests">
              <h2>No Swap Requests</h2>
              <p>You don't have any swap requests yet.</p>
            </div>

          ) : (

            requests.map((request) => {

              // Is the logged-in user the owner?
              const isOwner =
                currentUser &&
                request.ownerId === currentUser.id;

              // Is the logged-in user the requester?
              const isRequester =
                currentUser &&
                request.requesterId === currentUser.id;

              return (
                <div
                  className="swap-request-card"
                  key={request._id}
                >

                  <h2>{request.itemTitle}</h2>

                  {/* Owner information */}
                  {isRequester && (
                    <p>
                      <strong>Requested from:</strong>{" "}
                      {request.ownerName}
                    </p>
                  )}

                  {/* Requester information */}
                  {isOwner && (
                    <p>
                      <strong>Requested by:</strong>{" "}
                      {request.requesterName}
                    </p>
                  )}

                  <p>
                    <strong>Message:</strong>{" "}
                    {request.message}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}

                    <span
                      className={`status ${
                        request.status
                          ?.toLowerCase()
                          .replace(" ", "-")
                      }`}
                    >
                      {request.status || "Pending"}
                    </span>
                  </p>

                  {/* Only the OWNER can accept or reject */}
                  {isOwner &&
                    (!request.status ||
                      request.status === "Pending") && (

                    <div className="swap-action-buttons">

                      <button
                        className="accept-btn"
                        onClick={() =>
                          updateStatus(
                            request._id,
                            "Accepted"
                          )
                        }
                      >
                        ✓ Accept
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() =>
                          updateStatus(
                            request._id,
                            "Rejected"
                          )
                        }
                      >
                        ✕ Reject
                      </button>

                    </div>
                  )}

                </div>
              );
            })
          )}

        </section>

      </main>

      <Footer />
    </>
  );
}

export default SwapRequests;