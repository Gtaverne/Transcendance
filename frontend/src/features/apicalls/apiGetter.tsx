import axios from 'axios'
// import {AxiosRequestConfig, AxiosResponse, AxiosError,} from 'axios'

// import * as dotenv from 'dotenv'
// dotenv.config({path: './.env'})
const URL_BACK = 'http://localhost:5050/'

async function apiGetter(route: string) : Promise<any> {

    console.log('We get in apiGetter, route is: ' + route);
    const resp = await axios.get(URL_BACK + route)
    return resp.data
}

export default apiGetter