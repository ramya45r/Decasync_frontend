import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import itemService from '../../services/itemService';
import { fetchactiveSuppliers } from '../../services/supplierService';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    itemNo: '',
    name: '',
    location: '',
    brand: '',
    category: '',
    supplierId: '',
    stockUnit: '',
    unitPrice: '',
    status: '',
    images: []
  });

  useEffect(() => {
    itemService.getAllItems()
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    const fetchallSuppliers = async () => {
      const activeSuppliers = await fetchactiveSuppliers();
      setSuppliers(activeSuppliers.data);
    };
    fetchallSuppliers();
  }, []);

  const openModal = (item) => {
    setCurrentItem(item);
    setFormData({
      itemNo: item.itemNo,
      name: item.name,
      location: item.location,
      brand: item.brand,
      category: item.category,
      supplierId: item.supplierId ? item.supplierId._id : '',
      stockUnit: item.stockUnit,
      unitPrice: item.unitPrice,
      status: item.status,
      images: item.images || []
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentItem(null);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await itemService.updateItem(currentItem._id, formData);
      setItems(items.map(item => item._id === currentItem._id ? { ...item, ...formData } : item));
      closeModal();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.deleteItem(id); 
        setItems(items.filter(item => item._id !== id)); 
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <div>
      <h2>Item List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Item No</th>
            <th>Item Name</th>
            <th>Inventory Location</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Stock Unit</th>
            <th>Unit Price</th>
            <th>Status</th>
            <th>Images</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.itemNo}</td>
              <td>{item.name}</td>
              <td>{item.location}</td>
              <td>{item.brand}</td>
              <td>{item.category}</td>
              <td>{item?.supplierId?.name}</td>
              <td>{item.stockUnit}</td>
              <td>{item.unitPrice}</td>
              <td>{item.status}</td>
              <td>
                {item.images && item.images.map((img, idx) => (
                  <img key={idx} src={img} width="50" height="50" alt={`Item ${item.itemNo} image ${idx + 1}`} />
                ))}
              </td>
              <td>
                <button onClick={() => openModal(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Edit Item">
        <h2>Edit Item</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Location:</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div>
            <label>Brand:</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} required />
          </div>
          <div>
            <label>Category:</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} required />
          </div>
          <div>
            <label>Supplier:</label>
            <select name="supplierId" value={formData.supplierId} onChange={handleChange}>
              <option value="" disabled>Select Supplier</option>
              {suppliers?.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Stock Unit:</label>
            <select name="stockUnit" value={formData.stockUnit} onChange={handleChange}>
              <option value="pcs">Pcs</option>
              <option value="kg">Kg</option>
              <option value="liters">Liters</option>
            </select>
          </div>
          <div>
            <label>Unit Price:</label>
            <input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleChange} required />
          </div>
          <div>
            <label>Status:</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="" disabled>Select status</option>
              <option value="Disabled">Disabled</option>
              <option value="Enabled">Enabled</option>
            </select>
          </div>
        
          <button type="submit">Save</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default ItemList;
