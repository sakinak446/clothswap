import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState , useEffect} from "react";
import Home from "./pages/Home";
import BrowseItems from "./pages/BrowseItems";
import ItemDetails from "./pages/ItemDetails";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import Wishlist from "./pages/Wishlist";
import MyListings from "./pages/MyListings";
import SwapRequest from "./pages/SwapRequest";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [items, setItems] = useState([]);
  const [authVersion, setAuthVersion] = useState(0);

  useEffect(() => {
    function handleAuthChange() {
      setAuthVersion((version) => version + 1);
    }

    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    fetch("https://clothswap-53da.onrender.com/api/items")
        .then((response) => response.json())
        .then((data) => {
            setItems(data);
        })
        .catch((error) => {
            console.error("Error fetching items:", error);
        });
  }, []);
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    setWishlist([]);
    return;
  }

  if (items.length === 0) {
    return;
  }

  fetch("https://clothswap-53da.onrender.com/api/wishlist", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch wishlist");
      }

      return data;
    })
    .then((wishlistRecords) => {
      const wishlistItems = wishlistRecords
        .map((wishlistRecord) =>
          items.find((item) => item._id === wishlistRecord.itemId)
        )
        .filter((item) => item);

      setWishlist(wishlistItems);

      console.log("Wishlist loaded from MongoDB:", wishlistItems);
    })
    .catch((error) => {
      console.error("Error loading wishlist:", error);
    });
  }, [items, authVersion]);
  const [wishlist, setWishlist] = useState([]);

  async function addToWishlist(item) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch("https://clothswap-53da.onrender.com/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: item._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add item to wishlist");
      }

      setWishlist((prevWishlist) => [...prevWishlist, item]);

      console.log("Wishlist item saved to MongoDB:", data);
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      alert(error.message || "Failed to add item to wishlist");
    }
  }
  async function removeWishlist(id) {
    if (!window.confirm("Remove this item from wishlist?")) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        `https://clothswap-53da.onrender.com/api/wishlist/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to remove item from wishlist"
        );
      }

      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item._id !== id)
      );

      console.log("Wishlist item removed from MongoDB:", data);
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      alert(error.message || "Failed to remove item from wishlist");
    }
  }

  function addNewItem(newItem) {
    setItems((prevItems) => [...prevItems, newItem]);
  }

  async function updateItem(updatedItem) {
    try {
      const response = await fetch(
        `https://clothswap-53da.onrender.com/api/items/${updatedItem._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(updatedItem),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          alert("Your login session has expired. Please login again.");

          window.location.href = "/login";

          return false;
        }

        throw new Error(errorData.message || "Failed to update item");
      }

      const savedItem = await response.json();

      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === savedItem._id ? savedItem : item
        )
      );
      console.log("Item updated successfully:", savedItem);
      return true;

    } catch (error) {
      console.error("Error updating item:", error);
      alert(error.message || "Failed to update item");
      return false;
    }
  }
  function removeDeletedItemFromWishlist(id) {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item._id !== id)
    );
  }
  async function deleteItem(id) {
    try {
      const response = await fetch(`https://clothswap-53da.onrender.com/api/items/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          alert("Your login session has expired. Please login again.");

          window.location.href = "/login";

          return;
        }

        throw new Error(errorData.message || "Failed to delete item");
      }

      setItems((prevItems) =>
        prevItems.filter((item) => item._id !== id)
      );
      removeDeletedItemFromWishlist(id);
      console.log("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(error.message || "Failed to delete item");
    }
  }
  function requireLogin(element) {
    const token = localStorage.getItem("token");

    if (!token) {
      return <Login />;
    }

    return element;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home wishlist={wishlist}/>} />
        <Route path="/browse" element={<BrowseItems items={items} wishlist={wishlist} addToWishlist={addToWishlist} />}/>
        <Route path="/item/:id" element={<ItemDetails items={items}  deleteItem={deleteItem} wishlist={wishlist}/>}/>
        <Route path="/add-item" element={requireLogin(<AddItem addNewItem={addNewItem} wishlist={wishlist}/>)}/>
        <Route path="/edit-item/:id" element={requireLogin(<EditItem items={items} updateItem={updateItem} wishlist={wishlist} />)}/>
        <Route path="/wishlist" element={requireLogin(<Wishlist wishlist={wishlist} removeWishlist={removeWishlist} /> )} />
        <Route path="/mylistings" element={requireLogin(<MyListings items={items} deleteItem={deleteItem} wishlist={wishlist} />)}/>
        <Route path="/swap-request" element={requireLogin(<SwapRequest wishlist={wishlist} />)}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;