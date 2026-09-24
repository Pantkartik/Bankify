import React, { useEffect } from 'react'
import Header from '../components/dashboard/Header'
import NavBar from '../components/dashboard/NavBar'
import Transaction from './dashboard/Transaction'
import Home from './dashboard/Home'
import Account from './dashboard/Account'
import Card from './dashboard/Card'
import { Route, Routes, useLocation } from 'react-router-dom'
import Payment from './dashboard/Payment'
import Settings from './dashboard/Settings'
import Profile from './dashboard/Profile'
import Convert from './dashboard/Convert'
import { fetchAccounts } from '../features/account/accountSlice'
import { useDispatch } from 'react-redux'
import { fetchTransactions } from '../features/transactions/transactionsSlice'
import { fetchCard } from '../features/card/cardSlice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  
  useEffect(() => {
    dispatch(fetchAccounts())
    dispatch(fetchTransactions(0))
    dispatch(fetchCard())
  }, [dispatch])
  
  return (
    <main className="font-roboto w-full min-h-screen bg-gradient-to-r from-gray-300 to-white-500">
      <div className="flex flex-row w-full min-h-screen">
        <NavBar />
        <div className="flex-1 flex flex-col ml-0 lg:ml-[300px] w-full">
          <Header />
          <section className="w-full max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-348px)] mx-auto px-4 sm:px-6 py-4 sm:py-6 mt-16">
            <div className="w-full max-w-[1200px] mx-auto">
              <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/accounts' element={<Account />}/>
                <Route path='/payments' element={<Payment />}/>
                <Route path='/transactions' element={<Transaction />}/>
                <Route path='/cards' element={<Card />}/>
                <Route path='/settings' element={<Settings />}/>
                <Route path='/profile' element={<Profile />}/>
                <Route path='/convert' element={<Convert />}/>
              </Routes>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Dashboard