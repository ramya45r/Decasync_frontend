import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASEURL}/api/items`;

const getAllItems = () => axios.get(API_URL).then(res => res.data);
const createItem = (data) => axios.post(API_URL + '/', data);
const updateItem = (id, data) => axios.put(`${API_URL}/${id}`, data).then((res) => res.data);
const deleteItem = (id) => axios.delete(`${API_URL}/${id}`).then((res) => res.data);

export default { getAllItems, createItem,updateItem,deleteItem };
