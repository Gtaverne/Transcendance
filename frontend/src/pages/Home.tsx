// eslint-disable-next-line
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import {toast} from 'react-toastify'

function Home() {
  const { user } = useSelector((state: RootStateOrAny) => state.auth);

  if (user && user.avatar && !user.avatar.includes('microcdn')) {
    toast.success('Welcome !\nYou can personnalize your avatar and pseudo in your profile page')
  }

  return (
    <>
      <div>Home</div>
      <div>
        {user && 'Hey buddy '}
        {user && user.username}
      </div>
      </>
  );
}
export default Home;
