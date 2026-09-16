import { useParams, Link , useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SwapRequestModal from "../components/SwapRequestModal";

function ItemDetails({ items, deleteItem, wishlist }) {
  const { id } = useParams();

  const navigate = useNavigate();

  const savedUser = localStorage.getItem("user");
  const currentUser = savedUser ? JSON.parse(savedUser) : null;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const item = items.find((item) => item._id === id);

  const isOwner = currentUser && String(item?.ownerId) === String(currentUser.id);

    function handleEdit(){
        navigate(`/edit-item/${id}`);
    }
    async function handleDelete(){
        if (window.confirm("Are you sure you want to delete this item?")) {
            await deleteItem(id);
            navigate("/browse");
        }
    }
    if(!item){
        return(
            <>
                <Navbar wishlist={wishlist}/>
                <main className="item-not-found">
                    <h1>Item Not Found</h1>
                    <Link to="/browse">Back to Browse</Link>
                </main>
                <Footer />
            </>
        );
    }
    return(
        <>
            <Navbar wishlist={wishlist}/>
                <main className="item-details-page">
                    <Link to="/browse" className="back-link">← Back to Browse</Link>

                    <section className="item-details-container">
                        {/*Item image page */}
                        <div className="item-details-image">
                            <img src={item.image} alt={item.image}></img>
                        </div>

                        {/*Item informatrion */}
                        <div className="item-details-content">
                            <p className="clothing-category">{item.category}</p>
                            <h1>{item.title}</h1>
                            <p className="item-brand">Brand: {item.brand}</p>

                            <div className="item-info-list">
                                <div>
                                    <strong>Size</strong>
                                    <span>{item.size}</span>
                                </div>

                                <div>
                                    <strong>Condition</strong>
                                    <span>{item.condition}</span>
                                </div>

                                <div>
                                    <strong>Exchange Type</strong>
                                    <span>Clothing Swap</span>
                                </div>
                            </div>

                            <div className="item-description">
                                <h3>About This Item</h3>
                                <p>This clothing item is available for exchange.
                                Send a swap request to connect with the owner.</p>
                            </div>

                            {!isOwner && (
                                <button className="swap-request-btn" onClick={() => setIsModalOpen(true)}>
                                    Request Swap
                                </button>
                            )}
                            {isOwner && (
                                <>
                                    <button className="edit-btn" onClick={handleEdit}>Edit Item</button>
                                    <button className="delete-btn" onClick={handleDelete}>Delete Item</button>
                                </>
                            )}
                        </div>
                    </section>
                </main>
            <Footer />
            {isModalOpen && (
                <SwapRequestModal item={item} onClose = {() => setIsModalOpen(false)}/>
            )}
        </>
    );

}
export default ItemDetails;