import './App.css';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import axios from 'axios';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp/SignUp';


function App() {
  const [loggedIn, setLoggedIn] = useState({loggedIn: false, user: {}, token: ""});
  const [tasks, setTasks] = useState([]);
  const url = window.location.href;

  // get login status from localStorage
  useEffect(()=>{
    if (localStorage.getItem('loggedIn') === 'true') {
      setLoggedIn({loggedIn: true, user: localStorage.getItem('user'), token: localStorage.getItem('access_token')});
    }
  }, [])

  
  return <>
    <Router>
      <Topbar loggedIn={loggedIn}/>
      <div className="container">
        {url.endsWith('/') && <Sidebar setLoggedIn={setLoggedIn}/>}
        <Routes>
          <Route path="/"  element={<Home loggedIn={loggedIn}/>}/>
          <Route path="/login"  element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}/>
          <Route path="/register"  element={<SignUp loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}/>
        </Routes>
      </div>
    </Router>
  </>
}

export default App;
