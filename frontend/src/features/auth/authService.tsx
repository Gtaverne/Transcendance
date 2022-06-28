import axios from 'axios';
import apiGetter from '../apicalls/apiGetter';
import Cookies from 'js-cookie';
import UserInterface from '../../interfaces/UserInterface';
import apiPoster from '../apicalls/apiPoster';

// var jwt = require('jsonwebtoken')
// import { encode, TAlgorithm } from "jwt-simple";

const API_URL = process.env.REACT_APP_URL_BACK;

//Login user
const login = async (code: string) => {
  console.log('We got in login authService, URL_BACK IS: ', API_URL);
  const response = await axios.get(API_URL + 'users/callback', {
    params: { code: code },
  });

  console.log(response);

  if (response.data && response.data.user) {
    console.log('We received an answer:', response.data.user.username);
    Cookies.set('jwt', response.data.jwt);
    if (response.data.user && response.data.user.doublefa > 0) {
      console.log('Double fa on the profile');
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return {
        doublefa: 1,
        id: response.data.user.id,
      };
    } else {
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
  //Do not use apiGetter here since this jwt is NOT the final one
  const response = await axios.get(API_URL + 'users/login2fa', {
    params: { jwt: jwt, code: code },
  });

  if (response.data) {
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
    } catch (error) {}
  } else {
    console.log('MFA failed, please retry');
    response.data = {};
  }

  return response.data;
};

const edit = async (id: number, field: string, value: any) => {
  const data = { id: id, field: field, value: value};

  const response = await apiPoster('users/editprofile/', data);

  if (response === null) {
    console.log('Logout user');
    logout();
    return {};
  }

  if (response.data && response.data.user) {
    console.log('Data from the back: ' + response.data);
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
  Cookies.remove('jwt');
  localStorage.removeItem('user');
  localStorage.removeItem('iFollowList');
  localStorage.removeItem('iBlockedList');
};

const authService = {
  login,
  loginmfa,
  edit,
  logout,
};

export default authService;
