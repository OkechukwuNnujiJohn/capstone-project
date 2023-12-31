import React, { useContext, useState } from 'react';
import axios from 'axios';
import { RefreshContext } from '../Main/Main.JSX';
import { useNavigate } from 'react-router-dom';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { UserContext } from '../../../UserContext';
import { ItemsContext } from '../../../UserContext';
import './Uploadpage.css';

const Uploadpage = () => {
  const [itemsData, setItemsData] = useState({
    name: '',
    category: '',
    gender: '',
    brand: '',
    price: '',
    description: '',
    color: '',
    image: null
  });
  const [errors, setErrors] = useState([]);
  const setRefreshData = useContext(RefreshContext);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { item } = useContext(ItemsContext);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e) => {
    const inputValue = e.target.value.trim();

    if (e.target.name === 'category') {
      setItemsData({ ...itemsData, [e.target.name]: inputValue });
    } else if (e.target.name === 'price') {
      const formattedPrice = parseFloat(inputValue);
      setItemsData({ ...itemsData, [e.target.name]: formattedPrice });
    } else {
      setItemsData({ ...itemsData, [e.target.name]: inputValue });
    }
  };

  const handleFileChange = (e) => {
    setItemsData({ ...itemsData, image: e.target.files[0] });
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(itemsData).forEach(([key, value]) => formData.append(key, value));

      const response = await axios.post('http://localhost:3000/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        credentials: 'include'
      });

      if (response.status === 201) {
        const newItem = response.data;
        const updatedUser = { ...user };
        if (!updatedUser.itemsUploaded) {
          updatedUser.itemsUploaded = [];
        } updatedUser.itemsUploaded.push(newItem.id);
        newItem.UserId = updatedUser.id;
        await axios.put(`http://localhost:3000/users/${user.id}`, { itemsUploaded: updatedUser.itemsUploaded })
        const storedItems = JSON.parse(localStorage.getItem("uploadedItems")) || [];
        storedItems.push(newItem);
        localStorage.setItem("uploadedItems", JSON.stringify(storedItems));

        alert('Item submitted successfully!');
        setRefreshData(prev => !prev);
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const serverErrors = error.response.data.errors;
        const errorMessages = serverErrors.map(err => err.msg);
        setErrors(errorMessages);
      }
    }
  }

  return (
    <form onSubmit={handleFormSubmit} encType="multipart/form-data">
      <h2>Upload your Item</h2>
      <div className="upload-wrapper">
        {errors.map((error, index) => <p key={index} className="error">{error}</p>)}

        <div className='label-input-group'>
          <label>Name:</label>
          <input type="text" name="name" required onChange={handleInputChange} />
        </div>
        <div className='label-input-group'>
          <label>Category:</label>
          <input type="text" name="category" required onChange={handleInputChange} />
        </div>
        <div className='label-input-group'>
          <label>Gender:</label>
          <input type="text" name="gender" required onChange={handleInputChange} />
        </div>
        <div className='label-input-group'>
          <label>Brand:</label>
          <input type="text" name="brand" required onChange={handleInputChange} />
        </div>
        <div className='label-input-group'>
          <label>Price:</label>
          <input type="text" name="price" required onChange={handleInputChange} />
        </div>
        <div className='label-input-group'>
          <label>Description:</label>
          <textarea name="description" required onChange={handleInputChange} />
        </div>
        <div className='label-input-group'>
          <label>Color:</label>
          <input type="text" name="color" required onChange={handleInputChange} />
        </div>
        <div className='label-input-group'>
          <label>Image:</label>
          <input type="file" name="image" required onChange={handleFileChange} />
        </div>

        <div className="form-button-group">
          <button type="submit">Submit</button>
          <button className="close-btn" onClick={() => navigate('/')}>
            <IoIosCloseCircleOutline size={30} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Uploadpage;
