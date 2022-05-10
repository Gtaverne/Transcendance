import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import UserInterface from '../../interfaces/UserInterface';

//Get user from localstorage
const user = JSON.parse(localStorage.getItem('user') || '{}');
const iFollowList = JSON.parse(localStorage.getItem('iFollowList') || '[]');
const iBlockedList = JSON.parse(localStorage.getItem('iBlockedList') || '[]');

interface userInterface {
  user: any;
  iFollowList: any;
  iBlockedList: any;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: any;
}

const initialState: userInterface = {
  user: user ? user : {},
  iFollowList: iFollowList ? iFollowList : [],
  iBlockedList: iBlockedList ? iBlockedList : [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

//Login User
export const login = createAsyncThunk(
  'auth/login',
  async (code: string, thunkAPI) => {
    // console.log(code);
    try {
      return await authService.login(code);
    } catch (error) {
      // const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      console.log('We caught an error');

      return thunkAPI.rejectWithValue('Could not login');
    }
  },
);

//Edit User
export const edit = createAsyncThunk(
  'auth/edit',
  async (input: any, thunkAPI) => {
    //   //Je ne sais pas pourquoi on rentre dans cette boucle
    // if (input.id !== user.id) {
    //   console.log('input id', input.id);
    //   console.log('user id', user && user.id);
    //   return thunkAPI.rejectWithValue('ID mismatch');
    // }

    try {
      return await authService.edit(input.id, input.field, input.value);
    } catch (error) {
      console.log('We could not edit profile');
      return thunkAPI.rejectWithValue('Could not edit');
    }
  },
);

//Edit User but not User (just friends and blocked list)
export const editLight = createAsyncThunk(
  'auth/editLight',
  async (input: any, thunkAPI) => {
    try {
      return await authService.editLight(input.id, input.field, input.value);
    } catch (error) {
      console.log('We could not edit profile');
      return thunkAPI.rejectWithValue('Could not edit');
    }
  },
);

//Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.iBlockedList = action.payload.iBlockedList;
        state.iFollowList = action.payload.iFollowList;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(edit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(edit.fulfilled, (state, action) => {
        console.log('Redux Edit fulfilled');

        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.iBlockedList = action.payload.iBlockedList;
        state.iFollowList = action.payload.iFollowList;
      })
	  .addCase(edit.rejected, (state, action) => {
		console.log('Redux Edit Rejected');

		state.isLoading = false;
		state.isError = true;
		state.message = action.payload;
		state.user = null;
	  })
	  .addCase(editLight.pending, (state) => {
        state.isLoading = true;
      })
	  .addCase(editLight.fulfilled, (state, action) => {
        console.log('Redux EditLight fulfilled');

        state.isLoading = false;
        state.isSuccess = true;
        state.iBlockedList = action.payload.iBlockedList;
        state.iFollowList = action.payload.iFollowList;
		console.log(action.payload.iBlockedList)
      })
	  .addCase(editLight.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
		console.log('editlight failed')
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.iBlockedList = [42];
        state.iFollowList = [42];
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
