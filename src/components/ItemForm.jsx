function ItemForm({formData, handleChange, handleSubmit, buttonText}){
    return(
        <>
            <form className="add-item-form edit-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Item Title</label>
                    <input
                        type="text" name="title" value={formData.title} onChange={handleChange} 
                        placeholder="Example: Blue Denim Jacket" required />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        <option value="Tops">Tops</option>
                        <option value="Bottoms">Bottoms</option>
                        <option value="Dresses">Dresses</option>
                        <option value="Jackets">Jackets</option>
                        <option value="Shoes">Shoes</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Size</label>
                    <select name="size" value={formData.size} onChange={handleChange} required>
                        <option value="">Select Size</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Condition</label>
                    <select name="condition" value={formData.condition} onChange={handleChange} required>
                        <option value="">Select Condition</option>
                        <option value="Like New">Like New</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Brand</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange}
                    placeholder="Example: Zara" required/>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your clothing item..."
                    rows="5"
                    required/>
                </div>

                <button type="submit" className="add-item-btn edit-submit-btn">{buttonText}</button>
            </form>
        </>
    );
}
export default ItemForm;