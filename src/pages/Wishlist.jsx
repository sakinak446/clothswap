import ClothingCard from "../components/ClothingCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Wishlist({ wishlist, removeWishlist }) {
  return (
    <>
      <Navbar wishlist={wishlist} />

      <main className="wishlist-page">
        <section className="wishlist-header">
          <p className="hero-label">YOUR FAVORITES</p>
          <h1>Your Wishlist</h1>
          <p>Items you've saved for your next clothing exchange.</p>
        </section>

        {wishlist.length === 0 ? (
          <section className="wishlist-empty">
            <h2>Your wishlist is empty</h2>
            <p>Browse clothes and save your favorite items here.</p>
          </section>
        ) : (
          <section className="wishlist-section">
            <div className="wishlist-grid">
              {wishlist.map((item) => (
                <div className="wishlist-card" key={item._id}>
                  <ClothingCard
                    item={item}
                    buttonText="✕ Remove"
                    onButtonClick={() =>
                      removeWishlist(item._id)
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Wishlist;