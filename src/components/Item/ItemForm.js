import React, { useState, useEffect } from "react";
import itemService from "../../services/itemService";
import { fetchSuppliers } from "../../services/supplierService";
import "./ItemForm.css";

import { storage } from "../../Firebase/Config";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ItemForm = ({ onItemAdded }) => {
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [item, setItem] = useState({
    name: "",
    location: "",
    brand: "",
    category: "",
    supplierId: "",
    unitPrice: "",
    stockUnit: "",
    status: "Enabled",
    images: [],
  });
  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({});

  const fetchallSuppliers = async () => {
    const activeSuppliers = await fetchSuppliers();
    setSuppliers(activeSuppliers.data);
  };
  useEffect(() => {
    fetchallSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const validate = () => {
    const validationErrors = {};
    if (!item.name) {
      validationErrors.name = "Item name is required";
    }
    if (!item.location) {
      validationErrors.location = "Inventory location is required";
    }
    if (!item.brand) {
      validationErrors.brand = "Brand is required";
    }
    if (!item.category) {
      validationErrors.category = "Category is required";
    }
    if (!item.supplierId) {
      validationErrors.supplierId = "Supplier is required";
    }
    if (item.unitPrice <= 0) {
      validationErrors.unitPrice = "Unit price must be greater than zero";
    }
    if (!item.stockUnit) {
      validationErrors.stockUnit = "Stock unit is required";
    }
    if (images.length === 0) {
      validationErrors.images = "At least one image is required";
    }
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const imageName = `${uuidv4()}_${image.name}`;
        const imageRef = ref(storage, `images/${imageName}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        return imageUrl;
      })
    );

    const updatedItem = { ...item, images: imageUrls };

    try {
      await itemService.createItem(updatedItem);
      window.location.reload();
      onItemAdded();
      setItem({
        name: "",
        location: "",
        brand: "",
        category: "",
        supplierId: "",
        unitPrice: "",
        stockUnit: "",
        status: "Enabled",
        images: [],
      });
      setImages([]);
      setPreviewImages([]);
      setErrors({});
    } catch (err) {
      console.error("Failed to add item:", err);
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
        <input
          type="text"
          name="name"
          value={item.name}
          onChange={handleChange}
          placeholder="Item Name"
          required
        />
        {errors.name && <span className="error">{errors.name}</span>}

        <label className="form-label">Inventory Location</label>
        <input
          type="text"
          name="location"
          value={item.location}
          onChange={handleChange}
          placeholder="Inventory Location"
          required
        />
        {errors.location && <span className="error">{errors.location}</span>}

        <label className="form-label">Brand</label>
        <input
          type="text"
          name="brand"
          value={item.brand}
          onChange={handleChange}
          placeholder="Brand"
          required
        />
        {errors.brand && <span className="error">{errors.brand}</span>}

        <label className="form-label">Category</label>
        <input
          type="text"
          name="category"
          value={item.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
        {errors.category && <span className="error">{errors.category}</span>}

        <label className="form-label">Supplier</label>
        <select
          name="supplierId"
          value={item.supplierId}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Supplier
          </option>
          {suppliers?.map((supplier) => (
            <option key={supplier.id} value={supplier?._id}>
              {supplier.name}
            </option>
          ))}
        </select>
        {errors.supplierId && (
          <span className="error">{errors.supplierId}</span>
        )}

        <label className="form-label">Unit Price</label>
        <input
          type="number"
          name="unitPrice"
          value={item.unitPrice}
          onChange={handleChange}
          placeholder="Unit Price"
          required
        />
        {errors.unitPrice && <span className="error">{errors.unitPrice}</span>}

        <label className="form-label">Stock Unit</label>
        <select
          name="stockUnit"
          value={item.stockUnit}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Stock Unit
          </option>
          <option value="pcs">Pcs</option>
          <option value="kg">Kg</option>
          <option value="liters">Liters</option>
        </select>
        {errors.stockUnit && <span className="error">{errors.stockUnit}</span>}

        <div>
          <label htmlFor="productImages">Product Images</label>
          <input
            type="file"
            id="productImages"
            onChange={handleImageChange}
            multiple
            required
          />
          {errors.images && <span className="error">{errors.images}</span>}
        </div>

        <div>
          {previewImages?.map((src, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                display: "inline-block",
                margin: "5px",
              }}
            >
              <img
                src={src}
                alt={`Preview ${index}`}
                style={{ width: "80px", height: "80px", objectFit: "cover" }} // Set your desired size here
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
