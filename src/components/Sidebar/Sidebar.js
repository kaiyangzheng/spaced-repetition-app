import React, { useState, useEffect } from 'react'
import { AiOutlineHome, AiOutlineCalendar, AiOutlineExclamationCircle } from 'react-icons/ai'
import { MdOutlineToday, MdOutlineNextPlan } from 'react-icons/md'
import { FiSettings } from 'react-icons/fi'
import { HiOutlineLogout } from 'react-icons/hi'
import { GoDiffAdded } from 'react-icons/go'
import { useNavigate } from 'react-router'
import { Link, useLocation } from 'react-router-dom'
import './sidebar.css'

export default function Sidebar(props) {
  const { setLoggedIn } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const handleLogout = () => {
    localStorage.removeItem('loggedIn')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setLoggedIn({loggedIn: false, user: {}, token: ""})
    navigate('/login')
  }

  useEffect(()=>{
    setActive(location.pathname)
  }, [location])

  return (
    <div className="home-content-container">
        <div className="home-content-sidebar">
            <div className="sidebar-wrapper">
            <div className="sidebar-menu">
                <h3 className="sidebar-title">Tasks</h3>
                <ul className="sidebar-list">
                    <li className={active === '/' ? "sidebar-list-item active" : "sidebar-list-item"}>
                        <AiOutlineHome className="sidebar-icon"/>
                        Home
                    </li>
                    <li className="sidebar-list-item">
                        <GoDiffAdded className="sidebar-icon"/>
                        Add Task
                    </li>
                    <li className="sidebar-list-item">
                        <MdOutlineNextPlan className="sidebar-icon" />
                        Upcoming
                    </li>
                    <li className="sidebar-list-item">
                        <AiOutlineExclamationCircle className="sidebar-icon" />
                        Overdue 
                    </li>
                    <li className="sidebar-list-item">
                        <AiOutlineCalendar className="sidebar-icon" />
                        Calendar
                    </li>
                </ul>
            </div>
            <div className="sidebar-menu">
                <h3 className="sidebar-title">Account</h3>
                <ul className="sidebar-list">
                    <li className="sidebar-list-item">
                        <FiSettings className="sidebar-icon" />
                        Settings
                    </li>
                    <li className="sidebar-list-item" onClick={handleLogout}>
                        <HiOutlineLogout className="sidebar-icon" />
                        Logout
                    </li>
                </ul>
            </div>
            </div>
        </div>
    </div>
  )
}
