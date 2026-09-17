import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ItemForm from "../components/ItemForm";

function AddItem({wishlist, addNewItem }){

    const navigate = useNavigate();

    const[formData, setFormData] = useState({
        title:"",
        category:"",
        size:"",
        condition:"",
        brand:"",
        description:"",
        image: null,
    });

    function handleChange(event){
        const {name, value, files} = event.target;

        setFormData({
            ...formData,
            [name]: name === "image" ? files[0] : value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            alert("Please login first.");
            navigate("/login");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            let imageUrl = "";

            if (formData.image) {
                const imageData = new FormData();
                imageData.append("image", formData.image);

                const uploadResponse = await fetch(
                    "https://clothswap-53da.onrender.com/api/upload-image",
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        body: imageData
                    }
                );

                const uploadData = await uploadResponse.json();

                if (!uploadResponse.ok) {
                    throw new Error(uploadData.message || "Image upload failed");
                }

                imageUrl = uploadData.imageUrl;
            }

            // Send item details + Cloudinary image URL to our backend
            const itemData = {
                title: formData.title,
                category: formData.category,
                size: formData.size,
                condition: formData.condition,
                brand: formData.brand,
                description: formData.description,
            };

            if (imageUrl) {
                itemData.image = imageUrl;
            }

            const response = await fetch(
                "https://clothswap-53da.onrender.com/api/items",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(itemData)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    alert("Your login session has expired. Please login again.");
                    navigate("/login");

                    return;
                }

                throw new Error(errorData.message || "Failed to add item");
            }

            const newItem = await response.json();

            console.log("Item added:", newItem);

            addNewItem(newItem);

            navigate("/browse");

        } catch (error) {
            console.error("Error adding item:", error);
            alert(error.message || "Failed to add item");
        }
    }
    return(
        <>
            <Navbar  wishlist={wishlist} />
            
            <main className="add-item-page">
                <div className="add-item-container">
                    <h1>Add Your Clothing Item</h1>
                    <p>Add a clothing item that you want to exchange with others.</p>

                    <ItemForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit}
                    buttonText="Add Item" />
                </div>
            </main>
            <Footer />
        </>
    )
}
export default AddItem;