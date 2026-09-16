import { Link } from "react-router-dom";

function ClothingCard({ item, buttonText, onButtonClick, disabled }) {
    return (
        <div className="clothing-card">
            <img src={item.image} alt={item.title}/>

            <div className="clothing-card-content">
                <p className="clothing-category">{item.category}</p>
                <h3>{item.title}</h3>

                <div className="clothing-info">
                    <span>Size: {item.size}</span>
                    <span>{item.condition}</span>
                </div>
                <p className="clothing-brand">{item.brand}</p>

                <Link to={`/item/${item._id}`} className="view-item-btn">View Details</Link>
                <button onClick={onButtonClick} className="save-btn" disabled={disabled} >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}

export default ClothingCard;