import axios from 'axios';
import apiGetter from '../apicalls/apiGetter';
import Cookies from 'js-cookie';
import UserInterface from '../../interfaces/UserInterface';

// var jwt = require('jsonwebtoken')
// import { encode, TAlgorithm } from "jwt-simple";

const API_URL = process.env.REACT_APP_URL_BACK;
// const JWT_Secret = process.env.REACT_APP_JWT_Secret || 'defaultSecret'

//Login user
const login = async (code: string) => {
  const response = await axios.get(API_URL + 'users/callback', {
    params: { code: code },
  });

  if (response.data) {
    // console.log('Data from the back: ' + response.data);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    localStorage.setItem(
      'iFollowList',
      JSON.stringify(response.data.iFollowList),
    );
    localStorage.setItem(
      'iBlockedList',
      JSON.stringify(response.data.iBlockedList),
    );

    Cookies.set('jwt', response.data.jwt);
  } else {
    console.log('Backend seems down');
    response.data = {};
  }

  return response.data;
};

const edit = async (id: number, field: string, value: any) => {
  const data = { id: id, field: field, value: value };
  if (value && value[0]) {
    console.log(value[0]);
  }

  const response = await axios.post(API_URL + 'users/editprofile/', data);

  console.log('Response', response);

  if (response.data && response.data.user) {
    // console.log('Data from the back: ' + response.data);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem(
      'iFollowList',
      JSON.stringify(response.data.iFollowList),
    );
    localStorage.setItem(
      'iBlockedList',
      JSON.stringify(response.data.iBlockedList),
    );
  } else {
    console.log('Backend seems down');
    response.data = {};
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('iFollowList');
  localStorage.removeItem('iBlockedList');
};

const authService = {
  login,
  edit,
  logout,
};

export default authService;
