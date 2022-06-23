import axios from 'axios';
import Cookies from 'js-cookie';

const URL_BACK = process.env.REACT_APP_URL_BACK || 'http://localhost:3000/';

async function apiPoster(route: string, toPost: any): Promise<any> {
  // console.log('We get in apiPoster, route is: ' + route);
  return await axios.post(URL_BACK + route, toPost, {
    params: { jwt: Cookies.get('jwt') },
  });
}

export default apiPoster;
