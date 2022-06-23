import axios from 'axios';
import Cookies from 'js-cookie';

const URL_BACK = process.env.REACT_APP_URL_BACK || 'http://localhost:5050/';

async function apiGetter(route: string): Promise<any> {
  const resp = await axios.get(URL_BACK + route, {
    params: { jwt: Cookies.get('jwt') },
  });

  return resp;
}

export default apiGetter;
