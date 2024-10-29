import React, { useState, useEffect } from 'react';
import itemService from '../../services/itemService';
import { fetchSuppliers } from '../../services/supplierService';
import './ItemForm.css';
import { storage } from "../../Firebase/Config";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
const ItemForm = ({ onItemAdded }) => {
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
console.log(images,'images');

  const [item, setItem] = useState({
    name: '',
    location: '',
    brand: '',
    category: '',
    supplierId: '',
    unitPrice: '',
    stockUnit: '',
    status: 'Enabled',
    images:[]
  });
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchallSuppliers = async () => {
      const activeSuppliers = await fetchSuppliers();
      setSuppliers(activeSuppliers.data);
    };
    fetchallSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Upload images to Firebase and retrieve their URLs
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const imageName = `${uuidv4()}_${image.name}`;
        const imageRef = ref(storage, `images/${imageName}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        return imageUrl;
      })
    );
  
    // Update the item object with image URLs
    const updatedItem = { ...item, images: imageUrls };
  
    try {
      // Send updated item with image URLs to API
      await itemService.createItem(updatedItem);
      onItemAdded();
  
      // Reset form fields and image previews
      setItem({
        name: '',
        location: '',
        brand: '',
        category: '',
        supplierId: '',
        unitPrice: '',
        stockUnit: '',
        status: 'Enabled',
        images: []
      });
      setImages([]);
      setPreviewImages([]);
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => [...prevPreviews, ...previews]);
  };
  return (
    <div className="item-form-container">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label">Item Name</label>
        <input type="text" name="name" value={item.name} onChange={handleChange} placeholder="Item Name" required />

        <label className="form-label">Inventory Location</label>
        <input type="text" name="location" value={item.location} onChange={handleChange} placeholder="Inventory Location" />

        <label className="form-label">Brand</label>
        <input type="text" name="brand" value={item.brand} onChange={handleChange} placeholder="Brand" />

        <label className="form-label">Category</label>
        <input type="text" name="category" value={item.category} onChange={handleChange} placeholder="Category" />

        <label className="form-label">Supplier</label>
        <select name="supplierId" value={item.supplierId} onChange={handleChange}>
          <option value="" disabled>Select Supplier</option>
          {suppliers?.map((supplier) => (
            <option key={supplier.id} value={supplier?._id}>{supplier.name}</option>
          ))}
        </select>

        <label className="form-label">Unit Price</label>
        <input type="number" name="unitPrice" value={item.unitPrice} onChange={handleChange} placeholder="Unit Price" />

        <label className="form-label">Stock Unit</label>
        <select name="stockUnit" value={item.stockUnit} onChange={handleChange}>
          <option value="pcs">Pcs</option>
          <option value="kg">Kg</option>
          <option value="liters">Liters</option>
        </select>
        <div >
              <label htmlFor="productImages" >
                Product Images
              </label>
              <input
                type="file"
                id="productImages"
                onChange={handleImageChange}
                multiple
              />
            </div>
            <div >
              {previewImages?.map((src, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={src}
                    alt={`Preview ${index}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedPreviews = [...previewImages];
                      updatedPreviews.splice(index, 1);
                      setPreviewImages(updatedPreviews);
                    }}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "none",
                      border: "none",
                      color: "#fff",
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
        <button type="submit">Save Item</button>
      </form>
    </div>
  );
};

export default ItemForm;
