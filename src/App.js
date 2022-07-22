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
import Signup from './pages/SignUp/SignUp';
import Home from './pages/Home/Home';
import axiosInstance from './utils/axiosApi';

export default function App() {
  const [loggedIn, setLoggedIn] = useState({loggedIn: false, user: {}, token: ""})
  const [tasks, setTasks] = useState([]);
  const [taskInfo, setTaskInfo] = useState({});
  const [nextTask, setNextTask] = useState({});

  // get login status from localStorage
  useEffect(() => {
    if (localStorage.getItem('loggedIn') === 'true') {
      setLoggedIn({loggedIn: true, user: localStorage.getItem('user'), token: localStorage.getItem('access_token')})
    }
  }, [])

  // get all tasks
  useEffect(() => {
    axiosInstance.get('/tasks/api/')
    .then(res => {
      setTasks(res.data)
    })
    .catch(error => {
      console.log(error)
    })
  }, [loggedIn, tasks])

  // Task info 
  useEffect(() => {
    let totalTasks = 0;
    let repetitions = 0;
    let actionRequired = 0;
    for (let i = 0; i < tasks.length; i++) {
      totalTasks++;
      repetitions += tasks[i].repetitions;
      if (tasks[i].prev_review_date == null){
        actionRequired++;
      }
    }
    setTaskInfo({totalTasks, repetitions, actionRequired})
  }, [tasks])

  // get next task
  useEffect(() => {
    let filteredTasks = tasks.filter(task => task.prev_review_date != null)
    filteredTasks.sort((a,b) => {
      return new Date(a.next_review_date) - new Date(b.next_review_date)
    })
    setNextTask(filteredTasks[0])
  }, [tasks])

  return (
    <Router>
      <Topbar loggedIn={loggedIn}/>
      <div className="container">
        <Sidebar setLoggedIn={setLoggedIn}/>
        <Routes>
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn}/>} />
          <Route path="/register" element={<Signup setLoggedIn={setLoggedIn}/>} />
          <Route path="/" element={<Home loggedIn={loggedIn} tasks={tasks} taskInfo={taskInfo} nextTask={nextTask}/>} />
        </Routes>
      </div>
    </Router>
  )
}
