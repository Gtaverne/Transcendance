import axios from 'axios'
// import {AxiosRequestConfig, AxiosResponse, AxiosError,} from 'axios'

const URL_BACK = process.env.REACT_APP_URL_BACK

async function apiPutter(route: string, toPut: any) : Promise<any> {

    console.log('We get in apiPutter, route is: ' + route);

    const resp = await axios.put(URL_BACK + route, toPut)
    
    return resp.data

}

export default apiPutter