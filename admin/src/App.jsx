import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify';
import { AdminContext } from './context/AdminContext'
import { ClientContext } from './context/ClientContext'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import AddClient from './pages/Admin/AddClient';
import ErrorPage from './pages/ErrorPage';
import AddProduct from './pages/Admin/AddProduct';
import ClientList from './pages/Admin/ClientList';
import UserList from './pages/Admin/UserList';
import ProductList from './pages/Admin/ProductList';
import OrderList from './pages/Admin/OrderList';
import AddUser from './pages/Admin/AddUser';


const App = () => {
  const { aToken } = useContext(AdminContext)
  const { cToken } = useContext(ClientContext)

  return aToken || cToken ? (
    <div className='bg-gray-50'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <div className='max-h-screen w-full overflow-y-auto'>
          <Routes>
            {/* Admin Route */}
            <Route path={'*'} element={<ErrorPage />} />
            {
              aToken ? (
                <>
                  <Route path={'/admin-dashboard'} element={<></>} />
                  <Route path={'/products'} element={<ProductList />} />
                  <Route path={'/products/add'} element={<AddProduct />} />
                  <Route path={'/all-orders'} element={<OrderList />} />
                  <Route path={'/clients'} element={<ClientList />} />
                  <Route path={'/clients/add'} element={<AddClient />} />
                  <Route path={'/users'} element={<UserList />} />
                  <Route path={'/users/add'} element={<AddUser />} />
                </>
              ) : (
                <>
                  {/* Client Route */}
                  <Route path={'/dashboard'} element={<AddClient />} />
                  <Route path={'/orders'} element={<AddClient />} />
                  <Route path={'/add-products'} element={<AddProduct />} />
                  <Route path={'/my-products'} element={<AddClient />} />
                  <Route path={'/client-profile'} element={<AddClient />} />
                </>
              )
            }
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <Login />
      <ToastContainer />
    </div>
  )
}

export default App