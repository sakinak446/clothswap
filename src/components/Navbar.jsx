import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";

function Navbar({ wishlist }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();

    // Get logged-in user from localStorage
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            return JSON.parse(savedUser);
        }

        return null;
    });

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("authChanged"));
        setCurrentUser(null);
        setIsMenuOpen(false);

        alert("Logged out successfully!");

        navigate("/login");
    }

    return (
        <header className="navbar">

            <div className="navbar-container">

                {/* Logo */}
                <Link to="/" className="logo">
                    Cloth<span>Swap</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="desktop-nav">
                    <Link to="/">Home</Link>

                    <Link to="/browse">
                        Browse Clothes
                    </Link>

                    <Link to="/mylistings">
                        MyListings
                    </Link>

                    <Link to="/wishlist">
                        Wishlist ({wishlist?.length || 0})
                    </Link>

                    <Link to="/add-item">
                        Add Item
                    </Link>

                    <Link to="/swap-request">
                        Swap Requests
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className="navbar-actions">

                    {currentUser ? (
                        <>
                            <span className="user-info">
                                <User size={18} />
                                {currentUser.name}
                            </span>

                            <button
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="login-btn"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="signup-btn"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}

                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <X size={24} />
                    ) : (
                        <Menu size={24} />
                    )}
                </button>

            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="mobile-nav">

                    <Link
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </Link>

                    <Link
                        to="/browse"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Browse Clothes
                    </Link>

                    <Link
                        to="/mylistings"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        MyListings
                    </Link>

                    <Link
                        to="/wishlist"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Wishlist ({wishlist?.length || 0})
                    </Link>

                    <Link
                        to="/add-item"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Add-item
                    </Link>

                    <Link
                        to="/swap-request"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Swap Requests
                    </Link>

                    {currentUser ? (
                        <>
                            <div className="mobile-user-info">
                                <User size={18} />
                                {currentUser.name}
                            </div>

                            <button
                                className="mobile-logout-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}

                </div>
            )}

        </header>
    );
}

export default Navbar;