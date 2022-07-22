import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {AiOutlineMenu, AiOutlineClose} from 'react-icons/ai';
import styles from './Topbar.module.css';

export default function Topbar(props) {
    const { loggedIn } = props;
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(!isOpen);
    }
    return (
        <div className={styles.topbar}>
            <div className={styles.topbarWrapper}>
                <div className={styles.topbarLeft}>
                    <AiOutlineMenu className={styles.menuIcon} onClick={handleOpen}/>
                    <div className={styles.logo}>
                        <span className={styles.logoLeft}>Re</span><span className={styles.logoRight}>Task</span>
                    </div>
                </div>
                <div className={styles.topbarRight}>
                    {!isOpen ? <span className={styles.username}>
                        {!loggedIn.loggedIn && 
                            <Link to="/login" className={styles.loginBar} style={{textDecoration: 'none'}}>Login</Link>}
                        {loggedIn.loggedIn &&
                            loggedIn.user}
                    </span> :
                    <div className="menuOpenRight">
                        <span className="logoLeft">Re</span><span className="logoRight">Task</span>
                    </div>}
                </div>
            </div>
        </div>
    )
}