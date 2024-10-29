import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { fetchSuppliers, deleteSupplier, updateSupplier } from '../../services/supplierService';
import './SupplierList.css'; 

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const countriesList = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'IN', name: 'India' },
  ];
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplierNo: '',
    name: '',
    country: '',
    mobileNo: '',
    email: '',
    status: ''
  });

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const response = await fetchSuppliers();
        setSuppliers(response.data);
      } catch (err) {
        setError("Failed to load suppliers");
      } finally {
        setLoading(false);
      }
    };
    loadSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      await deleteSupplier(id);
      setSuppliers(suppliers.filter((supplier) => supplier._id !== id));
    }
  };

  const openModal = (supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      supplierNo: supplier.supplierNo,
      name: supplier.name,
      country: supplier.country,
      mobileNo: supplier.mobileNo,
      email: supplier.email,
      status: supplier.status
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSupplier(null);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSupplier(selectedSupplier._id, formData);
    setSuppliers(suppliers.map(supplier => supplier._id === selectedSupplier._id ? { ...supplier, ...formData } : supplier));
    closeModal();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Supplier List</h2>
      <table>
        <thead>
          <tr>
            <th>Supplier No</th>
            <th>Name</th>
            <th>Country</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier._id}>
              <td>{supplier.supplierNo}</td>
              <td>{supplier.name}</td>
              <td>{supplier.country}</td>
              <td>{supplier.mobileNo}</td>
              <td>{supplier.email}</td>
              <td>{supplier.status}</td>
              <td>
                <button onClick={() => openModal(supplier)}>Edit</button>
                <button onClick={() => handleDelete(supplier._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Edit Supplier">
        <h2>Edit Supplier</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Supplier No:</label>
            <input type="text" name="supplierNo" value={formData.supplierNo} onChange={handleChange} required />
          </div>
          <div>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Country:</label>
            <select name="country" value={formData.country} onChange={handleChange} required>
              <option value="">Select a country</option>
              {countriesList.map(country => (
                <option key={country.code} value={country.name}>{country.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Mobile:</label>
            <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
  <label>Status:</label>
  <select name="status" value={formData.status} onChange={handleChange} required>
    <option value="">Select status</option>
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>
    <option value="Blocked">Blocked</option>
  </select>
</div>

          <button type="submit">Save</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default SupplierList;
