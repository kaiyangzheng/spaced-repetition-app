import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import './App.css'


import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

export default function App() {
  const [loggedIn, setLoggedIn] = useState({loggedIn: false, user: {}, token: ""})

  // get login status from localStorage
  useEffect(() => {
    if (localStorage.getItem('loggedIn') === 'true') {
      setLoggedIn({loggedIn: true, user: localStorage.getItem('user'), token: localStorage.getItem('access_token')})
    }
  }, [])

  return (
    <Router>
      <Topbar loggedIn={loggedIn}/>
      <div className="container">
        <Sidebar setLoggedIn={setLoggedIn}/>
        <Routes>
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn}/>} />
          <Route path="/register" element={<Signup setLoggedIn={setLoggedIn}/>} />
        </Routes>
      </div>
    </Router>
  )
}
