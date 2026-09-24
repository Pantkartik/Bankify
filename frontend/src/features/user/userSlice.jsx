import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
    user: JSON.parse(sessionStorage.getItem('user')),  
    status: 'IDLE',
}

export const authenticateUser = createAsyncThunk("user/authenticate", async (userDetails) => {
    try {
        console.log('Sending login request with:', userDetails);
        const response = await api.post('/user/auth', userDetails);
        
        // Debug log the entire response
        console.log('Full response:', {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data,
            config: response.config
        });

        // Try to get the token from different possible header names
        const token = response.headers['authorization'] || 
                     response.headers['Authorization'] ||
                     (response.data && response.data.token);
        
        if (!token) {
            console.error('No authorization token found in response');
            throw new Error('No authorization token received');
        }

        console.log('Token received:', token);
        
        // Store the token in session storage
        sessionStorage.setItem('access_token', token);
        
        // Store user data
        const userData = response.data.user || response.data;
        sessionStorage.setItem('user', JSON.stringify(userData));
        
        return userData;
    } catch (err) {
        console.error('Authentication error:', {
            message: err.message,
            response: err.response,
            request: err.request,
            config: err.config
        });
        throw err;
    }
})

export const registerUser = createAsyncThunk("user/register", async (userDetails) => {
    try {
            const{data, error} = await api.post('/user/register', userDetails)
            if(error) throw error;
            return data
        } catch(err) {
            console.log(err.message)
            throw err
        }
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'IDLE'
        }
    },
    extraReducers(builder) {
        builder.addCase(authenticateUser.pending, (state) => {
                    state.status = 'PENDING'
                })
                .addCase(authenticateUser.fulfilled, (state, action) => {
                    state.user = action.payload
                    console.log(action.payload)
                    state.status = 'SUCCESS'
                })
                .addCase(authenticateUser.rejected, (state) => {
                    state.status = 'FAILED'
                })
                .addCase(registerUser.pending, (state) => {
                    state.status = 'PENDING'
                })
                .addCase(registerUser.fulfilled, (state) => {
                    state.status = 'SUCCESS'
                })
                .addCase(registerUser.rejected, (state) =>{ 
                    state.status = 'FAILED'
                })
    }
})

export const { resetStatus } = userSlice.actions
export const fetchedUser = state => state.user.user
export const fetchUserStatus = state => state.user.status
export default userSlice.reducer;