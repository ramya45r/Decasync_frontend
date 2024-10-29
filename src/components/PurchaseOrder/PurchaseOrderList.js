import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const PurchaseOrderList = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/purchase-orders`);
        setPurchaseOrders(response.data);
      } catch (error) {
        console.error('Error fetching purchase orders:', error);
        setError('Failed to load purchase orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseOrders();
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Purchase Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order No</th>
            <th>Order Date</th>
            <th>Supplier</th>
            <th>Item Total</th>
            <th>Discount</th>
            <th>Net Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrders.map((order) => (
            <tr key={order._id}>
              <td>{order.orderNo}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>{order.supplierId ? order.supplierId.name : 'N/A'}</td>
              <td>{order.itemTotal.toFixed(2)}</td>
              <td>{order.discount.toFixed(2)}</td>
              <td>{order.netAmount.toFixed(2)}</td>
              <td>
                <button onClick={() => openModal(order)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for viewing purchase order details */}
      {selectedOrder && (
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Purchase Order Details">
          <h2>Purchase Order Details</h2>
          <button onClick={closeModal}>Close</button>
          <div>
            <p><strong>Order No:</strong> {selectedOrder.orderNo}</p>
            <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
            <p><strong>Supplier:</strong> {selectedOrder.supplierId ? selectedOrder.supplierId.name : 'N/A'}</p>
            <p><strong>Item Total:</strong> {selectedOrder.itemTotal.toFixed(2)}</p>
            <p><strong>Discount:</strong> {selectedOrder.discount.toFixed(2)}</p>
            <p><strong>Net Amount:</strong> {selectedOrder.netAmount.toFixed(2)}</p>
            <h3>Items:</h3>
           <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Stock Unit</th>
            <th>Packing Unit</th>

            <th>Qty</th>
            <th>Unit Price</th>
            <th>Item Amount</th>
            <th>Discount</th>
            <th>Net Amount </th>

          </tr>
        </thead>
        <tbody>
        {selectedOrder.items.map((item) => (        
              <tr key={item.itemId}>
              <td>{item.itemId.itemNo}</td>

              <td>{item.itemId.name}</td>
              <td>{item.itemId.stockUnit}</td>
              <td>{item.itemId.stockUnit}</td>

              <td>{item.orderQty}</td>
              <td>{item.unitPrice.toFixed(2)}</td>
              <td>{item.itemAmount.toFixed(2)}</td>
              <td>{item.itemAmount.toFixed(2)}</td>
              <td>{item.itemAmount.toFixed(2)}</td>

            </tr>
          ))}
        </tbody>
      </table>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PurchaseOrderList;
