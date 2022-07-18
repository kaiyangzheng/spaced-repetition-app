import './App.css';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp/SignUp';
import AddTask from './pages/AddTask/AddTask';

function App() {
  const [loggedIn, setLoggedIn] = useState({loggedIn: false, user: {}, token: ""});
  const [tasks, setTasks] = useState([]);

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
        <Sidebar setLoggedIn={setLoggedIn}/>
        <Routes>
          <Route path="/"  element={<Home loggedIn={loggedIn} tasks={tasks} setTasks={setTasks}/>}/>
          <Route path="/login"  element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}/>
          <Route path="/register"  element={<SignUp loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}/>
          <Route path="/add-task"  element={<AddTask loggedIn={loggedIn}/>}/>
        </Routes>
      </div>
    </Router>
  </>
}

export default App;
