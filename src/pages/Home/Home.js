import React, {useEffect, useState} from 'react'
import { useNavigate, useLocation } from 'react-router'
import { AiOutlineArrowRight } from 'react-icons/ai'
import styles from './Home.module.css'

export default function Home (props) {
    const { loggedIn, tasks, taskInfo } = props
    const navigate = useNavigate()
    const location = useLocation()

    // check if user is logged in 
    useEffect(()=>{
        if (localStorage.getItem('loggedIn') === 'true') {
            navigate('/')
        }else{
            navigate('/login')
        }
    }, [])

    // set title
    useEffect(()=>{
        document.title = 'Retask | Home'
    }, [])

    return <>
        <div className={styles.home}>
            <div className={styles.overview}>
                <h1>Overview</h1>
                <div className={styles.overviewContainer}>
                    <div className={styles.overviewItem}>
                        <div className={styles.overviewItemTitle}>
                            📝 Tasks
                        </div>
                        <div className={styles.overviewItemContent}>
                            <div className="item">
                                {taskInfo.totalTasks} <span className={styles.taskDescription}>Tasks Added</span>
                            </div>
                            <div className="item">
                                {taskInfo.repetitions} <span className={styles.taskDescription}>Tasks Completed</span>
                            </div>
                            <div className="item">
                                {taskInfo.actionRequired} <span className={styles.taskDescription}>Tasks Needing Review</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.overviewItem}>
                        <div className={styles.overviewItemTitle}>
                            📋 Next Up
                        </div>
                        <div className={styles.overviewItemContent}>
                            <div className="item">

                            </div>
                            <div className="item">

                            </div>
                            <div className="item">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}