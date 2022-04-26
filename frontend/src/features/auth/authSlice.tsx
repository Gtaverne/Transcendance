import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import authService from './authService'


//Get user from localstorage
const user = JSON.parse(localStorage.getItem('user') || '{}' )


interface userInterface {
  user: any,
  isError: boolean,
  isSuccess: boolean,
  isLoading: boolean,
  message: any,
}

const initialState : userInterface = {
    user: user ? user : {},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

//Login User
export const login = createAsyncThunk('auth/login', async (code : string, thunkAPI) => {
    // console.log(code);
    try {
        return await authService.login(code)
    } catch (error) {
        // const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        console.log('We caught an error');

        return thunkAPI.rejectWithValue('Could not login')
    }
})

//Logout user
export const logout = createAsyncThunk(
    'auth/logout', async () => {
        await authService.logout()
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state) => {
            state.isLoading = true
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(logout.fulfilled, (state) => {
            // state.user = null
        })
    },
})

export const {reset} = authSlice.actions
export default authSlice.reducer