import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from './authService';

//Get user from localstorage
const getItem = (item: string) => {
  try {
    return JSON.parse(localStorage.getItem(item) || '{}');
  } catch (e) {}
  return {};
};

const user = getItem('user');
const iFollowList = getItem('iFollowList');
const iBlockedList = getItem('iBlockedList');

interface userInterface {
  user: any;
  iFollowList: any;
  iBlockedList: any;
}

const initialState: userInterface = {
  user: user ? user : {},
  iFollowList: iFollowList ? iFollowList : [],
  iBlockedList: iBlockedList ? iBlockedList : [],
};

//Login User
export const login = createAsyncThunk(
  'auth/login',
  async (code: string, thunkAPI) => {
    // console.log(code);
    try {
      const profile = await authService.login(code);
      if (profile && profile.doublefa > 0) {
        console.log('Authslice doublefa');
        return {
          user: profile,
        };
      }
      return profile;
    } catch (error) {
      console.log('We caught an error:', error);

      return thunkAPI.rejectWithValue('Could not login');
    }
  },
);

export const loginmfa = createAsyncThunk(
  'auth/loginmfa',
  async (input: any, thunkAPI) => {
    // console.log(code);
    try {
      const profile = await authService.loginmfa(input.jwt, input.code);
      console.log('ypyp', profile);
      if (input.feedback) {
        input.feedback(profile.user && profile.user.id);
      }
      return profile;
    } catch (error) {
      console.log('We caught an error', error);

      return thunkAPI.rejectWithValue('Could not login');
    }
  },
);

//Edit User
export const edit = createAsyncThunk(
  'auth/edit',
  async (input: any, thunkAPI) => {
    try {
      return await authService.edit(input.id, input.field, input.value);
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
    reset: (state) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.iBlockedList = action.payload.iBlockedList;
        state.iFollowList = action.payload.iFollowList;
      })
      .addCase(login.rejected, (state) => {
        state.user = null;
      })
      .addCase(loginmfa.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.iBlockedList = action.payload.iBlockedList;
        state.iFollowList = action.payload.iFollowList;
      })
      .addCase(loginmfa.rejected, (state) => {
        state.user = null;
      })
      .addCase(edit.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.iBlockedList = action.payload.iBlockedList;
        state.iFollowList = action.payload.iFollowList;
      })
      .addCase(edit.rejected, (state) => {
        console.log('Redux Edit Rejected');
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.iBlockedList = [];
        state.iFollowList = [];
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
