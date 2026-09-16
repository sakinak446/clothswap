import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ClothingCard from "../components/ClothingCard";

function BrowseItems({addToWishlist, wishlist }) {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        fetch("https://clothswap-53da.onrender.com/api/items")
            .then((response) => response.json())
            .then((data) => {
                setItems(data);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // search input value
    const[searchTerm, setSearchTerm] = useState("");

    // selected category
    const[selectedCategory , setSelectedCategory] = useState("All");

    // selected size
    const[selectedSize, setSelectedSize] = useState("All");

    // filter clothing item
    const filteredItems = items.filter((item) =>{

        const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;

        const matchesSize = selectedSize === "All" || item.size === selectedSize;

        return(
            matchesSearch && matchesCategory && matchesSize 
        );

    })
    return (
        <>
            <Navbar wishlist={wishlist}/>
            <main className="browse-page">
                <section className="browse-header">
                    <p className="hero-label">EXPLORE THE COMMUNITY</p>
                    <h1>Browse Clothes</h1>
                    <p>Discover unique clothing items available for exchange.</p>
                </section>

                {/* Filters */}
                <section className="filters-section">
                    {/*Search */}
                    <div className="search-box">
                        <input type="text" placeholder="Search clothing..." value={searchTerm} 
                        onChange={(event) => setSearchTerm(event.target.value)}/>
                    </div>

                    {/*Category filter */}
                    <select value={selectedCategory} 
                    onChange={(event) => setSelectedCategory(event.target.value)}>
                        <option value= "All">
                            All Categories
                        </option>
                        <option value= "Jackets">
                            Jackets
                        </option>
                        <option value= "Dresses">
                            Dresses
                        </option>
                        <option value="Tops">
                            Tops
                        </option>
                        <option value="Bottoms">
                            Bottoms
                        </option>
                        <option value= "Shoes">
                            Shoes
                        </option>
                    </select>
                    
                    {/*size filter */}
                    <select value={selectedSize}
                    onChange={(event) => setSelectedSize(event.target.value)}>
                        <option value="All">All Sizes</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                    
                    {/*Reset */}
                    <button className="reset-btn" 
                    onClick={() =>{
                        setSearchTerm("");
                        setSelectedCategory("All");
                        setSelectedSize("All");
                    }}>Reset</button>

                </section>

                {/*Reset Count */}
                {!loading && (
                    <p className="results-count">
                        {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} found
                    </p>
                )}

                {/* Clothing Grid */}
                <section className="clothing-grid">
                    {loading ? (
                        <div className="no-results">
                            <h2>Loading clothes...</h2>
                            <p>Please wait while we load the available items.</p>
                        </div>
                    ) : filteredItems.length > 0 ? (
                        filteredItems.map((item) => {
                            const isSaved = wishlist.some(
                                (wish) => wish._id === item._id
                            );

                            return (
                                <ClothingCard
                                    key={item._id}
                                    item={item}
                                    buttonText={isSaved ? "❤️ Saved" : "♡ Save"}
                                    disabled={isSaved}
                                    onButtonClick={() => addToWishlist(item)}
                                />
                            );
                        })
                    ) : (
                        <div className="no-results">
                            <h2>😔 No items found</h2>
                            <p>Try changing your search or filters.</p>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}

export default BrowseItems;