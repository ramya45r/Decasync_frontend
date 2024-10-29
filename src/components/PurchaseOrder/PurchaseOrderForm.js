import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import './PurchaseOrder.css';

import 'react-datepicker/dist/react-datepicker.css';
import apiService from '../../services/purchaseOrderService'; 

const PurchaseOrderForm = () => {
  const [order, setOrder] = useState({
    orderNo: Date.now(),
    orderDate: new Date(),
    supplierId: '',
    items: [],
    itemTotal: 0,
    discountTotal: 0,
    netAmount: 0,
  });

  const [suppliers, setSuppliers] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASEURL}/api/suppliers`).then((res) => setSuppliers(res.data));
    axios.get(`${process.env.REACT_APP_BASEURL}/api/items`).then((res) => setAvailableItems(res.data));
  }, []);

  const addItemToOrder = (item) => {
    const orderItem = {
      ...item,
      orderQty: 1,
      discount: 0,
      packingUnit: '',
      itemAmount: item.unitPrice,
      netAmount: item.unitPrice,
    };
    const updatedItems = [...order.items, orderItem];
    calculateTotals(updatedItems);
    setAvailableItems((prevItems) =>
      prevItems.map((i) => (i._id === item._id ? { ...i, disabled: true } : i))
    );
  };

  const handleQtyChange = (index, qty) => {
    const updatedItems = [...order.items];
    updatedItems[index].orderQty = qty;
    updatedItems[index].itemAmount = qty * updatedItems[index].unitPrice;
    updatedItems[index].netAmount = updatedItems[index].itemAmount - updatedItems[index].discount;
    calculateTotals(updatedItems);
  };

  const handleDiscountChange = (index, discount) => {
    const updatedItems = [...order.items];
    updatedItems[index].discount = discount;
    updatedItems[index].netAmount = updatedItems[index].itemAmount - discount;
    calculateTotals(updatedItems);
  };

  const handlePackingUnitChange = (index, packingUnit) => {
    const updatedItems = [...order.items];
    updatedItems[index].packingUnit = packingUnit;
    setOrder((prev) => ({ ...prev, items: updatedItems }));
  };

  const removeItemFromOrder = (index) => {
    const removedItem = order.items[index];
    const updatedItems = order.items.filter((_, i) => i !== index);
    calculateTotals(updatedItems);
    setAvailableItems((prevItems) =>
      prevItems.map((i) => (i._id === removedItem._id ? { ...i, disabled: false } : i))
    );
  };

  const calculateTotals = (updatedItems) => {
    const itemTotal = updatedItems.reduce((sum, item) => sum + item.itemAmount, 0);
    const discountTotal = updatedItems.reduce((sum, item) => sum + item.discount, 0);
    const netAmount = itemTotal - discountTotal;
    setOrder((prev) => ({ ...prev, items: updatedItems, itemTotal, discountTotal, netAmount }));
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(order.items);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PurchaseOrder');
    XLSX.writeFile(workbook, 'PurchaseOrder.xlsx');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiService.createPurchaseOrder(order);
      alert('Purchase Order Created Successfully!');
      setOrder({
        orderNo: Date.now(),
        orderDate: new Date(),
        supplierId: '',
        items: [],
        itemTotal: 0,
        discountTotal: 0,
        netAmount: 0,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Purchase Order</h2>
      <p>Order No: {order.orderNo}</p>
      <label>Order Date:</label>
      <DatePicker
        selected={order.orderDate}
        onChange={(date) => setOrder((prev) => ({ ...prev, orderDate: date }))}
        dateFormat="yyyy-MM-dd"
      />
      <label>Supplier</label>
      <select
        onChange={(e) => setOrder((prev) => ({ ...prev, supplierId: e.target.value }))}
        value={order.supplierId}
      >
        <option value="">Select Supplier</option>
        {suppliers.map((s) => (
          <option key={s.id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>
  
      {availableItems.map((item) => (
        <div key={item.id}>
          <button onClick={() => addItemToOrder(item)} disabled={item.disabled}>
            Add {item.name}
          </button>
        </div>
      ))}
  
      <h3>Order Summary</h3>
      <table>
        <thead>
          <tr>
            <th>Item No</th>
            <th>Item Name</th>
            <th>Stock Unit</th>
            <th>Unit Price</th>
            <th>Packing Unit</th>
            <th>Order Qty</th>
            <th>Item Amount</th>
            <th>Discount</th>
            <th>Net Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={item.id}>
              <td>{item.itemNo}</td>
              <td>{item.name}</td>
              <td>{item.stockUnit}</td>
              <td>{item.unitPrice}</td>
              <td>
                <select
                  value={item.packingUnit}
                  onChange={(e) => handlePackingUnitChange(index, e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Box">Box</option>
                  <option value="Pack">Pack</option>
                  <option value="Piece">Piece</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={item.orderQty}
                  min="1"
                  onChange={(e) => handleQtyChange(index, Number(e.target.value))}
                />
              </td>
              <td>{item.itemAmount.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  value={item.discount}
                  min="0"
                  onChange={(e) => handleDiscountChange(index, Number(e.target.value))}
                />
              </td>
              <td>{item.netAmount.toFixed(2)}</td>
              <td>
                <button onClick={() => removeItemFromOrder(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  
      <div className="summary">
        <p>Item Total: {order.itemTotal.toFixed(2)}</p>
        <p>Discount Total: {order.discountTotal.toFixed(2)}</p>
        <p>Net Amount: {order.netAmount.toFixed(2)}</p>
      </div>
  
      <button onClick={handleExportToExcel}>Export to Excel</button>
      <button onClick={handlePrint}>Print</button>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Order'}
      </button>
    </div>
  );
  
};

export default PurchaseOrderForm;
