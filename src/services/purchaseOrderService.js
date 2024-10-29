import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASEURL}/api/purchase-orders`;

const getAllPurchaseOrders = () => axios.get(API_URL).then((res) => res.data);

const getPurchaseOrderById = (id) => axios.get(`${API_URL}/${id}`).then((res) => res.data);

const createPurchaseOrder = (data) => axios.post(API_URL, data).then((res) => res.data);

const updatePurchaseOrder = (id, data) => axios.put(`${API_URL}/${id}`, data).then((res) => res.data);

const deletePurchaseOrder = (id) => axios.delete(`${API_URL}/${id}`).then((res) => res.data);

export default {
  getAllPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
};
