import React, { useEffect, useState } from 'react';
import purchaseOrderService from '../../services/purchaseOrderService';

const PurchaseOrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    purchaseOrderService.getAllOrders().then(data => setOrders(data));
  }, []);

  return (
    <div>
      <h2>Purchase Orders</h2>
      <ul>
        {orders.map(order => (
          <li key={order.orderNo}>Order #{order.orderNo}</li>
        ))}
      </ul>
    </div>
  );
};

export default PurchaseOrderList;
