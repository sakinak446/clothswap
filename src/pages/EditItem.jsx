import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ItemForm from '../components/ItemForm';

function EditItem({ items , updateItem , wishlist}){
    const {id} = useParams();

    const navigate = useNavigate();

    const item = items.find((item) => item._id === id);

    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (item) {
            setFormData(item);
        }
    }, [item]);

    async function handleSubmit(event) {
        event.preventDefault();

        const success = await updateItem(formData);

        if (success) {
        navigate("/browse");
    }
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }
    if (!item || !formData) {
        return (
            <>
                <Navbar wishlist={wishlist} />
                <main className="edit-page">
                    <section className="edit-container">
                        <h1>Loading item...</h1>
                    </section>
                </main>
                <Footer />
            </>
        );
    }
    return(
        <>
            <Navbar wishlist={wishlist}/>
            <main className="edit-page">
                <section className="edit-container">

                    <div className="edit-header">
                    <p className="section-label">MANAGE YOUR LISTING</p>
                    <h1>Edit Clothing Item</h1>
                    <p>Update the details of your clothing item.</p>
                    </div>

                    <div className="edit-form">
                    <ItemForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} 
                                buttonText="Update Item" />
                    </div>

                </section>
                </main>
            <Footer />
        </>
    )
}
export default EditItem;