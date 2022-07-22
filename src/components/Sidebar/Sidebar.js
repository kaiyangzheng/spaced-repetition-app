import React, {useState, useEffect} from 'react'
import { AiOutlineHome, AiOutlineCalendar, AiOutlineExclamationCircle } from 'react-icons/ai'
import { MdOutlineNextPlan } from 'react-icons/md'
import { FiSettings } from 'react-icons/fi'
import { HiOutlineLogout } from 'react-icons/hi'
import { GoDiffAdded } from 'react-icons/go'
import { useNavigate } from 'react-router'
import { Link, useLocation } from 'react-router-dom'
import styles from './Sidebar.module.css';

export default function Sidebar(props) {
  const { setLoggedIn } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  // logout
  const handleLogout = () => {
    localStorage.removeItem('loggedIn')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setLoggedIn({loggedIn: false, user: {}, token: ""})
    navigate('/login')
  }
  
  // change active pathname
  useEffect(()=>{
    setActive(location.pathname)
  }, [location])
  
  return <>
    <div className={styles.sidebar}>
        <div className={styles.sidebarWrapper}>
            <div className={styles.sidebarMenu}>
                <h3 className={styles.sidebarTitle}>Tasks</h3>
                <ul className={styles.sidebarList}>
                    <Link to="/" style={{textDecoration: 'none'}}>
                    <li className={active === '/' ? styles.sidebarListItemActive : styles.sidebarListItem}>
                        <AiOutlineHome className={styles.sidebarIcon}/>
                        Home
                    </li>
                    </Link>
                    <Link to="/add-task" style={{textDecoration: 'none'}}>
                    <li className={active === '/add-task' ? styles.sidebarListItemActive : styles.sidebarListItem}>
                        <GoDiffAdded className={styles.sidebarIcon}/>
                        Add Task
                    </li>
                    </Link>
                    <li className={styles.sidebarListItem}>
                        <MdOutlineNextPlan className={styles.sidebarIcon} />
                        Upcoming
                    </li>
                    <li className={styles.sidebarListItem}>
                        <AiOutlineExclamationCircle className={styles.sidebarIcon} />
                        Overdue
                    </li>
                    <li className={styles.sidebarListItem}>
                        <AiOutlineCalendar className={styles.sidebarIcon} />
                        Calendar
                    </li>
                </ul>
            </div>
            <div className={styles.sidebarMenu}>
                <h3 className={styles.sidebarTitle}>Account</h3>
                <ul className={styles.sidebarList}>
                    <li className={styles.sidebarListItem}>
                        <FiSettings className={styles.sidebarIcon} />
                        Settings
                    </li>  
                    <li className={styles.sidebarListItem} onClick={handleLogout}>
                        <HiOutlineLogout className={styles.sidebarIcon} />
                        Logout
                    </li>
                </ul>
            </div>
        </div>
    </div>
  </>
}
