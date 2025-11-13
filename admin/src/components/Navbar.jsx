import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import ConfirmLogout from './ConfirmLogout'
import { assets } from '../assets/assets'

const Navbar = () => {
    const [showConfirm, setShowConfirm] = useState(false)
    const { aToken } = useContext(AdminContext)

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
            <div className='flex items-center gap-4 text-xs'>
                {/* <img className='w-36 sm:w-40 cursor-pointer' src={assets.logo} alt="" /> */}
                <p className='font-semibold text-2xl'>Yaari Circle</p>
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Client'}</p>
            </div>

            <button onClick={() => { setShowConfirm(true) }} className='bg-blue hover:opacity-90 cursor-pointer text-white text-sm px-10 py-2 rounded-full'>Logout</button>
            {
                showConfirm && <ConfirmLogout item={{ setShowConfirm }} />
            }
        </div>
    )
}

export default Navbar