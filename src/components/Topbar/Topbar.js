import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineMenu } from 'react-icons/ai'
import { AiOutlineClose } from 'react-icons/ai'
import ReactiveSidebar from './../ReactiveSidebar/ReactiveSidebar'
import './topbar.css'

export default function Topbar(props) {
  const { loggedIn } = props;
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpen = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="home-content-topbar">
      {isOpen && <AiOutlineClose className="close-button" onClick={handleOpen}/>}
      {isOpen && <ReactiveSidebar loggedIn={loggedIn} setIsOpen={setIsOpen}/>}
        <div className="topbar-wrapper">
            <div className="topbar-left">
                <AiOutlineMenu className="menu-icon" onClick={handleOpen}/>
                <span className="logo-left">Re</span><span className="logo-right">task</span>
            </div>
            <div className="topbar-right">
                {!isOpen ? <span className="username">
                  {loggedIn.loggedIn ? loggedIn.user : 
                    <Link to="/login">Login</Link>}
                </span> :
                <div className="menu-open-right">
                  <span className="logo-left">Re</span><span className="logo-right">task</span>
                </div>}  
            </div>
        </div>
    </div>
  )
}
