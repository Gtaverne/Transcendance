import axios from 'axios';
import Cookies from 'js-cookie';

const URL_BACK = process.env.REACT_APP_URL_BACK || 'http://localhost:3000/';

async function apiPutter(route: string, toPut: any): Promise<any> {
  // console.log('We get in apiPutter, route is: ' + route);
  return await axios.put(URL_BACK + route, toPut, {
    params: { jwt: Cookies.get('jwt') },
  });
}

export default apiPutter;
