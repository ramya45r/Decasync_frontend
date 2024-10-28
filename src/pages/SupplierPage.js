import React from 'react';
import SupplierList from '../components/Supplier/SupplierList';
import SupplierForm from '../components/Supplier/SupplierForm';

const SupplierPage = () => {
  return (
    <div>
      <h1>Suppliers</h1>
      <SupplierForm />
      <SupplierList />
    </div>
  );
};

export default SupplierPage;
