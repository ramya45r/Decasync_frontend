import React from 'react';
import ItemList from '../components/Item/ItemList';
import ItemForm from '../components/Item/ItemForm';

const ItemPage = () => (
  <div>
    <h1>Item Management</h1>
    <ItemForm />
    <ItemList />
  </div>
);

export default ItemPage;
