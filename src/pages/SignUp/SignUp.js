import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './Signup.module.css'
import axiosInstance from './../../utils/axiosApi';

export default function Signup(props){
    const { setLoggedIn } = props;
    const [user, setUser] = useState({"username": "", "email": "", "password": ""})
    const navigate = useNavigate();

    // set title
    useEffect(()=>{
        document.title = 'Retask | Signup'
    }, [])

    // check if user is logged in
    useEffect(()=>{
        if (localStorage.getItem('loggedIn') === 'true') {
            navigate('/');
        }
    }, [])

    const handleRegister = async (e) => {
        e.preventDefault();
        axiosInstance.post('/api/user/create/', user)
        .then(response => {
            axiosInstance.post('/api/token/obtain/', user)
            .then(response => {
                axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access
                localStorage.setItem('loggedIn', true)
                localStorage.setItem('user', user['username'])
                localStorage.setItem('access_token', response.data.access)
                localStorage.setItem('refresh_token', response.data.refresh)
                setLoggedIn({loggedIn: true, user: user['username'], token: response.data.access})
                navigate('/')
            })
        })
    }

    return (
        <div className={styles.signupContainer}>
            <div className={styles.signup}>
                <form>
                    <div styles={styles.group}>
                        <h1>Welcome!</h1>
                        <h2>Create an Account</h2>
                    </div>
                    <div className={styles.group}>
                        <label htmlFor="username">Username</label>
                        <br />
                        <input type="text" id="username" name="username" autoComplete="off" value={user.username} onChange={(e)=>setUser({...user, ['username']: e.target.value})}/>
                    </div>
                    <div className={styles.group}>
                        <label htmlFor="email">Email</label>
                        <br />
                        <input type="email" id="email" name="email" autoComplete="off" value={user.email} onChange={(e)=>setUser({...user, ['email']: e.target.value})}/>
                    </div>
                    <div className={styles.group}>
                        <label htmlFor="password">Password</label>
                        <br />
                        <input type="password" id="password" name="password" autoComplete="off" value={user.password} onChange={(e)=>setUser({...user, ['password']: e.target.value})}/>
                    </div>
                    <div className={styles.group}>
                        <button onClick={handleRegister}>Signup
                            Register 
                        </button>
                    </div>
                    <div className={styles.signUpLink}>
                        <p>Already a User? <a href="#"> <Link to="/login">Login</Link></a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}