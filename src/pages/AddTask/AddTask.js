import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';
import Slide from '@mui/material/Slide';
import axiosInstance from '../../axiosApi';
import convertUtcToLocal from '../../utils/dateHelpers';
import './addtask.css';

const delay = 3;

export default function AddTask(props) {
  const {loggedIn, tasks} = props;
  const navigate = useNavigate();
  const [task, setTask] = useState({
    'name': '',
    'description': '',
  })
  const [sortedTasks, setSortedTasks] = useState([]);
  const [goToHome, setGoToHome] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  
  // check if user is logged in
  useEffect(()=>{
    document.title = 'Retask | Add Task';
    if (localStorage.getItem('loggedIn') !== 'true') {
      navigate('/login');
    }
  }, [])  

  // save tasks to backend
  const handleSave = (e) => {
    e.preventDefault();
    axiosInstance.post('/tasks/api/', task)
    .then(res => {
      console.log(res);
      setTask({
        'name': '',
        'description': '',
      })
      if (goToHome) {
        navigate('/');
      }
    })
    .catch(err => {
      console.log(err);
      let errors = err.response.data;
      let errorMessage = {};
      for (let key in errors) {
        errorMessage[key] = errors[key][0];
      }
      setErrorMessage(errorMessage);
      setShowError(true);
      let timer = setTimeout(()=>setShowError(false), delay * 1000);
      return () => clearTimeout(timer);
    })
  }

  // sort tasks by date added 
  useEffect(()=>{ 
    let sortedTasks = tasks.sort((a, b) => {
      return new Date(b.date_added) - new Date(a.date_added);
    })
    setSortedTasks(sortedTasks);
  }, [tasks])

  return <>
    <div className="add-task">
        <h1>Add Task</h1>
        <div className="add-task-container">
          <div className="add-task-form">
            <form onSubmit={handleSave}>
              <div className="task-form-input">
                <label htmlFor="task-name" className="input-label">Task Name: </label>
                <input type="text" id="task-name" name="task-name" value={task['name']} onChange={(e)=>setTask({...task, 'name': e.target.value})}/>
              </div>
              <div className="task-form-input">
                <label htmlFor="task-description" className="input-label">Task Description: </label>
                <textarea type="text" id="task-description" name="task-description" value={task['description']} onChange={(e)=>setTask({...task, 'description': e.target.value})}/>
              </div>
              <div className="task-submit-container">
                <button type="submit" className="task-submit-btn add-another">
                  Save and Add Another
                </button>
                <button type="submit" className="task-submit-btn" onClick={()=>setGoToHome(true)}>
                  Save
                </button>
            </div>
            </form>
          </div>
        </div>
        <Slide direction="up" in={showError} mountOnEnter unmountOnExit>
            <div className="alert-container">
              {showError && <Alert severity="error" className="alert">
                <AlertTitle><strong>Error</strong></AlertTitle>
                {Object.keys(errorMessage).map((key, index)=>{
                  return <p key={index}>
                    <strong>{key}</strong>: {errorMessage[key]}
                  </p>
                })}
              </Alert>}
            </div>
        </Slide>
        <div className="history">
          <h1>History</h1>
          <div className="history-container">
            <div className="history-item">
              {sortedTasks?.map((task, index)=>{
                return <div key={index} className="history-item-container">
                  <div className="history-item-name">
                    <strong>{task.name}</strong>
                  </div>
                  <div className="history-item-date">
                    <strong>Added: {convertUtcToLocal(task.date_added)}</strong>
                  </div>
                </div>
              })}
            </div>
          </div>
        </div>
    </div>
  </>
}
