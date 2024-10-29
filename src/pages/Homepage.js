import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => (
  <div className={styles.homeContainer}>
    <h1>Welcome to the procurement System</h1>
    <div className={styles.navLinks}>
      <Link to="/suppliers" className={styles.linkButton}>Manage Suppliers</Link>
      <Link to="/items" className={styles.linkButton}>Manage Items</Link>
      <Link to="/purchase-orders" className={styles.linkButton}>Manage Purchase Orders</Link>
    </div>
  </div>
);

export default HomePage;
