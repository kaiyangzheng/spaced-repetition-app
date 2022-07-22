import React, {useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { convertUtcToLocal } from '../../utils/dateHelpers';
import { BsTrash } from 'react-icons/bs';
import { BsArrowRightSquare } from 'react-icons/bs';
import { deleteTask } from '../../utils/taskActionHelpers';
import InitiateTaskModal from '../InitiateTaskModal/InitiateTaskModal';
import './waitingtable.css';

function createData(id, name, description, date_added) {
  return {
    id,
    name,
    description,
    date_added
  };
}

export default function WaitingTable(props) {
    const { tasks, setSelectedTaskPreview, setIsOpen, setTasks, setWaitingTasks, waitingTasks, setProgress} = props;
    const [showMore, setShowMore] = useState({});
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [theme, setTheme] = useState('light');
    const [selectedInitiateTask, setSelectedInitiateTask] = useState(null);
    const [isInitiateTaskModalOpen, setIsInitiateTaskModalOpen] = useState(false);

    useEffect(() => {
        if (prefersDarkMode) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, [prefersDarkMode]);

    const darkTheme = createTheme({
        palette: {
            mode: theme,
        },
    })

    useEffect(()=>{
        for (let i = 0; i < waitingTasks.length; i++){
            setShowMore({...showMore, [i+1]: false});
        }
    }, [waitingTasks])

    const rows = waitingTasks.map(task => createData(task?.id, task?.name, task?.description, task?.date_added));
    const styles = theme => ({
        root: {
          display: 'flex',
          marginTop: theme.spacing.unit * 3,
          overflowX: 'hide',
        },
        table: {
          minWidth: 340,
        },
        tableCell: {
          paddingRight: 4,
          paddingLeft: 5
        }
      });
    return <>
    <ThemeProvider theme={darkTheme}>
        <Paper className={styles.root}>
            <TableContainer component={Paper}>
                <Table
                    sx={{minWidth: 650}}
                    aria-label="simple table"
                    className={styles.table}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell className={styles.tableCell}>
                                    Name
                                </TableCell>
                                <TableCell align="left">
                                    Description
                                </TableCell>
                                <TableCell align="left" className={styles.tableCell}>
                                    Date Added
                                </TableCell>
                                <TableCell align="right" className={styles.tableCell}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows?.map((row, index) => (
                                <TableRow key={row?.name}>
                                    <TableCell component="th" scope="row" className={styles.tableCell}>
                                        <div className="task-name-container">
                                            {row?.name}
                                        </div>
                                    </TableCell>
                                    <TableCell align="left" width="50%">
                                        <div className="description-container" onClick={()=>setShowMore({...showMore, [index+1]: !showMore[index+1]})}>
                                            {!showMore[index+1] ? row?.description?.slice(0, 70) + "..." : row?.description}
                                        </div>
                                    </TableCell>
                                    <TableCell align="left" className={styles.tableCell}>
                                        {convertUtcToLocal(row?.date_added)}
                                    </TableCell>
                                    <TableCell align="right" className={styles.tableCell}>
                                        <div className="task-actions-container">
                                            <div className="delete-action action" onClick={()=>{
                                                deleteTask(row?.id);
                                                setTasks(tasks.filter(task => task?.id !== row.id));
                                            }}>
                                                <BsTrash />
                                            </div>
                                            <div className="goto-action action" onClick={()=>{
                                                setSelectedInitiateTask(tasks.filter(task => task?.id === row?.id)[0]);
                                                setIsInitiateTaskModalOpen(true);
                                            }}>
                                                <BsArrowRightSquare />
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
            </TableContainer>
            </Paper>   
    </ThemeProvider>
    <InitiateTaskModal isModalOpen={isInitiateTaskModalOpen} setIsModalOpen={setIsInitiateTaskModalOpen} selectedInitiateTask={selectedInitiateTask} setSelectedInitiateTask={setSelectedInitiateTask} tasks={tasks} setTasks={setTasks} setWaitingTasks={setWaitingTasks} waitingTasks={waitingTasks} setProgress={setProgress}/>
    </>
}   