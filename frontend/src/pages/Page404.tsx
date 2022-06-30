import { useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.svg';

type Props = {};

function Page404({}: Props) {
  const { user } = useSelector((state: RootStateOrAny) => state.auth);
  const navigate = useNavigate();
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    setTimeout(() => setCounter(counter - 1), 1000);
    if (counter <= 0) {
      navigate('/');
    }
  }, [counter]);

  return (
    <div className="landingPage">
      <img src={logo} style={{ width: '300px' }} />

      <div
        style={{ padding: '40px', fontSize: '40px', fontFamily: 'Comic Sans' }}
        // HAHAHAHAHAHHA
      >
        <h1>404</h1>
        <h2>You will be redirected soon, lost wanderer</h2>
        {/* <h1>{counter}</h1> */}
      </div>
    </div>
  );
}

export default Page404;
