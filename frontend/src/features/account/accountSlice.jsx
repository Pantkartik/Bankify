import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import lkr from '../../img/lkr.png';
import us from '../../img/us.png';
import gb from '../../img/gb.png';
import eu from '../../img/eu.png';
import cn from '../../img/cn.png';

const initialState = {
  accounts: [],
  transactions: [],
  rates: null,
  status: 'IDLE', // IDLE, PENDING, SUCCESS, or ERROR
  recipientAccount: null
};

export const fetchAccounts = createAsyncThunk('accounts/fetch', async () => {
  try{
    const headers = {Authorization: `${sessionStorage.getItem('access_token')}`}
    const {data, error} = await api.get('/accounts', headers)
    if(error) throw error;
    return data
  } catch(err) {
    throw new Error(err.message)
  }
})

export const createAccount = createAsyncThunk("accounts/create", async (accountDetails) => {
  try {
    const token = sessionStorage.getItem('access_token');
    // Ensure token exists and is properly formatted
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // The token might already include 'Bearer ', so we need to handle both cases
    const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const headers = { 'Authorization': authHeader };
    
    console.log('Sending account creation request with headers:', headers);
    console.log('Account Details:', accountDetails);
    
    const response = await api.post('/accounts', accountDetails, headers);
    console.log('Account creation response:', response);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data;
  } catch (err) {
    console.error('Error in createAccount thunk:', err);
    // More detailed error handling
    const errorMessage = err.response?.data?.message || 
                        (err.response?.data ? JSON.stringify(err.response.data) : err.message) || 
                        'Failed to create account';
    throw new Error(errorMessage);
  }
})

export const fetchAccountHolder = createAsyncThunk("accounts/find", async (details) => {
  try{
    const headers = {Authorization: `${sessionStorage.getItem('access_token')}`}
    console.log(details)
    const {data, error} = await api.post(`/accounts/find`, details,  headers)
    if(error) throw error;
    console.log(data)
    return data
  } catch(err) {
    throw new Error(err.message)
  }
})

export const transferFunds = createAsyncThunk("accounts/transfer", async (details) => {
  try{
    const headers = {Authorization: `${sessionStorage.getItem('access_token')}`}
    console.log(`Transfer Details: ${JSON.stringify(details)}`)
    const {data, error} = await api.post('/accounts/transfer', details, headers)
    if(error) throw error;
    return data
  } catch(err) {
    throw new Error(err.message)
  }
})

export const getExchangeRate = createAsyncThunk("accounts/getExchangeRate", async () => {
  try{
    const headers = {Authorization: `${sessionStorage.getItem('access_token')}`}
    const {data, error} = await api.get(`/accounts/rates`, headers)
    if(error) throw error;
    console.log(data)
    return data
  } catch(err) {
    throw new Error(err.message)
  }
})

export const convertCurrency = createAsyncThunk("accounts/convertCurrency", async (details) => {
  try{
    const headers = {Authorization: `${sessionStorage.getItem('access_token')}`}
    console.log(`Conversion Details: ${JSON.stringify(details)}`)
    const {data, error} = await api.post('/accounts/convert', details, headers)
    if(error) throw error;
    return data
  } catch(err) {
    throw new Error(err.message)
  }
})

const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    addAccount: (state, action) => {
      state.accounts.push(action.payload);
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
    resetAccountStatus: (state) => {
      state.status = 'IDLE';
    },
    resetRecipient: (state) => {
      state.recipientAccount = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = 'PENDING';
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        const fetchedAccounts = action.payload;
        const newAccountList = fetchedAccounts.map(acc => {
          let flag = us;
          if (acc.code === 'USD') flag = us;
          if (acc.code === 'LKR') flag = lkr;
          if (acc.code === 'EUR') flag = eu;
          if (acc.code === 'GBP') flag = gb;
          if (acc.code === 'CNY') flag = cn;
          return {...acc, flag};
        });
        state.accounts = newAccountList;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = 'FAILED';
        console.log('Fetch failed:', action.error);
      })
      .addCase(createAccount.pending, (state) => {
        state.status = 'PENDING';
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.accounts.push(action.payload);
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.status = 'FAILED';
        console.log('Account creation failed:', action.error);
      })
      .addCase(fetchAccountHolder.pending, (state) => {
        state.status = 'PENDING';
      })
      .addCase(fetchAccountHolder.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.recipientAccount = action.payload;
      })
      .addCase(fetchAccountHolder.rejected, (state, action) => {
        state.status = 'FAILED';
        console.log('Account holder search failed:', action.error);
      })
      .addCase(transferFunds.pending, (state) => {
        state.status = 'PENDING';
      })
      .addCase(transferFunds.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.transactions.push(action.payload);
      })
      .addCase(transferFunds.rejected, (state, action) => {
        state.status = 'FAILED';
        console.log('Transfer failed:', action.error);
      })
      .addCase(getExchangeRate.pending, (state) => {
        state.status = 'PENDING';
      })
      .addCase(getExchangeRate.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.rates = action.payload;
      })
      .addCase(getExchangeRate.rejected, (state, action) => {
        state.status = 'FAILED';
        console.log('Failed to fetch exchange rates:', action.error);
      })
      .addCase(convertCurrency.pending, (state) => {
        state.status = 'PENDING';
      })
      .addCase(convertCurrency.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.transactions.push(action.payload);
      })
      .addCase(convertCurrency.rejected, (state, action) => {
        state.status = 'FAILED';
        console.log('Currency conversion failed:', action.error);
      });
  }
});

export const fetchAccountStatus = state => state.account.status;
export const { addAccount, addTransaction, resetAccountStatus, resetRecipient } = accountSlice.actions;
export const fetchRecipient = state => state.account.recipientAccount;
export const exchangeRates = state => state.account.rates;
export const accounts = state => state.account.accounts;

export default accountSlice.reducer;