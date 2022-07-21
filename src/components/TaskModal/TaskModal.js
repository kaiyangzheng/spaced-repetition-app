import React, {useState, useEffect} from 'react'
import Modal from 'react-modal';
import './taskmodal.css'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { convertUtcToLocal } from '../../utils/dateHelpers';

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
        minWidth: '30%',
        maxWidth: '70%',
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
        minWidth: '30%',
        maxWidth: '70%',
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

export default function TaskModal(props) {
  const { task, isModalOpen, setIsOpen } = props;
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [theme, setTheme] = useState('light');

  useEffect(()=>{
    if (prefersDarkMode) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [prefersDarkMode])

  return (
    <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsOpen(false)}
        style={theme === 'dark' ? customStylesDark : customStyles}
        contentLabel="Task Modal"
        className="task-modal"
    >
        <div className="modal-title">
            <div className="modal-title-container">
                <h2>{task?.name}</h2>
                <span>Do Date: {convertUtcToLocal(task?.next_review_date)}</span>
            </div>
            <p>{task?.description}</p>
            <div className="modal-stats-container">
                <span>Previous Quality: {task?.quality}</span>
                <span>Ease Factor: {task?.ease_factor}</span>
                <span>Total Repetitions: {task?.repetitions}</span>
            </div>
        </div>
    </Modal>
  )
}
