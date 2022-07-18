import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router'
import './home.css'
import axiosInstance from '../../axiosApi'
import TaskModal from './../../components/TaskModal/TaskModal'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid} from 'recharts';
import TaskTable from './../../components/TaskTable/TaskTable'
import TodayTable from './../../components/TodayTable/TodayTable'
import WaitingTable from '../../components/WaitingTable/WaitingTable'


export default function Home(props) {
  const { loggedIn, tasks, setTasks } = props;
  const [tasksInfo, setTasksInfo] = useState({'repetitions': 0, 'actionRequired': 0});
  // TODO: determine most improved tasks
  const [taskStats, setTaskStats] = useState({'totalTasks': 0, 'totalUnderstood': 0, 'sortedTasks': []});
  const [understoodChartData, setUnderstoodChartData] = useState([]);
  const [sortedChartData, setSortedChartData] = useState([]);
  const [nextTask, setNextTask] = useState({});
  const [todayTasks, setTodayTasks] = useState([]);
  const [waitingTasks, setWaitingTasks] = useState([]);
  const [selectedTaskPreview, setSelectedTaskPreview] = useState({});
  const [isModalOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const convertUtcToLocal = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleDateString();
  }

  // check if user is logged in
  useEffect(()=>{
    document.title = 'Retask | Home'
    if (localStorage.getItem('loggedIn') === 'true') {
        return;
    }
    if(!loggedIn.loggedIn){
      navigate('/login');
    }
  }, [])

  // get all tasks
  useEffect(() => {
    axiosInstance.get('/tasks/api/')
    .then(response => {
      setTasks(response.data);
    })
  }, [])

  // get next task
  useEffect(()=>{
    let filteredTasks = tasks.filter(task=>task.prev_review_date != null);
    filteredTasks.sort((a,b)=>{
      return new Date(a.next_review_date) - new Date(b.next_review_date);
    })
    setNextTask(filteredTasks[0]);
  }, [tasks])

  // get tasks todo today
  useEffect(()=>{
    let today = new Date();
    today = convertUtcToLocal(today);
    let todayTasks = tasks.filter(task => {
      let next_review_date = convertUtcToLocal(task.next_review_date);
      return next_review_date === today;
    })
    setTodayTasks(todayTasks);
  }, [tasks])    

  // get tasks waiting to be reviewed
  useEffect(()=>{
    let waitingTasks = [];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks.prev_review_date == null) {
        waitingTasks.push(tasks[i]);
      }
    }
    setWaitingTasks(waitingTasks);
  }, [tasks])

  // get task info 
  useEffect(()=>{
    let repetitions = 0;
    let actionRequired = 0;
    for (let task in tasks){
      let taskData = tasks[task];
      repetitions += taskData.repetitions;
      if(taskData.next_review_date == null){
        actionRequired += 1;
      }
    }
    setTasksInfo({'repetitions': repetitions, 'actionRequired': actionRequired});
  }, [tasks])

  // get task stats
  useEffect(()=>{
    let totalTasks = 0;
    let totalUnderstood = 0;

    for (let task in tasks){
      let taskData = tasks[task];
      totalTasks += 1;
      if (taskData.quality >= 3){
        totalUnderstood += 1;
      }
    }
    tasks.sort((a,b) => {
      return b.ease_factor - a.ease_factor;
    })
    setTaskStats({'totalTasks': totalTasks, 'totalUnderstood': totalUnderstood, 'sortedTasks': tasks});
    // set understood radial chart data
    setUnderstoodChartData([
      {
        name: "Total Tasks",
        tasks: totalTasks,
        fill: "#8884d8"
      },
      {
        name: "Tasks Understood",
        tasks: totalUnderstood,
        fill: "#82ca9d"
      }
    ])
  }, [tasks])

  // set bar chart ordered by ease factor, also ignoring tasks that haven't been reviewed yet
  useEffect(()=>{
    let sortedTasks = [];
    for (let task in taskStats['sortedTasks']){
      let taskData = taskStats['sortedTasks'][task];
      if (taskData.prev_review_date != null){
        sortedTasks.push({
          name: taskData.name,
          ease_factor: taskData.ease_factor,
        })
      }
    }
    setSortedChartData(sortedTasks);
  }, [taskStats])

  const radialStyle = {
    top: 0,
    left: 0,
    lineHeight: "24px",
    padding: "0px 24px",
    position: "absolute",
    textAlign: "center",
    width: "100%",
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    transform: "translateX(25%)"
  };

  const barStyle = {
    lineHeight: "24px",
    padding: "0px 24px",
    position: "absolute",
    textAlign: "center",
    width: "100%",
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    transform: "translateX(40%)"
  }
  
  return <>
    <div className="home">
      <div className="overview">
        <h1>Overview</h1>
        <div className="overview-container">
          <div className="overview-item">
            <div className="overview-item-title">
              📝 Tasks
            </div>
            <div className="overview-item-content">
              <div className="item">
                {tasks.length} <span className="description">Tasks Added</span>
              </div>
              <div className="item">
                {tasksInfo.repetitions} <span className="description">Total Repetitions</span>
              </div>
              <div className="item">
                {tasksInfo.actionRequired} <span className="description">Tasks Waiting</span>
              </div>
            </div>
          </div>
          <div className="overview-item">
            <div className="overview-item-title">
              📋 Next Up
            </div>
            {nextTask ? <div className="overview-item-content">
              <div className="item" data-tip data-for="descriptionTip" onClick={()=>setIsOpen(true)}>
                <span className="task-name">{nextTask?.name}</span>
              </div>
              <div className="item">Do Date: {convertUtcToLocal(nextTask?.next_review_date)}</div>
              <div className="item">
                <button className="task-button">
                    <span className="task-button-text">Go <AiOutlineArrowRight className="arrow-right"/></span>
                </button>
              </div>
            </div> : 
            <div className="overview-item-content">
              <div className="item">
                No tasks added yet. Create one!
              </div>
            </div>}
          </div> 
          <div className="overview-item">
            <div className="overview-item-title">
              📈 Statistics
            </div>
            {tasks.filter((task)=>task.prev_review_date != null).length > 0 ? <div className="overview-item-content chart">
              <div className="item">
                {understoodChartData && <RadialBarChart
                  width={160}
                  height={100}
                  cx={30}
                  cy={50}
                  innerRadius={"10%"}
                  outerRadius={"80%"}
                  barSize={15}
                  data={understoodChartData}
                  startAngle={180} 
                  endAngle={0}
                >
                  <RadialBar
                    minAngle={15}
                    label={{ position: 'insideTop', fill: 'white', fontSize: '10px',  }}
                    background
                    clockWise
                    dataKey="tasks"
                  />
                    <Legend iconSize={8} layout="vertical" verticalAlign="middle" wrapperStyle={radialStyle} />
                    <Tooltip/>
                </RadialBarChart>}
              </div>
              <div className="item">
                {sortedChartData && <BarChart
                  width={500}
                  height={100}
                  data={sortedChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={16}/>
                  <YAxis fontSize={16}/>
                  <Tooltip />
                  <Legend iconSize={8} layout="vertical" verticalAlign="bottom" wrapperStyle={barStyle}/>
                  <Bar dataKey="ease_factor" fill="#82ca9d" />
                </BarChart>}
              </div>
            </div> :
            <div className="overview-item-content">
              <div className="item">
                No tasks to analyze. Create one!
              </div>
            </div>}
          </div>
        </div>
      </div>
      <div className="tasks">
        <h1>Tasks</h1>
        <div className="tasks-container">
          <div className="tasks-item">
            <div className="tasks-item-title">
              📅 Todo Today
            </div>
            <div className="item">
              <div className="task-table-container">
                {todayTasks && <TodayTable tasks={todayTasks} setSelectedTaskPreview={setSelectedTaskPreview} setIsOpen={setIsOpen}/>}
              </div>
            </div>
          </div>
          <div className="tasks-item">
            <div className="tasks-item-title">
              🛑 Waiting for Review
            </div>
            <div className="item">
              <div className="task-table-container">
                {waitingTasks && <WaitingTable tasks={waitingTasks} setSelectedTaskPreview={setSelectedTaskPreview} setIsOpen={setIsOpen}/>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tasks mt-5">
        <div className="tasks-container">
          <div className="tasks-item">
                <div className="tasks-item-title">
                  ➕ All Added Tasks
                </div>
                <div className="item">
                  <div className="task-table-container">
                    {tasks &&  <TaskTable tasks={tasks} setSelectedTaskPreview={setSelectedTaskPreview} setIsOpen={setIsOpen}/>}
                  </div>
                </div>
              </div>
          </div>
        </div>
    </div>
    <TaskModal task={nextTask} isModalOpen={isModalOpen} setIsOpen={setIsOpen}/>
    <TaskModal task={selectedTaskPreview} isModalOpen={isModalOpen} setIsOpen={setIsOpen}/>
  </>
}
