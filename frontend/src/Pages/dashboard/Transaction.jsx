import React from 'react'
import {fetchTransactionsList } from '../../features/transactions/transactionsSlice'
import { useSelector } from 'react-redux'
import SectionContainer from '../../components/SectionContainer'

const Transaction = () => {
  const transactions = useSelector(fetchTransactionsList)
  const TdItem = ({ content, extraStyle }) => {
    return <td className={`px-2 py-1.5 text-sm sm:text-base text-center ${extraStyle || ''}`}>{content}</td>
  }
  const ThItem = ({ content }) => {
    return <th className='px-2 py-2 text-sm sm:text-base font-medium text-gray-700 text-center'>{content}</th>
  }
  const TransactionItem = ({ transaction }) => {
    return (
      <tr key={transaction.id} className='hover:bg-gray-50 border-b border-gray-200'>
        <TdItem content={transaction.createdAt.substring(0,10)} />
        <TdItem content={transaction.description} />
        <TdItem content={transaction.amount} />
        <TdItem content={transaction.type} />
        <TdItem content={transaction.status} />
        <TdItem 
          content={
            <button className='text-blue-500 hover:text-blue-700 text-sm transition duration-150'>
              See More
            </button>
          }
        />
      </tr>
    )
  }
  
  return (
    <SectionContainer>
      <p className='font-bold text-gray-700 text-lg mb-4'>Recent Transactions</p>
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <ThItem content='Date' />
                <ThItem content='Description' />
                <ThItem content='Amount' />
                <ThItem content='Type' />
                <ThItem content='Status' />
                <ThItem content='Info' />
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {transactions.map((transaction) => (
                <TransactionItem key={transaction.txId} transaction={transaction} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionContainer>
  )
}

export default Transaction