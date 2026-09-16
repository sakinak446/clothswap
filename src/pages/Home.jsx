import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home({ wishlist }) {
  return (
    <>
      <Navbar wishlist={wishlist} />

      <main className="home-page">

        {/* =========================
            HERO SECTION
        ========================= */}
        <section className="home-hero">
          <div className="home-hero-content">

            <p className="home-eyebrow">
              SUSTAINABLE FASHION COMMUNITY
            </p>

            <h1>
              Your clothes
              <br />
              deserve <span>another story.</span>
            </h1>

            <p className="home-hero-description">
              Swap clothes with people in your community, discover pieces
              you'll love, and give your wardrobe a more sustainable future.
            </p>

            <div className="home-hero-buttons">
              <Link to="/browse" className="home-primary-btn">
                Explore Clothes →
              </Link>

              <Link to="/add-item" className="home-secondary-btn">
                List Your Clothes
              </Link>
            </div>

            <div className="home-hero-note">
              <span>✦</span>
              Give more. Waste less. Swap better.
            </div>
          </div>

          <div className="home-hero-visual">

            <div className="hero-image-main">
              <img
                src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85"
                alt="Sustainable fashion"
              />
            </div>

            <div className="hero-floating-card hero-card-top">
              <span className="hero-card-icon">♻</span>
              <div>
                <strong>Wear it again</strong>
                <small>Keep fashion circular</small>
              </div>
            </div>

            <div className="hero-floating-card hero-card-bottom">
              <strong>Swap.</strong>
              <span>Don't shop.</span>
            </div>

            <div className="hero-circle"></div>
          </div>
        </section>


        {/* =========================
            INTRO / VALUE SECTION
        ========================= */}
        <section className="home-values">

          <div className="home-values-heading">
            <p className="home-section-label">WHY CLOTHSWAP?</p>

            <h2>
              Fashion feels better
              <br />
              when it has a <span>second life.</span>
            </h2>
          </div>

          <div className="home-values-grid">

            <div className="home-value-card">
              <div className="home-value-number">01</div>
              <div className="home-value-icon">♻</div>
              <h3>Swap Sustainably</h3>
              <p>
                Give clothes you no longer wear a new home instead of letting
                them sit unused.
              </p>
            </div>

            <div className="home-value-card">
              <div className="home-value-number">02</div>
              <div className="home-value-icon">✦</div>
              <h3>Discover Unique Pieces</h3>
              <p>
                Explore clothing from other people and find something
                different for your wardrobe.
              </p>
            </div>

            <div className="home-value-card">
              <div className="home-value-number">03</div>
              <div className="home-value-icon">♡</div>
              <h3>Build Community</h3>
              <p>
                Connect through clothing and make exchanges that keep fashion
                moving between people.
              </p>
            </div>

          </div>
        </section>


        {/* =========================
            HOW IT WORKS
        ========================= */}
        <section className="home-how-it-works">

          <div className="home-section-heading">
            <p className="home-section-label">HOW IT WORKS</p>

            <h2>
              Swap in three
              <br />
              simple steps.
            </h2>

            <p>
              From your wardrobe to someone else's, getting started is easy.
            </p>
          </div>

          <div className="home-steps">

            <div className="home-step">
              <div className="home-step-number">01</div>

              <div className="home-step-content">
                <h3>List</h3>
                <p>
                  Add clothes you no longer wear and tell the community
                  about them.
                </p>
              </div>
            </div>

            <div className="home-step">
              <div className="home-step-number">02</div>

              <div className="home-step-content">
                <h3>Discover</h3>
                <p>
                  Browse available pieces and find something that fits your
                  style.
                </p>
              </div>
            </div>

            <div className="home-step">
              <div className="home-step-number">03</div>

              <div className="home-step-content">
                <h3>Swap</h3>
                <p>
                  Send a swap request and start a new clothing exchange.
                </p>
              </div>
            </div>

          </div>
        </section>


        {/* =========================
            FINAL CTA
        ========================= */}
        <section className="home-final-cta">

          <div className="home-final-cta-inner">

            <div>
              <p className="home-section-label">READY TO SWAP?</p>

              <h2>
                Your wardrobe has
                <br />
                more stories to tell.
              </h2>

              <p>
                Discover your next favourite piece or give something you own
                a new beginning.
              </p>
            </div>

            <Link to="/browse" className="home-cta-button">
              Start Exploring →
            </Link>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default Home;