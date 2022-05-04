import React from 'react';

type Props = {};

function Landing({}: Props) {
  return (
    <>
      <div>Landing Page</div>
      <div>You are not logged in</div>
      <div>Use 42 authentication by clicking this button</div>
        <button className='logButton'>
          <a href="https://api.intra.42.fr/oauth/authorize?client_id=f950eb9f6505f95fd8146faeb36d1706ceda488419c445ab4fa7485903463bd6&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code"
          >Login</a>
        </button>
    </>
  );
}

export default Landing;
