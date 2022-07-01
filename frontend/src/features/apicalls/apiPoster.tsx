import axios from 'axios';
import Cookies from 'js-cookie';

const URL_BACK = process.env.REACT_APP_BASE_URL! + process.env.REACT_APP_API_PATH!;

async function apiPoster(route: string, toPost: any): Promise<any> {
  // console.log('We get in apiPoster, route is: ' + route);
  return await axios.post(URL_BACK + route, toPost, {
    params: { jwt: Cookies.get('jwt') },
  });
}

export default apiPoster;
