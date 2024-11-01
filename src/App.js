import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SupplierPage from './pages/SupplierPage';
import ItemPage from './pages/ItemPage';
import PurchaseOrderPage from './pages/PurchaseOrderPage';
import HomePage from './pages/Homepage';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
        <Route path="/" element={<HomePage />} />

          <Route path="/suppliers" element={<SupplierPage />} />
          <Route path="/items" element={<ItemPage />} />
          <Route path="/purchase-orders" element={<PurchaseOrderPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
