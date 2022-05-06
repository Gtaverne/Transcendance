import axios from 'axios';
import apiGetter from '../apicalls/apiGetter';
import Cookies from 'js-cookie';

// var jwt = require('jsonwebtoken')
// import { encode, TAlgorithm } from "jwt-simple";

const API_URL = process.env.REACT_APP_URL_BACK + 'users/callback';
// const JWT_Secret = process.env.REACT_APP_JWT_Secret || 'defaultSecret'

//Login user
const login = async (code: string) => {
  const response = await axios.get(API_URL, { params: { code: code } });

  if (response.data) {
    // console.log('Data from the back: ' + response.data);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    Cookies.set('jwt', response.data.jwt);
  } else {
    console.log('Backend seems down');
    response.data = {};
  }

  return response.data.user;
};

// Logout user
const logout = () => localStorage.removeItem('user');

const authService = {
  login,
  logout,
};

export default authService;
