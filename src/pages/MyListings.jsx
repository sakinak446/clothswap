import ClothingCard from "../components/ClothingCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

function MyListings({ items, deleteItem, wishlist }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const myItems = items.filter(
    (item) => item.ownerId === user?.id
  );

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (confirmed) {
      deleteItem(id);
    }
  }

  return (
    <>
      <Navbar wishlist={wishlist} />

      <main className="my-listings-page">

        <section className="my-listings-header">
          <p className="section-label">YOUR CLOTHES</p>

          <h1>My Listings</h1>

          <p>
            Manage the clothing items you have listed for exchange.
          </p>
        </section>

        <section className="my-listings-section">

          {myItems.length > 0 ? (

            <div className="my-listings-grid">

              {myItems.map((item) => (

                <div className="my-listing-card" key={item._id}>

                  <ClothingCard
                    item={item}
                    buttonText="✏️ Edit Listing"
                    onButtonClick={() =>
                      navigate(`/edit-item/${item._id}`)
                    }
                  />

                  <button
                    className="delete-listing-btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    🗑️ Delete Listing
                  </button>

                </div>

              ))}

            </div>

          ) : (

            <div className="empty-listings">

              <h2>No listings yet</h2>

              <p>
                You haven't listed any clothes yet.
                Add your first item and give it a new life!
              </p>

              <Link
                to="/add-item"
                className="add-listing-btn"
              >
                + List Your Clothes
              </Link>

            </div>

          )}

        </section>

      </main>

      <Footer />
    </>
  );
}

export default MyListings;