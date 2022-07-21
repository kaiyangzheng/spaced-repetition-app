import React, {useState, useEffect} from 'react'
import Modal from 'react-modal';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import convertUtcToLocal from '../../utils/dateHelpers';
import axiosInstance from '../../axiosApi';
import './initiatetaskmodal.css'
import axios from 'axios';

const customStyles = {
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        minWidth: '20%',
        maxWidth: '50%',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        borderRadius: '4px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        overflow: 'hidden',
        zIndex: '9999',
        position: 'fixed',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }
      
}

const customStylesDark = {
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        minWidth: '20%',
        maxWidth: '50%',
        border: '1px solid #ccc',
        backgroundColor: '#1a1a1a',
        borderRadius: '4px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        overflow: 'hidden',
        zIndex: '9999',
        position: 'fixed',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }
}

Modal.setAppElement('#root')

export default function IntiateTaskModal(props) {
    const { selectedInitiateTask, setSelectedInitiateTask, isModalOpen, setIsModalOpen, tasks, setTasks, setWaitingTasks, waitingTasks} = props;
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [theme, setTheme] = useState('light');
    const [qualityValue, setQualityValue] = useState(-1);
    const [finishedTask, setFinishedTask] = useState(false);
  
    useEffect(()=>{
      if (prefersDarkMode) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }, [prefersDarkMode])

    const handleSubmit = async (e) => {
        e.preventDefault();
        axiosInstance.put(`/tasks/api/${selectedInitiateTask?.id}/`, {
            quality: qualityValue,
        })
        .then(res => {
            let updatedTask = res.data;
            console.log(updatedTask);
            let newTasks = tasks.map(task => {
                if (task.id === updatedTask.id) {
                    return updatedTask;
                }
                return task;
            });
            setTasks(newTasks);
            setSelectedInitiateTask(updatedTask);
            let newWaitingTasks = waitingTasks.filter(task => task.id !== updatedTask.id);
            setWaitingTasks(newWaitingTasks);
            setFinishedTask(true);
        })
    }

    return <>
        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={theme === 'dark' ? customStylesDark : customStyles}
        >
            {!finishedTask ? <div className="modal-title">
                <div className="modal-title-container initiate">
                    <h2>{selectedInitiateTask?.name}</h2>
                    <p className="task-description">{selectedInitiateTask?.description}</p>
                </div>
                <div className="task-quality-form">
                    <form onSubmit={handleSubmit}>
                        <h3>Complete the task above and indicate the degree of difficulty experienced</h3>
                        <h5>Make sure this is the <span className="underline">first</span> time you are doing this task!</h5>
                        <select name="quality" id="quality" className="selectmenu-element" value={qualityValue} onChange={(e)=>{setQualityValue(parseInt(e.target.value))}}>
                            <option selected="true" disabled="disabled" value="-1">Quality</option>    
                            <option value="0">0 - complete blackout</option>
                            <option value="1">1 - incorrect response; the correct one remembered</option>
                            <option value="2">2 - incorrect response; where the correct one seemed easy to recall</option>
                            <option value="3">3 - correct response recalled with serious difficulty</option>
                            <option value="4">4 - correct response after hesitation</option>
                            <option value="5">5 - perfect response</option>
                        </select>
                        <button className="initiate-task-button" type="submit">Complete</button>
                    </form>
                </div>
                <div className="modal-stats-container">
                    <span>Previous Quality: {selectedInitiateTask?.quality}</span>
                    <span>Ease Factor: {selectedInitiateTask?.ease_factor}</span>
                    <span>Total Repetitions: {selectedInitiateTask?.repetitions}</span>
                </div>
            </div> : 
            <div className="modal-title">
                <div className="modal-title-container initiate">
                    <h2>Successfully completed <strong className="underline">{selectedInitiateTask?.name}</strong>!</h2>
                    <div className="results-container">
                        Next review date: {convertUtcToLocal(selectedInitiateTask?.next_review_date)}
                    </div>
                    
                </div>
            </div>}
        </Modal>
    </>
}
