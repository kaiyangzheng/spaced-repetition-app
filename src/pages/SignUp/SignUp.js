import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import './signup.css'
import axiosInstance from '../../axiosApi'

export default function Login(props) {
  const { setLoggedIn } = props;
  const [user, setUser] = useState({"username": "", "email": "", "password": ""})
  const navigate = useNavigate();

  // set title
  useEffect(() => {
    document.title = 'Retask | Register'
  }, []);

  // check if user is logged in
  useEffect(()=>{
    if (localStorage.getItem('loggedIn') === 'true') {
        navigate('/');
    }
  }, [])

  const handleRegister = async (e) => {
    e.preventDefault();
    let response = await axiosInstance.post('/api/user/create/', user)
    console.log(response)
    response = await axiosInstance.post('/api/token/obtain/', user)
    console.log(response)
    axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access
    localStorage.setItem('loggedIn', true)
    localStorage.setItem('user', user['username'])
    localStorage.setItem('access_token', response.data.access)
    localStorage.setItem('refresh_token', response.data.refresh)
    setLoggedIn({loggedIn: true, user: user['username'], token: response.data.access})
    navigate('/')
  }

  return (  
    <div className="login-container">
      <div className="signup">
        <form>
          <div className="group head">
            <h1>Welcome!</h1>
            <h2>Create an Account</h2>
          </div>
          <div className="group">
            <label htmlFor="username">Username</label>
            <br />
            <input type="text" id="username" name="username" autoComplete="off" value={user.username} onChange={(e)=>setUser({...user, ['username']: e.target.value})}/>
          </div>
          <div className="group">
            <label htmlFor="email">Email</label>
            <br />
            <input type="email" id="email" name="email" autoComplete="off" value={user.email} onChange={(e)=>setUser({...user, ['email']: e.target.value})}/>
          </div>
          <div className="group">
            <label htmlFor="password">Password</label>
            <br />
            <input type="password" id="password" name="password" value={user.password} onChange={(e)=>setUser({...user, ['password']: e.target.value})}/>
          </div>
          <div className="group">
            <button type="submit" onClick={handleRegister}>
              Register
            </button>
          </div>
          <div className="group sign-up-link">
            <p>Already a User? <a href="#"> <Link to="/login">Login</Link></a></p>
          </div>
        </form>
      </div>
    </div>
  )
}
