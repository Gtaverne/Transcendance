import React from 'react';
import './App.css';
import {Link} from 'react-router-dom'


function App() {
  return (
    <div className="App">
      <h1>Bienvenue</h1>
         <button type='button' onClick={(e) => {
         e.preventDefault();
         window.location.href="https://api.intra.42.fr/oauth/authorize?client_id=f950eb9f6505f95fd8146faeb36d1706ceda488419c445ab4fa7485903463bd6&redirect_uri=http%3A%2F%2Flocalhost%2Fapi%2Fcallback&response_type=code"}
        }>
        Authentification
        </button>
    </div>
  );
}

export default App;
