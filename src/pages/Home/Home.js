import React, {useEffect, useState} from 'react'
import { useNavigate, useLocation } from 'react-router'
import './home.css'
import TaskModal from './../../components/TaskModal/TaskModal'
import { AiOutlineArrowRight } from 'react-icons/ai'
import TaskTable from './../../components/TaskTable/TaskTable'
import TodayTable from './../../components/TodayTable/TodayTable'
import WaitingTable from '../../components/WaitingTable/WaitingTable'
import ProgressBar from '../../components/ProgressBar/ProgressBar'
import BarChart from '../../components/BarChart/BarChart'
import 'react-circular-progressbar/dist/styles.css';

export default function Home(props) {
  const { loggedIn, tasks, setTasks, waitingTasks, setWaitingTasks, date, setProgress, setLocation} = props;
  const [tasksInfo, setTasksInfo] = useState({'repetitions': 0, 'actionRequired': 0});
  // TODO: determine most improved tasks
  const [taskStats, setTaskStats] = useState({'totalTasks': 0, 'totalPerfect': 0, 'totalUnderstood': 0, 'totalBlackout': 0, 'sortedTasks': []});
  const [understoodChartData, setUnderstoodChartData] = useState([]);
  const [sortChartKey, setSortChartKey] = useState('ease_factor');
  const [sortedChartData, setSortedChartData] = useState({});
  const [nextTask, setNextTask] = useState({});
  const [todayTasks, setTodayTasks] = useState([]);
  const [selectedTaskPreview, setSelectedTaskPreview] = useState({});
  const [isModalOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const loc = useLocation();

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
  
  useEffect(()=>{
    setLocation(loc);
  }, [])

  // get next task
  useEffect(()=>{
    let filteredTasks = tasks.filter(task=>task?.prev_review_date != null);
    filteredTasks.sort((a,b)=>{
      return new Date(a?.next_review_date) - new Date(b?.next_review_date);
    })
    setNextTask(filteredTasks[0]);
  }, [tasks])

  // get tasks todo today
  useEffect(()=>{
    let today = new Date();
    today = convertUtcToLocal(today);
    let todayTasks = tasks.filter(task => {
      let next_review_date = convertUtcToLocal(task?.next_review_date);
      return next_review_date === today;
    })
    setTodayTasks(todayTasks);
  }, [tasks])    

  // get task info 
  useEffect(()=>{
    let repetitions = 0;
    let actionRequired = 0;
    for (let task in tasks){
      let taskData = tasks[task];
      repetitions += taskData?.repetitions;
      if(taskData?.next_review_date == null){
        actionRequired += 1;
      }
    }
    setTasksInfo({'repetitions': repetitions, 'actionRequired': actionRequired});
  }, [tasks])

  // get task stats
  useEffect(()=>{
    let totalTasks = 0;
    let totalUnderstood = 0;
    let totalPerfect = 0;
    let totalBlackout = 0;

    for (let task in tasks){
      let taskData = tasks[task];
      if (taskData?.prev_review_date != null){
        totalTasks += 1;
      }
      if (taskData?.quality >= 3){
        totalUnderstood += 1;
      }
      if (taskData?.quality === 5){
        totalPerfect += 1;
      }
      if (taskData?.quality === 0 && taskData?.prev_review_date != null){
        totalBlackout += 1;
      }
    }
    tasks.sort((a,b) => {
      return b[sortChartKey]- a[sortChartKey];
    })
    setTaskStats({'totalTasks': totalTasks, 'totalPerfect': totalPerfect, 'totalUnderstood': totalUnderstood, 'totalBlackout': totalBlackout, 'sortedTasks': tasks});
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
    console.log('hi?', tasks);
  }, [tasks, sortChartKey])

  // set bar chart ordered by ease factor, also ignoring tasks that haven't been reviewed yet
  useEffect(()=>{
    let sortedTasks = [];
    for (let task in taskStats['sortedTasks']){
      let taskData = taskStats['sortedTasks'][task];
      if (taskData?.prev_review_date != null){
        sortedTasks.push({
          name: taskData.name,
          ease_factor: taskData.ease_factor,
          quality: taskData.quality,
        })
      }
    }
    console.log(sortedTasks);
    setSortedChartData({'topQuality': sortedTasks.slice(0, 6), 'bottomQuality': sortedTasks.slice(sortedTasks.length-6, sortedTasks.length).reverse()});
  }, [taskStats, sortChartKey])

  
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
              <div className="item mt-20">
                {tasks.length} <span className="description">Tasks Added</span>
              </div>
              <div className="item mt-20">
                {tasksInfo['repetitions']} <span className="description">Total Repetitions</span>
              </div>
              <div className="item mt-20">
                {tasksInfo['actionRequired']} <span className="description">Tasks Needing Action</span>
              </div>
            </div>
          </div>
          <div className="overview-item">
            <div className="overview-item-title">
              📋 Next Up
            </div>
            {nextTask ? <div className="overview-item-content">
              <div className="item" data-tip data-for="descriptionTip" onClick={()=>{setIsOpen(true); setSelectedTaskPreview(nextTask)}}>
                <span className="task-name">{nextTask?.name}</span>
              </div>
              <div className="item">Do Date: {convertUtcToLocal(nextTask?.next_review_date)}</div>
              <div className="item">
                <button className={"task-button"} disabled={!(nextTask?.next_review_date == date)}>
                    Go <AiOutlineArrowRight className="arrow-right"/>
                </button>
              </div>
            </div> : 
            <div className="overview-item-content">
              <div className="item">
                No tasks added yet. Create one!
              </div>
            </div>}
          </div> 
      </div>
      <div className="statistics">
        <div className="overview-container">
          <div className="overview-item">
              <div className="overview-item-title">
                📈 Statistics
              </div>
              {tasks.filter((task)=>task?.prev_review_date != null).length > 0 ? 
              <div className="overview-item-content chart">
                <div className="item">
                  {understoodChartData && 
                    <ProgressBar
                      progressVal={taskStats.totalUnderstood}
                      maxVal = {taskStats.totalTasks}
                      width = {200}
                      height = {200}
                      text = {'Tasks Understood'} 
                    />
                  }
                </div>
                <div className="item">
                    {sortedChartData &&
                      <ProgressBar
                        progressVal={taskStats.totalPerfect}
                        maxVal = {taskStats.totalTasks}
                        width = {200}
                        height = {200}
                        text = {'Perfect Tasks'}
                        pathColor={'#4CBB17'}
                      />
                    }
                </div>
                <div className="item">
                  {sortedChartData &&
                    <ProgressBar
                      progressVal={taskStats.totalBlackout}
                      maxVal = {taskStats.totalTasks}
                      width = {200}
                      height = {200}
                      text = {'Blackout Tasks'}
                      pathColor={'#FF0000'}
                    />}
                </div>
              </div> :
              <div className="overview-item-content">
                <div className="item">
                  No tasks to analyze. Create one!
                </div>
              </div>}
              <div className="overview-item-content chart">
                <div className="item">
                  {sortedChartData && <div className="bar-chart-container">
                    <BarChart taskData={sortedChartData.topQuality} title={`Top 6 Tasks Sorted By ${sortChartKey.toUpperCase()}`} color1={"rgba(53, 162, 235, 0.8)"} color2={"rgba(75, 192, 192, 0.8)"}/>
                  </div>}
                </div>
                <div className="item">
                <form className="sortkey-form">
                  <select name="sortKey" id="sortKey" className="selectmenu-element" value={sortChartKey} onChange={(e)=>setSortChartKey(e.target.value)}>
                    <option value="ease_factor">Ease Factor</option>
                    <option value="quality">Quality</option>
                  </select>
                </form>
                </div>
                <div className="item">
                  {sortedChartData && <div className="bar-chart-container">
                    <BarChart taskData={sortedChartData.bottomQuality} title={`Bottom 6 Tasks Sorted by ${sortChartKey.toUpperCase()}`} color1={"rgba(255, 99, 132, 0.8)"} color2={"rgba(201, 203, 207, 0.8)"}/>
                  </div>}
                </div>
              </div>
            </div>
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
                {todayTasks && <TodayTable tasks={todayTasks} setSelectedTaskPreview={setSelectedTaskPreview} setIsOpen={setIsOpen} setTasks={setTasks}/>}
              </div>
            </div>
          </div>
          <div className="tasks-item">
            <div className="tasks-item-title">
              🛑 Waiting for Review
            </div>
            <div className="item">
              <div className="task-table-container">
                {waitingTasks && <WaitingTable tasks={tasks} setSelectedTaskPreview={setSelectedTaskPreview} setIsOpen={setIsOpen} setTasks={setTasks} setWaitingTasks={setWaitingTasks} waitingTasks={waitingTasks} setProgress={setProgress}/>}
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
                    {tasks &&  <TaskTable tasks={tasks} setSelectedTaskPreview={setSelectedTaskPreview} setIsOpen={setIsOpen} setTasks={setTasks}/>}
                  </div>
                </div>
              </div>
          </div>
        </div>
    </div>
    <TaskModal task={selectedTaskPreview} isModalOpen={isModalOpen} setIsOpen={setIsOpen}/>
  </>
}
