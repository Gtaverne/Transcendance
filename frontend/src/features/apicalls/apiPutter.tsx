import axios from 'axios';
import Cookies from 'js-cookie';

const URL_BACK = process.env.REACT_APP_BASE_URL! + process.env.REACT_APP_API_PATH!;

async function apiPutter(route: string, toPut: any): Promise<any> {
  // console.log('We get in apiPutter, route is: ' + route);
  return await axios.put(URL_BACK + route, toPut, {
    params: { jwt: Cookies.get('jwt') },
  });
}

export default apiPutter;
