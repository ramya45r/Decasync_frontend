import React, { useState, useEffect } from 'react';
import itemService from '../../services/itemService';

const ItemList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch items from backend using itemService
    itemService.getAllItems()
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  return (
    <div>
      <h2>Item List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Item No</th>
            <th>Item Name</th>
            <th>Inventory Location</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Stock Unit</th>
            <th>Unit Price</th>
            <th>Status</th>
            <th>Images</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.itemNo}</td>
              <td>{item.name}</td>
              <td>{item.location}</td>
              <td>{item.brand}</td>
              <td>{item.category}</td>
              <td>{item?.supplierId?.name}</td>
              <td>{item.stockUnit}</td>
              <td>{item.unitPrice}</td>
              <td>{item.status}</td>
              <td>
                {item.images && item.images.map((img, idx) => (
                  <img key={idx} src={img}  width="50" height="50" />
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;
