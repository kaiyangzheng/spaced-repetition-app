import './App.css';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom'
import LoadingBar from 'react-top-loading-bar';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp/SignUp';
import AddTask from './pages/AddTask/AddTask';
import axiosInstance from './axiosApi';
import { getCurrentDate } from './utils/dateHelpers';

function App() {
  let date = getCurrentDate();
  const [loggedIn, setLoggedIn] = useState({loggedIn: false, user: {}, token: ""});
  const [tasks, setTasks] = useState([]);
  const [waitingTasks, setWaitingTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [location, setLocation] = useState('');

  // get login status from localStorage
  useEffect(()=>{
    if (localStorage.getItem('loggedIn') === 'true') {
      setLoggedIn({loggedIn: true, user: localStorage.getItem('user'), token: localStorage.getItem('access_token')});
    }
  }, [])
  
  // get all tasks
  useEffect(() => {
    setProgress(20);
    axiosInstance.get('/tasks/api/')
    .then(response => {
      setTasks(response.data);
      setProgress(100);
    })
    .catch(error => {
      console.log(error);
    })
  }, [loggedIn])

  // get tasks waiting to be reviewed
  useEffect(()=>{
    let waitingTasks = [];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i]?.prev_review_date == null) {
        waitingTasks.push(tasks[i]);
      }
    }
    setWaitingTasks(waitingTasks);
  }, [tasks])


  return <>
    <Router>
      <Topbar loggedIn={loggedIn}/>
      <LoadingBar progress={progress} onLoaderFinished={()=>{setProgress(0)}} />
      <div className="container">
        <Sidebar setLoggedIn={setLoggedIn}/>
        <Routes>
          <Route path="/"  element={<Home loggedIn={loggedIn} tasks={tasks} setTasks={setTasks} waitingTasks={waitingTasks} setWaitingTasks={setWaitingTasks} date={date} setProgress={setProgress} setLocation={setLocation}/>} />
          <Route path="/login"  element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} setProgress={setProgress}/>} />
          <Route path="/register"  element={<SignUp loggedIn={loggedIn} setLoggedIn={setLoggedIn} setProgress={setProgress}/>} />
          <Route path="/add-task"  element={<AddTask loggedIn={loggedIn} tasks={tasks} setTasks={setTasks} waitingTasks={waitingTasks} setWaitingTasks={setWaitingTasks} setProgress={setProgress} setLocation={setLocation}/>} />
        </Routes>
      </div>
    </Router>
  </>
}

export default App;
