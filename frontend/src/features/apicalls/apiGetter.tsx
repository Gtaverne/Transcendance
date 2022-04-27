import axios, {AxiosRequestConfig, AxiosResponse, AxiosError,} from 'axios'


// import * as dotenv from 'dotenv'
// dotenv.config({path: './.env'})


const URL_BACK = 'http://localhost:5050/'

async function apiGetter(route: string) : Promise<any> {

    console.log('We get in apiGetter, route is: ' + route);

    await axios.get(URL_BACK + route)
    .then(function (response : AxiosResponse) {
        console.log('We have a response: ' + response.data);
        return response.data
    })
    .catch(function (error : AxiosError) {
        console.log(error);
      });

}

export default apiGetter