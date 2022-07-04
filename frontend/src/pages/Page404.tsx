import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.svg';

function Page404() {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    setTimeout(() => setCounter(counter - 1), 1000);
    if (counter <= 0) {
      navigate('/');
    }
  }, [counter, navigate]);

  return (
    <div className="landingPage">
      <img src={logo} style={{ width: '300px' }} alt="" />

      <div
        style={{
          padding: '40px',
          fontSize: '40px',
          fontFamily: 'Helvetica',
          fontWeight: 'bold',
        }}
      >
        <h1>404 Page not found</h1>
        <h4>You will be redirected soon, lost wanderer</h4>
        {/* <h1>{counter}</h1> */}
      </div>
    </div>
  );
}

export default Page404;
