import React, { use, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export default function AddProduct() {
  const [productData, setProductData] = useState({
    userId: '', 
    name: '',
    description: '',
    price: '', 
    photo: '', 
    category: '',
    reviews: [], 
  });

  const [newReview, setNewReview] = useState(''); 

  // --- Styles ---
  const pageContainerStyles = {
    fontFamily: 'Arial, sans-serif',
    padding: '30px',
    backgroundColor: '#f4f7f6',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    maxWidth: '800px', 
    margin: '30px auto', 
  };

  const headingStyles = {
    fontSize: '2em',
    color: '#333',
    marginBottom: '25px',
    textAlign: 'center',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px',
  };

  const formGroupStyles = {
    marginBottom: '20px',
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
    fontSize: '0.95em',
  };

  const inputStyles = {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1em',
    boxSizing: 'border-box', 
  };

  const textareaStyles = {
    ...inputStyles, 
    resize: 'vertical', 
    minHeight: '100px',
  };

  const selectStyles = {
    ...inputStyles,
    appearance: 'none', 
    paddingRight: '30px', 
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666' width='18px' height='18px'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  };

  const imagePreviewContainerStyles = {
    marginTop: '15px',
    marginBottom: '20px',
    textAlign: 'center',
  };

  const imagePreviewStyles = {
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '8px',
    border: '1px solid #eee',
  };

  const reviewsSectionStyles = {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  };

  const reviewListStyles = {
    listStyle: 'none',
    padding: 0,
    margin: '15px 0',
  };

  const reviewItemStyles = {
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    padding: '10px 15px',
    marginBottom: '10px',
    fontSize: '0.9em',
    color: '#666',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const removeReviewButtonStyles = {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 8px',
    cursor: 'pointer',
    fontSize: '0.75em',
    transition: 'background-color 0.2s ease',
  };

  const addReviewInputStyles = {
    ...inputStyles,
    width: 'calc(100% - 100px)', 
    marginRight: '10px',
    display: 'inline-block',
  };

  const addReviewButtonStyles = {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95em',
    transition: 'background-color 0.2s ease',
  };

  const submitButtonStyles = {
    width: '100%',
    padding: '15px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '30px',
    transition: 'background-color 0.2s ease',
  };

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 
  let user_Id = "";
  try {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    user_Id = decoded.id || decoded.userId || decoded.sub || "";
  } catch (e) {
    user_Id = "";
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductData((prevData) => ({
          ...prevData,
          photo: reader.result, 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReview = () => {
    if (newReview.trim()) {
      setProductData((prevData) => ({
        ...prevData,
        reviews: [...prevData.reviews, newReview.trim()],
      }));
      setNewReview(''); 
    }
  };

  const handleRemoveReview = (indexToRemove) => {
    setProductData((prevData) => ({
      ...prevData,
      reviews: prevData.reviews.filter((_, index) => index !== indexToRemove),
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData.name || !productData.price || !productData.category) {
      alert('Please fill in Name, Price, and Category.');
      return;
    }

    const submissionData = {
      ...productData,
      userId: user_Id, 
      price: parseFloat(productData.price), 
    };

    console.log('Submitting Product Data:', submissionData);


    try {
      const response = await fetch('http://localhost:8080/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify(submissionData), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); 
      toast.success(`Product "${data.name}" added successfully!`);
      // alert('Product added successfully!');

      setProductData({
        userId: user_Id,
        name: '',
        description: '',
        price: '',
        photo: '',
        category: '',
        reviews: [],
      });
      setNewReview('');

    } catch (error) {
      console.error('API Error:', error);
      toast.error(`Failed to add product: ${error.message}`);
      // alert(`Failed to add product: ${error.message}`);
    }
  };

  return (
    <div style={pageContainerStyles}>
      <h2 style={headingStyles}>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyles}>
          <label htmlFor="name" style={labelStyles}>Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleChange}
            style={inputStyles}
            required
          />
        </div>

        <div style={formGroupStyles}>
          <label htmlFor="description" style={labelStyles}>Description:</label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            style={textareaStyles}
          />
        </div>

        <div style={formGroupStyles}>
          <label htmlFor="price" style={labelStyles}>Price (₹):</label>
          <input
            type="number" 
            id="price"
            name="price"
            value={productData.price}
            onChange={handleChange}
            style={inputStyles}
            step="0.01" 
            required
          />
        </div>

        <div style={formGroupStyles}>
          <label htmlFor="photo" style={labelStyles}>Product Photo (URL or File):</label>
          <input
            type="text"
            id="photoUrl"
            name="photo"
            placeholder="Enter image URL"
            value={productData.photo.startsWith('http') ? productData.photo : ''} // Only show URL if it's a URL
            onChange={handleChange}
            style={inputStyles}
          />
          <span style={{ display: 'block', margin: '10px 0', textAlign: 'center', color: '#888' }}>OR</span>

          <input
            type="file"
            id="photoFile"
            accept="image/*"
            onChange={handleFileChange}
            style={inputStyles} 
          />
          {productData.photo && (
            <div style={imagePreviewContainerStyles}>
              <img src={productData.photo} alt="Product Preview" style={imagePreviewStyles} />
            </div>
          )}
        </div>

        <div style={formGroupStyles}>
          <label htmlFor="category" style={labelStyles}>Category:</label>
          <select
            id="category"
            name="category"
            value={productData.category}
            onChange={handleChange}
            style={selectStyles}
            required
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing-men">Men's Clothing</option>
            <option value="clothing-women">Women's Clothing</option>
            <option value="home-goods">Home Goods</option>
            <option value="books">Books</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={reviewsSectionStyles}>
          <h3 style={labelStyles}>Initial Reviews (Optional):</h3>
          <ul style={reviewListStyles}>
            {productData.reviews.map((review, index) => (
              <li key={index} style={reviewItemStyles}>
                {review}
                <button
                  type="button"
                  onClick={() => handleRemoveReview(index)}
                  style={removeReviewButtonStyles}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Add a review..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              style={addReviewInputStyles}
            />
            <button
              type="button"
              onClick={handleAddReview}
              style={addReviewButtonStyles}
            >
              Add Review
            </button>
          </div>
        </div>

        <button type="submit" style={submitButtonStyles}>
          Add Product
        </button>
      </form>
    </div>
  );
}