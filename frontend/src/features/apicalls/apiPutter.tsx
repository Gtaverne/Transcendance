import axios from 'axios'
// import {AxiosRequestConfig, AxiosResponse, AxiosError,} from 'axios'


// import * as dotenv from 'dotenv'
// dotenv.config({path: './.env'})
const URL_BACK = process.env.REACT_APP_URL_BACK

async function apiPutter(route: string) : Promise<any> {

    console.log('We get in apiGetter, route is: ' + route);

    const resp = await axios.get(URL_BACK + route)
    
    return resp.data

}

export default apiPutter