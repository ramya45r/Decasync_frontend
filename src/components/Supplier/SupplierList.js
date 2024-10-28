import React, { useEffect, useState } from 'react';
import { fetchSuppliers, deleteSupplier } from '../../services/supplierService';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Supplier List</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
            <tr key={supplier._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td>{supplier.supplierNo}</td>
              <td>{supplier.name}</td>
              <td>{supplier.country}</td>
              <td>{supplier.mobileNo}</td>
              <td>{supplier.email}</td>
              <td>{supplier.status}</td>
              <td>
                <button onClick={() => alert(`Edit ${supplier.name}`)} style={buttonStyle}>Edit</button>
                <button onClick={() => handleDelete(supplier._id)} style={buttonStyle}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const buttonStyle = {
  margin: '0 5px',
  padding: '5px 10px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default SupplierList;
