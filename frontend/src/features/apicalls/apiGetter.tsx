import axios from 'axios';
import Cookies from 'js-cookie';

const URL_BACK = process.env.REACT_APP_URL_BACK || 'http://localhost:3000/';

async function apiGetter(route: string): Promise<any> {
  return await axios.get(URL_BACK + route, {
    params: { jwt: Cookies.get('jwt') },
  });
}

export default apiGetter;
