import React, { useState } from 'react';
import { createSupplier } from '../../services/supplierService';

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'India',
  'Germany',
  'France',
  'China',
  'Japan',
  'South Korea',
 
];

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
      <h2 style={headerStyle}>Add Supplier</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label style={labelStyle}>Supplier Name:</label>
        <input
          type="text"
          name="name"
          value={supplier.name}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <label style={labelStyle}>Address:</label>
        <input
          type="text"
          name="address"
          value={supplier.address}
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={labelStyle}>TAX No:</label>
        <input
          type="text"
          name="taxNo"
          value={supplier.taxNo}
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={labelStyle}>Country:</label>
        <select
          name="country"
          value={supplier.country}
          onChange={handleChange}
          style={inputStyle}
          required
        >
          <option value="" disabled>Select a country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <label style={labelStyle}>Mobile No:</label>
        <input
          type="text"
          name="mobileNo"
          value={supplier.mobileNo}
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={labelStyle}>Email:</label>
        <input
          type="email"
          name="email"
          value={supplier.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={labelStyle}>Status:</label>
        <select
          name="status"
          value={supplier.status}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Blocked">Blocked</option>
        </select>

        <button type="submit" style={submitButtonStyle}>
          Save Supplier
        </button>
      </form>
    </div>
  );
};

const formContainer = {
  padding: '30px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  maxWidth: '450px',
  margin: '40px auto',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#f9f9f9',
};

const headerStyle = {
  textAlign: 'center',
  color: '#333',
  fontSize: '24px',
  marginBottom: '20px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold',
  color: '#555',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '16px',
  outline: 'none',
  transition: 'border-color 0.3s',
};

const submitButtonStyle = {
  padding: '12px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  marginTop: '15px',
  transition: 'background-color 0.3s',
};

export default SupplierForm;
