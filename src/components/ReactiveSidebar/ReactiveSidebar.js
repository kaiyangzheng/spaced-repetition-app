import React, { useState, useEffect } from 'react'
import { AiOutlineHome, AiOutlineCalendar, AiOutlineExclamationCircle } from 'react-icons/ai'
import { MdOutlineToday, MdOutlineNextPlan } from 'react-icons/md'
import { FiSettings } from 'react-icons/fi'
import { GrLogout } from 'react-icons/gr'
import { GoDiffAdded } from 'react-icons/go'
import { useNavigate } from 'react-router'
import { HiOutlineLogout } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import './reactivesidebar.css'

export default function ReactiveSidebar(props) {
  const { setLoggedIn, setIsOpen } = props;
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
    <div className="home-content-container-reactive">
        <div className="home-content-sidebar-reactive">
            <div className="sidebar-wrapper">
            <div className="sidebar-menu">
                <h3 className="sidebar-title">Tasks</h3>
                <ul className="sidebar-list">
                    <Link to="/">
                    <li className={active === '/' ? "sidebar-list-item active" : "sidebar-list-item"} onClick={()=>setIsOpen(false)}>
                        <AiOutlineHome className="sidebar-icon"/>
                        Home
                    </li>
                    </Link>
                    <Link to="/add-task">
                    <li className={active === '/add-task' ? "sidebar-list-item active" : "sidebar-list-item"} onClick={()=>setIsOpen(false)}>
                        <GoDiffAdded className="sidebar-icon"/>
                        Add Task
                    </li>
                    </Link>
                    <li className="sidebar-list-item">
                        <MdOutlineNextPlan className="sidebar-icon" onClick={()=>setIsOpen(false)}/>
                        Upcoming
                    </li>
                    <li className="sidebar-list-item">
                        <AiOutlineExclamationCircle className="sidebar-icon" onClick={()=>setIsOpen(false)}/>
                        Overdue 
                    </li>
                    <li className="sidebar-list-item">
                        <AiOutlineCalendar className="sidebar-icon" onClick={()=>setIsOpen(false)}/>
                        Calendar
                    </li>
                </ul>
            </div>
            <div className="sidebar-menu">
                <h3 className="sidebar-title">Account</h3>
                <ul className="sidebar-list">
                    <li className="sidebar-list-item">
                        <FiSettings className="sidebar-icon" onClick={()=>setIsOpen(false)}/>
                        Settings
                    </li>
                    <li className="sidebar-list-item" onClick={handleLogout}>
                        <HiOutlineLogout className="sidebar-icon" onClick={()=>setIsOpen(false)}/>
                        Logout
                    </li>
                </ul>
            </div>
            </div>
        </div>
    </div>
  )
}
