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
  console.log('We got in login authService');
  const response = await axios.get(API_URL + 'users/callback', {
    params: { code: code },
  });

  if (response.data) {
    console.log('We received an answer:', response.data.user.username);
    Cookies.set('jwt', response.data.jwt, { path: API_URL });
    Cookies.set('jwt', response.data.jwt);
    if (response.data.user && response.data.user.doublefa > 0) {
      console.log('Double fa on the profile');
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return {
        doublefa: 1,
        id: response.data.user.id,
      };
    } else {
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
    }
  } else {
    console.log('Backend seems down');
    response.data = {};
  }

  return response.data;
};

//Login user
const loginmfa = async (jwt: string, code: string) => {
  console.log('We got in MFAlogin authService, jwt: ', jwt, ' code: ', code);
  const response = await axios.get(API_URL + 'users/login2fa', {
    params: { jwt: jwt, code: code },
  });

  if (response.data) {
    console.log('We received an answer:', response.data.user.username);
    Cookies.set('jwt', response.data.jwt);
    Cookies.set('jwt', response.data.jwt, { path: API_URL });
    try {
      localStorage.setItem('user', JSON.stringify(response.data.user));

      localStorage.setItem(
        'iFollowList',
        JSON.stringify(response.data.iFollowList),
      );
      localStorage.setItem(
        'iBlockedList',
        JSON.stringify(response.data.iBlockedList),
      );

      // console.log('Data from the back: ' + response.data);
    } catch (error) {}
  } else {
    console.log('MFA failed, please retry');
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

  console.log('Response of edit', response);

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

const editLight = async (id: number, field: string, value: any) => {
  const data = { id: id, field: field, value: value };
  if (value && value[0]) {
    console.log(value[0]);
  }

  const response = await axios.post(API_URL + 'users/editprofile/', data);

  console.log('Response', response);

  if (
    response.data &&
    response.data.iFollowList &&
    response.data.iBlockedList
  ) {
    // console.log('Data from the back: ' + response.data);
    //   localStorage.setItem('user', JSON.stringify(response.data.user));

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
  Cookies.remove('jwt');
  localStorage.removeItem('user');
  localStorage.removeItem('iFollowList');
  localStorage.removeItem('iBlockedList');
};

const authService = {
  login,
  loginmfa,
  edit,
  editLight,
  logout,
};

export default authService;
