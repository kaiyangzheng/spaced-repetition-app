import React, {useState, useEffect} from 'react'
import Modal from 'react-modal';
import './taskmodal.css'
import convertUtcToLocal from '../../utils/dateHelpers';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '500px',
    }
}

Modal.setAppElement('#root')

export default function TaskModal(props) {
  const { task, isModalOpen, setIsOpen } = props;
  return (
    <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
        contentLabel="Task Modal"
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
