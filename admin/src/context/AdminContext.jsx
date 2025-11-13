import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const localStorageToken = localStorage.getItem('aToken')

    const [aToken, setAToken] = useState(localStorageToken ? localStorageToken : '')
    const [clients, setClients] = useState([])
    const [users, setUsers] = useState([])
    const [products, setProducts] = useState([])
    const [orderList, setOrderList] = useState([]);
    const [dashData, setDashData] = useState(false)

    // Get All Clients
    const getAllClients = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/all-clients`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${aToken}`,
                }
            });

            if (data.success) {
                setClients(data.clients)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Get All Users
    const getAllUsers = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/all-users`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${aToken}`,
                }
            });

            console.log("users: ", data.users);
            
            if (data.success) {
                setUsers(data.users)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Get All Products
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/all-products`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${aToken}`,
                }
            });

            if (data.success) {
                setProducts(data.products)
                console.log(data.products);

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Get Dashboard Data
    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${aToken}`,
                }
            })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        aToken, setAToken, backendUrl, axios,
        dashData, setDashData, getDashData,
        clients, getAllClients,
        users, getAllUsers,
        products, getAllProducts,
        orderList, setOrderList,
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider