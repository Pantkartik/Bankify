import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import pageReducer from '../features/page/pageSlice'; 
import accountReducer from '../features/account/accountSlice';  
import cardReducer from "../features/card/cardSlice"
import transactionReducer from "../features/transactions/transactionsSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    pages: pageReducer, 
    account: accountReducer,
    card: cardReducer,    
    transaction :transactionReducer,
  },
});