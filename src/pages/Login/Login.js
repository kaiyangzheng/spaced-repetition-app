import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import './login.css'  
import axiosInstance from './../../axiosApi';

export default function Login(props) {
  const { setLoggedIn, setProgress } = props;
  const navigate = useNavigate();
  const [user, setUser] = useState({"username": "", "password": ""})


  // check if user is logged in
  useEffect(()=>{
    if (localStorage.getItem('loggedIn') === 'true') {
      navigate('/');
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault();
    setProgress(20);
    let response = await axiosInstance.post('/api/token/obtain/', user)
    console.log(response)
    axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access
    localStorage.setItem('loggedIn', true)
    localStorage.setItem('user', user['username'])
    localStorage.setItem('access_token', response.data.access)
    localStorage.setItem('refresh_token', response.data.refresh)
    setLoggedIn({loggedIn: true, user: user['username'], token: response.data.access})
    setProgress(100);
    navigate('/')
  }

  // set title
  useEffect(() => {
    document.title = 'Retask | Login'
  }, []);

  return (  
    <div className="login-container">
      <div className="login">
        <form>
          <div className="group head">
            <h1>Welcome Back!</h1>
            <h2>Login</h2>
          </div>
          <div className="group">
            <label htmlFor="username">Username</label>
            <br />
            <input type="text" id="username" name="username" autoComplete="off" value={user.username} onChange={(e)=>setUser({...user, ['username']: e.target.value})}/>
          </div>
          <div className="group">
            <label htmlFor="password">Password</label>
            <br />
            <input type="password" id="password" name="password" value={user.password} onChange={(e)=>setUser({...user, ['password']: e.target.value})}/>
          </div>
          <div className="group">
            <button type="submit" onClick={handleLogin}>
              Login
            </button>
          </div>
          <div className="group sign-up-link">
            <p>New User? <a href="#"><Link to="/register">Register</Link></a></p>
          </div>
        </form>
      </div>
      </div>
  )
}
