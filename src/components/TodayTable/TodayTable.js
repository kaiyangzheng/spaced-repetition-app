import React, {useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import convertUtcToLocal from '../../utils/dateHelpers';
import { AiOutlineArrowRight } from 'react-icons/ai'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { BsArrowRightSquare } from 'react-icons/bs';
import './todaytable.css';

function createData(name, description, quality, prev_review_date) {
  return {
    name,
    description,
    quality,
    prev_review_date,
  };
}

export default function TodayTable(props) {
    const { tasks, setSelectedTaskPreview, setIsOpen } = props;
    const [showMore, setShowMore] = useState({});
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [theme, setTheme] = useState('light');
    const rows = tasks.map(task => createData(task.name, task.description, task.quality, task.prev_review_date));

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
        for (let i = 0; i < tasks.length; i++){
            setShowMore({...showMore, [i+1]: false});
        }
    }, [tasks])

    return <>
    <ThemeProvider theme={darkTheme}>
            <Paper>
                <TableContainer component={Paper}>
                    <Table
                        sx={{minWidth: 650}}
                        aria-label="simple table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell width={'10%'}>
                                        Name
                                    </TableCell>
                                    <TableCell align="left">
                                        Description
                                    </TableCell>
                                    <TableCell align="left">
                                        Quality
                                    </TableCell>
                                    <TableCell align="left">
                                        Previous Review Date
                                    </TableCell>
                                    <TableCell align="right">
                                        Actions 
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            <div className="task-name-container">
                                                <div className="task-name" data-tip data-for="description-tip" onClick={()=>{
                                                    setSelectedTaskPreview(row);
                                                    setIsOpen(true);
                                                }}>
                                                    {row.name}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell align="left" width="50%">
                                            <div className="description-container" onClick={()=>setShowMore({...showMore, [index+1]: !showMore[index+1]})}>
                                                {!showMore[index+1] ? row.description.slice(0, 70) + "..." : row.description}
                                            </div>
                                        </TableCell>
                                        <TableCell align="left">
                                            {row.quality}
                                        </TableCell>
                                        <TableCell align="left">
                                            {convertUtcToLocal(row.prev_review_date)}
                                        </TableCell>    
                                        <TableCell align="left">
                                            <AiOutlineArrowRight className="task-button-icon"></AiOutlineArrowRight>
                                        </TableCell>
                                        <TableCell align="right">
                                            <div className="task-actions-container">    
                                                <div className="goto-action action">
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
    </>
}