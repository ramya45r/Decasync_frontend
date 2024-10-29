import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';

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

  const exportToExcel = (order) => {
    const worksheet = XLSX.utils.json_to_sheet(order.items.map(item => ({
      'No': item.itemId.itemNo,
      'Name': item.itemId.name,
      'Stock Unit': item.itemId.stockUnit,
      'Packing Unit': item.itemId.packingUnit,
      'Qty': item.orderQty,
      'Unit Price': item.unitPrice.toFixed(2),
      'Item Amount': item.itemAmount.toFixed(2),
      'Discount': item.discount.toFixed(2),
      'Net Amount': item.netAmount.toFixed(2),
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Purchase Order Items');

    XLSX.writeFile(workbook, `${order.orderNo}.xlsx`);
  };

  const printOrder = () => {
    if (!selectedOrder) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
      <head>
        <title>Print Order</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; }
          h2 { text-align: center; }
        </style>
      </head>
      <body>
        <h2>Purchase Order Details</h2>
        <p><strong>Order No:</strong> ${selectedOrder.orderNo}</p>
        <p><strong>Order Date:</strong> ${new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
        <p><strong>Supplier:</strong> ${selectedOrder.supplierId ? selectedOrder.supplierId.name : 'N/A'}</p>
        <p><strong>Item Total:</strong> ${selectedOrder.itemTotal.toFixed(2)}</p>
        <p><strong>Discount:</strong> ${selectedOrder.discount.toFixed(2)}</p>
        <p><strong>Net Amount:</strong> ${selectedOrder.netAmount.toFixed(2)}</p>
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
              <th>Net Amount</th>
            </tr>
          </thead>
          <tbody>
            ${selectedOrder.items.map(item => `
              <tr>
                <td>${item.itemId.itemNo}</td>
                <td>${item.itemId.name}</td>
                <td>${item.itemId.stockUnit}</td>
                <td>${item.packingUnit}</td>
                <td>${item.orderQty}</td>
                <td>${item.unitPrice.toFixed(2)}</td>
                <td>${item.itemAmount.toFixed(2)}</td>
                <td>${item.discount.toFixed(2)}</td>
                <td>${item.netAmount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  const exportAllToExcel = () => {
    const allOrdersData = purchaseOrders.flatMap(order =>
      order.items.map(item => ({
        'Order No': order.orderNo,
        'Order Date': new Date(order.orderDate).toLocaleDateString(),
        'Supplier': order.supplierId ? order.supplierId.name : 'N/A',
        'Item Total': order.itemTotal.toFixed(2),
        'Discount': order.discount.toFixed(2),
        'Net Amount': order.netAmount.toFixed(2),
        'Item No': item.itemId.itemNo,
        'Item Name': item.itemId.name,
        'Stock Unit': item.itemId.stockUnit,
        'Packing Unit': item.packingUnit,
        'Qty': item.orderQty,
        'Unit Price': item.unitPrice.toFixed(2),
        'Item Amount': item.itemAmount.toFixed(2),
        'Item Discount': item.discount.toFixed(2),
        'Item Net Amount': item.netAmount.toFixed(2),
      }))
    );
  
    const worksheet = XLSX.utils.json_to_sheet(allOrdersData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'All Purchase Orders');
  
    XLSX.writeFile(workbook, `All_Purchase_Orders.xlsx`);
  };
  
  return (
    <div>
      <h2>Purchase Orders</h2>
      <button onClick={exportAllToExcel}>Export All to Excel</button>

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
                <button onClick={() => exportToExcel(order)}>Export to Excel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
                  <th>Net Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item) => (
                  <tr key={item.itemId}>
                    <td>{item.itemId.itemNo}</td>
                    <td>{item.itemId.name}</td>
                    <td>{item.itemId.stockUnit}</td>
                    <td>{item.packingUnit}</td>
                    <td>{item.orderQty}</td>
                    <td>{item.unitPrice.toFixed(2)}</td>
                    <td>{item.itemAmount.toFixed(2)}</td>
                    <td>{item.discount.toFixed(2)}</td>
                    <td>{item.netAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={printOrder}>Print Order</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PurchaseOrderList;
