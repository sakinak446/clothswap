import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home({wishlist}) {
  return (
    <>
        <Navbar wishlist={wishlist}/>
        <main>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <p className="hero-label">SUSTAINABLE FASHION COMMUNITY</p>

                    <h1>Give Your Clothes<span> A New Life</span></h1>

                    <p className="hero-description">Exchange clothes with people in your community.Discover unique styles and make fashion more sustainable.</p>

                    <div className="hero-buttons">
                        <Link to="/browse" className="primary-btn">Browse Clothes</Link>
                        <Link to="/add-item" className="secondary-btn">List Your Clothes</Link>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="image-placeholder">👕</div>
                </div>
            </section>


            {/* How It Works */}
            <section className="how-it-works">
                <div className="section-heading">
                    <p>HOW IT WORKS</p>
                    <h2>Swap. Style. Sustain.</h2>
                    <span>Three simple steps to give your clothes a new journey.</span>
                </div>


                <div className="steps-container">
                    <div className="step-card">
                        <div className="step-number">01</div>
                        <h3>List Your Clothes</h3>
                        <p>Upload photos and details of clothes you no longer wear.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">02</div>
                        <h3>Find Something You Like</h3>
                        <p>Browse unique clothing items from people in the community.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">03</div>
                        <h3>Make the Swap</h3>
                        <p>Send a request and exchange clothes with another user.</p>
                    </div>
                </div>
            </section>
        </main>
        <Footer />
    </>
  );
}

export default Home;