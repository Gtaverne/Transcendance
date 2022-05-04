import axios from 'axios';
import apiGetter from '../apicalls/apiGetter';
// var jwt = require('jsonwebtoken')
// import { encode, TAlgorithm } from "jwt-simple";

const API_URL = process.env.REACT_APP_URL_BACK + 'users/callback';
const JWT_Secret = process.env.REACT_APP_JWT_Secret || 'defaultSecret'
// import * as dotenv from 'dotenv'

//Login user
const login = async (code: string) => {
  const response = await axios.get(API_URL, { params: { code: code } });
  if (response.data) {
    // console.log('Data from the back: ' + response.data);
    response.data.token = generateToken(response.data.id)
    localStorage.setItem('user', JSON.stringify(response.data));
  } else {
    console.log('Backend seems down');
    response.data = {};
  }

  return response.data;
};

//Token generation
const generateToken = (id : number) => {
  console.log('Generating a dummy token');
  // JWT fait bien trop de la Merde, j'ai donc décidé de créer mon propre genérateur de tokens <3

  // const algorithm: TAlgorithm = "HS512";

  // if (JWT_Secret === 'defaultsecret') {
  //   console.log('Warning: no JWT secret provided in .env, fill a REACT_APP_JWT_Secret');
  // }
  // const token = encode(id, JWT_Secret, algorithm)
  return (JWT_Secret + id.toString(10))
  // return encode(id, JWT_Secret, algorithm)
}

// Logout user
const logout = () => localStorage.removeItem('user');

const authService = {
  login,
  logout,
};

export default authService;
