import {api} from '../config/api';

export const fetchOrdersAdminRQ = async() => {
    const res= await api.get("orders");
    return res.data.data;
}