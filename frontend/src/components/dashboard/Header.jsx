import React, { useEffect } from 'react'
import { FaSmile, FaBars, FaExchangeAlt } from 'react-icons/fa'
import { MdNotifications, MdSettings } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchedUser } from '../../features/user/userSlice'
import { openNavbar, toggleNavbar } from '../../features/page/pageSlice'
import { FaX } from 'react-icons/fa6'

const Header = () => {
  const dispatch = useDispatch()
  const user = useSelector(fetchedUser)
  const openNav = useSelector(openNavbar)
  const navigate = useNavigate()
  const toggleNav = () => {
    console.log(`${openNav}`)
    console.log('closing navbar')
    dispatch(toggleNavbar())
  }
  const navigatePage = (path) => {
    navigate(path)
  }
  useEffect(() => {}, [dispatch, openNav])
  return (
    <header className='fixed top-0 left-0 lg:left-[300px] right-0 bg-white z-20 flex justify-between items-center p-3 lg:p-4 border-b border-gray-200 transition-all duration-300'>
      <div className='flex items-center gap-4'>
        {!openNav && <button className='lg:hidden' onClick={toggleNav}><FaBars size={25} className='text-gray-600'/></button>}
        <h1 className='flex items-center text-gray-600 text-base lg:text-lg font-bold gap-1'>
          <span className='hidden sm:inline'>Welcome</span> {user.username} <FaSmile size={18} color='#ffbf56'/>
        </h1>
      </div>
      
      <div className='flex items-center gap-2 lg:gap-5'>
        <button className='lg:hidden text-gray-600'>
          <MdNotifications size={24} />
        </button>
        
        <div className='hidden sm:flex items-center gap-3 lg:gap-5'>
          <button 
            onClick={() => navigatePage('/dashboard/convert')} 
            className='text-blue-500 hover:text-blue-700 flex items-center text-lg lg:text-xl transition duration-300 gap-1'
          >
            <FaExchangeAlt />
            <span className='hidden lg:inline text-sm'>Convert</span>
          </button>
          
          <button 
            onClick={() => navigatePage('/dashboard/settings')} 
            className='text-blue-500 hover:text-blue-700 p-1.5 lg:p-2 border rounded-full transition duration-300'
          >
            <MdSettings size={24} className='lg:w-6 lg:h-6'/>
          </button>
          
          <button className='text-blue-500 hover:text-blue-700 p-1.5 lg:p-3 border rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300'>
            {user.firstname.substring(0, 1) + user.lastname.substring(0, 1)}
          </button>
          
          <button className='hidden lg:block text-gray-600 hover:text-blue-700 transition duration-300'>
            <MdNotifications size={24} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header