import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import * as Yup from 'yup';
import './PurchaseOrder.css';

import 'react-datepicker/dist/react-datepicker.css';
import apiService from '../../services/purchaseOrderService';

const validationSchema = Yup.object().shape({
  supplierId: Yup.string().required('Supplier is required'),
  orderDate: Yup.date().required('Order date is required'),
  items: Yup.array().of(
    Yup.object().shape({
      orderQty: Yup.number()
        .min(1, 'Order quantity must be at least 1')
        .required('Order quantity is required'),
      discount: Yup.number().min(0, 'Discount cannot be negative'),
      packingUnit: Yup.string().required('Packing unit is required')
    })
  )
});

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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASEURL}/api/suppliers/all`).then((res) => setSuppliers(res.data));
  }, []);

  const fetchSupplierItems = (supplierId) => {
    axios
      .get(`${process.env.REACT_APP_BASEURL}/api/items?supplierId=${supplierId}`)
      .then((res) => setAvailableItems(res.data));
  };

  const handleSupplierChange = (e) => {
    const supplierId = e.target.value;
    setOrder((prev) => ({ ...prev, supplierId }));
    fetchSupplierItems(supplierId); 
  };

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

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(order, { abortEarly: false }); // Validate order data against schema
  
      setLoading(true);
      await apiService.createPurchaseOrder(order);
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
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error('Error creating order:', error);
        alert('Failed to create order.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container">
      <h2>Purchase Order</h2>
      <label>Order Date:</label>
      <DatePicker
        selected={order.orderDate}
        onChange={(date) => setOrder((prev) => ({ ...prev, orderDate: date }))}
        dateFormat="yyyy-MM-dd"
        required
      />
      {errors.orderDate && <span className="error">{errors.orderDate}</span>}

      <div>
        <label>Supplier</label>
        <select
          onChange={handleSupplierChange}
          value={order.supplierId}
          required
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.supplierId && <span className="error">{errors.supplierId}</span>}
      </div>

      {availableItems.map((item) => (
        <div key={item._id}>
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
            <tr key={item._id}>
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
                {errors[`items.${index}.packingUnit`] && <span className="error">{errors[`items.${index}.packingUnit`]}</span>}
              </td>
              <td>
                <input
                  type="number"
                  value={item.orderQty}
                  min="1"
                  onChange={(e) => handleQtyChange(index, Number(e.target.value))}
                />
                {errors[`items.${index}.orderQty`] && <span className="error">{errors[`items.${index}.orderQty`]}</span>}
              </td>
              <td>{item.itemAmount.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  value={item.discount}
                  min="0"
                  onChange={(e) => handleDiscountChange(index, Number(e.target.value))}
                />
                {errors[`items.${index}.discount`] && <span className="error">{errors[`items.${index}.discount`]}</span>}
              </td>
              <td>{item.netAmount.toFixed(2)}</td>
              <td>
                <button onClick={() => removeItemFromOrder(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals">
        <p>Item Total: {order.itemTotal.toFixed(2)}</p>
        <p>Discount Total: {order.discountTotal.toFixed(2)}</p>
        <p>Net Amount: {order.netAmount.toFixed(2)}</p>
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Order'}
      </button>
    </div>
  );
};

export default PurchaseOrderForm;
