import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASEURL}/api/suppliers`;

export const fetchSuppliers = async () => await axios.get(API_URL);
export const fetchactiveSuppliers = async () => await axios.get(`${API_URL}/all`);

export const createSupplier = async (data) => await axios.post(API_URL, data);

export const updateSupplier = async (id, data) => await axios.put(`${API_URL}/${id}`, data);

export const deleteSupplier = async (id) => await axios.delete(`${API_URL}/${id}`);
