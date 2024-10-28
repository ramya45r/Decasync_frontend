import React, { useState } from 'react';
import { createSupplier } from '../../services/supplierService';

const SupplierForm = ({ onSupplierAdded }) => {
  const [supplier, setSupplier] = useState({
    name: '',
    address: '',
    taxNo: '',
    country: '',
    mobileNo: '',
    email: '',
    status: 'Active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier({ ...supplier, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSupplier(supplier);
      onSupplierAdded();
      setSupplier({
        name: '',
        address: '',
        taxNo: '',
        country: '',
        mobileNo: '',
        email: '',
        status: 'Active',
      });
    } catch (err) {
      console.error('Failed to add supplier:', err);
    }
  };

  return (
    <div style={formContainer}>
      <h2>Add Supplier</h2>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Supplier Name:</label>
        <input type="text" name="name" value={supplier.name} onChange={handleChange} style={inputStyle} required />

        <label style={labelStyle}>Address:</label>
        <input type="text" name="address" value={supplier.address} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>TAX No:</label>
        <input type="text" name="taxNo" value={supplier.taxNo} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Country:</label>
        <input type="text" name="country" value={supplier.country} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Mobile No:</label>
        <input type="text" name="mobileNo" value={supplier.mobileNo} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Email:</label>
        <input type="email" name="email" value={supplier.email} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Status:</label>
        <select name="status" value={supplier.status} onChange={handleChange} style={inputStyle}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Blocked">Blocked</option>
        </select>

        <button type="submit" style={submitButtonStyle}>Save Supplier</button>
      </form>
    </div>
  );
};

const formContainer = {
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  maxWidth: '400px',
  margin: '20px auto'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold'
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '12px',
  borderRadius: '4px',
  border: '1px solid #ddd'
};

const submitButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default SupplierForm;
