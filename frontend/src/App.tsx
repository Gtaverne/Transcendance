import Header from "./components/Header";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'


function App() {
  return (
    <>
    <Router>
      <div className="container">
        <Header />
      </div>
    </Router>
    </>
  );
}

export default App;
