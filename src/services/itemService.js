// itemService.js
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASEURL}/api/items`;

const getAllItems = () => axios.get(API_URL).then(res => res.data);
const createItem = (data) => axios.post(API_URL + '/', data);

export default { getAllItems, createItem };
