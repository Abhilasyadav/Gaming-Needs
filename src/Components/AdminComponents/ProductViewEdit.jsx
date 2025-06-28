import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ProductViewEdit({ product, onSave, onCancelEdit }) {


  const [isEditing, setIsEditing] = useState(false);
  const [editableProductData, setEditableProductData] = useState({});

  useEffect(() => {
    if (product) {
      setEditableProductData({
        ...product,
        price: product.price ? product.price.toString() : '',
      });
    }
  }, [product]);

  // --- Styles ---
  const pageContainerStyles = {
    fontFamily: 'Arial, sans-serif',
    padding: '30px',
    backgroundColor: '#fff',
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const dataRowStyles = {
    display: 'flex',
    marginBottom: '15px',
    alignItems: 'flex-start',
  };

  const labelStyles = {
    flexBasis: '150px', 
    fontWeight: 'bold',
    color: '#555',
    fontSize: '1em',
    marginRight: '20px',
    flexShrink: 0, 
  };

  const valueStyles = {
    flexGrow: 1,
    color: '#333',
    fontSize: '1em',
    wordBreak: 'break-word', 
  };

  const formGroupStyles = {
    marginBottom: '20px',
  };

  const inputLabelStyles = { 
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
    marginTop: '25px',
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

  const buttonContainerStyles = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '30px',
  };

  const editButtonStyles = {
    padding: '12px 25px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  const saveButtonStyles = {
    ...editButtonStyles,
    backgroundColor: '#28a745', 
  };

  const cancelButtonStyles = {
    ...editButtonStyles,
    backgroundColor: '#6c757d', 
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

  const tdStyles = {
    cursor: 'pointer', 
};


  // --- Handlers ---
  const handleEditClick = () => {
    setIsEditing(true);
    setEditableProductData(prev => ({
      ...prev,
      reviews: prev.reviews ? [...prev.reviews] : []
    }));
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditableProductData({
      ...product,
      price: product.price ? product.price.toString() : '',
    });
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditableProductData((prevData) => ({
          ...prevData,
          photo: reader.result, 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReview = () => {
    if (newReview.trim()) {
      setEditableProductData((prevData) => ({
        ...prevData,
        reviews: [...(prevData.reviews || []), newReview.trim()],
      }));
      setNewReview('');
    }
  };

  const handleRemoveReview = (indexToRemove) => {
    setEditableProductData((prevData) => ({
      ...prevData,
      reviews: (prevData.reviews || []).filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSaveClick = async () => {
    if (!editableProductData.name || !editableProductData.price || !editableProductData.category) {
      toast.error('Please fill in Name, Price, and Category.');
      return;
    }

    const savedData = {
      ...editableProductData,
      price: parseFloat(editableProductData.price), 
    };

    console.log('Attempting to save product data:', savedData);

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${API_BASE}/updateProduct`, {
        method: 'Post', 
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(savedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {

          errorMessage = `${errorMessage}: ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      const updatedProductData = await response.json(); 
      toast.success('Product updated successfully!',{
        backgroundColor: '#5CB338',
        color: '#fff',
      })
      console.log('Product updated successfully via API:', updatedProductData);


      if (onSave) {
        onSave(updatedProductData);
      }
      setIsEditing(false); 
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(`Failed to update product: ${error.message}`);
    }
  };

  const [newReview, setNewReview] = useState('');


  if (!product) {
    return (
      <div style={pageContainerStyles}>
        <h2 style={headingStyles}>Product Details</h2>
        <p style={{textAlign: 'center', color: '#888'}}>No product data available.</p>
      </div>
    );
  }

  return (
    <div style={pageContainerStyles}>
      <h2 style={headingStyles}>
        {isEditing ? 'Edit Product' : 'Product Details'}
        {!isEditing && (
          <button style={editButtonStyles} onClick={handleEditClick}>
            Edit
          </button>
        )}
      </h2>

      {isEditing ? (
        // --- Edit Form ---
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={formGroupStyles}>
            <label htmlFor="edit-name" style={inputLabelStyles}>Product Name:</label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={editableProductData.name || ''}
              onChange={handleInputChange}
              style={inputStyles}
              required
            />
          </div>

          <div style={formGroupStyles}>
            <label htmlFor="edit-description" style={inputLabelStyles}>Description:</label>
            <textarea
              id="edit-description"
              name="description"
              value={editableProductData.description || ''}
              onChange={handleInputChange}
              style={textareaStyles}
            />
          </div>

          <div style={formGroupStyles}>
            <label htmlFor="edit-price" style={inputLabelStyles}>Price (₹):</label>
            <input
              type="number"
              id="edit-price"
              name="price"
              value={editableProductData.price || ''}
              onChange={handleInputChange}
              style={inputStyles}
              step="0.01"
              required
            />
          </div>

          <div style={formGroupStyles}>
            <label htmlFor="edit-photo" style={inputLabelStyles}>Product Photo (URL or File):</label>
            <input
              type="text"
              id="edit-photoUrl"
              name="photo"
              placeholder="Enter image URL"
              value={editableProductData.photo && editableProductData.photo.startsWith('http') ? editableProductData.photo : ''}
              onChange={handleInputChange}
              style={inputStyles}
            />
            <span style={{ display: 'block', margin: '10px 0', textAlign: 'center', color: '#888' }}>OR</span>
            <input
              type="file"
              id="edit-photoFile"
              accept="image/*"
              onChange={handleFileChange}
              style={inputStyles}
            />
            {editableProductData.photo && (
              <div style={imagePreviewContainerStyles}>
                <img src={editableProductData.photo} alt="Product Preview" style={imagePreviewStyles} />
              </div>
            )}
          </div>

          <div style={formGroupStyles}>
            <label htmlFor="edit-category" style={inputLabelStyles}>Category:</label>
            <select
              id="edit-category"
              name="category"
              value={editableProductData.category || ''}
              onChange={handleInputChange}
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
            <h3 style={inputLabelStyles}>Reviews:</h3>
            <ul style={reviewListStyles}>
              {(editableProductData.reviews || []).map((review, index) => (
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
                placeholder="Add a new review..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                style={addReviewInputStyles}
              />
              <button
                type="button"
                onClick={handleAddReview}
                style={addReviewButtonStyles}
              >
                Add
              </button>
            </div>
          </div>

          <div style={buttonContainerStyles}>
            <button type="button" style={cancelButtonStyles} onClick={handleCancelClick}>
              Cancel
            </button>
            <button type="submit" style={saveButtonStyles} onClick={handleSaveClick}>
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        // --- View Mode ---
        <div>
          <div style={dataRowStyles}>
            <span style={labelStyles}>ID:</span>
            <span style={valueStyles}>{product.id}</span>
          </div>

          {product.photo && (
            <div style={imagePreviewContainerStyles}>
              <img src={product.photo} alt={product.name} style={imagePreviewStyles} />
            </div>
          )}

          <div style={dataRowStyles}>
            <span style={labelStyles}>Name:</span>
            <span style={valueStyles}>{product.name}</span>
          </div>

          <div style={dataRowStyles}>
            <span style={labelStyles}>Description:</span>
            <span style={valueStyles}>{product.description || 'N/A'}</span>
          </div>

          <div style={dataRowStyles}>
            <span style={labelStyles}>Price:</span>
            <span style={valueStyles}>₹{product.price ? product.price.toFixed(2) : 'N/A'}</span>
          </div>

          <div style={dataRowStyles}>
            <span style={labelStyles}>Category:</span>
            <span style={valueStyles}>{product.category || 'N/A'}</span>
          </div>

          <div style={reviewsSectionStyles}>
            <h3 style={labelStyles}>Reviews:</h3>
            <ul style={reviewListStyles}>
              {(product.reviews && product.reviews.length > 0) ? (
                product.reviews.map((review, index) => (
                  <li key={index} style={reviewItemStyles}>
                    {review}
                  </li>
                ))
              ) : (
                <li style={{...reviewItemStyles, justifyContent: 'center'}}>No reviews available.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}