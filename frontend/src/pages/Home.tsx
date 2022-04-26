import { Link, useNavigate } from 'react-router-dom';
import {RootStateOrAny, useSelector, useDispatch } from 'react-redux';

function Home() {

  const {user} = useSelector((state: RootStateOrAny) => state.auth)

  return (<>
    <div>Home</div>
    <div>{user && user.username}</div>
  </>
    )
}
export default Home