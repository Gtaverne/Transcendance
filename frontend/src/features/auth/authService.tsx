import axios from 'axios'
import apiGetter from '../apicalls/apiGetter'

const API_URL =  'http://localhost:5050/' + 'users/callback'

// import * as dotenv from 'dotenv'



//Login user
const login = async (code: string) => {

    
    const response = await axios.get(
        API_URL,
        {params: { code: code}}
        )
    if (response.data) {
        // console.log('Data from the back: ' + response.data);
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