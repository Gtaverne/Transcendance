import axios from 'axios'

const API_URL =  'http://localhost'+ ':5050/users/callback'


/*
//Register user
const register = async (userData: any) => {
    const response = await axios.post(API_URL, userData)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}
*/

//Login user
const login = async (code: string) => {
  //Checking if user is logged
  console.log('Login in auth service received code: ' + code);
    const response = await axios.get(
        API_URL,
        {params: { code: code}}
        )

    if (response.data) {
        console.log('Data from the back: ' + response.data);
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    else {
        console.log('Backend seems down');
        response.data = {

        }
    }

    return response.data
}

// Logout user
const logout = () => localStorage.removeItem('user')

const authService = {
    login,
    logout,
}

export default authService