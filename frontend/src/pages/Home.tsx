// eslint-disable-next-line
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';

function Home() {
  const { user } = useSelector((state: RootStateOrAny) => state.auth);

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
