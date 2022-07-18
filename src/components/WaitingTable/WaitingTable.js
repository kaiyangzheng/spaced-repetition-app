import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import convertUtcToLocal from '../../utils/dateHelpers';

function createData(name, description, date_added) {
  return {
    name,
    description,
    date_added
  };
}

export default function WaitingTable(props) {
    const { tasks, setSelectedTaskPreview, setIsOpen } = props;
    const rows = tasks.map(task => createData(task.name, task.description, task.date_added));
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
    <Paper className={styles.root}>
        <TableContainer component={Paper}>
            <Table
                sx={{minWidth: 650}}
                aria-label="simple table"
                className={styles.table}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell width={'10%'} className={styles.tableCell}>
                                Name
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
                        {rows.map(row => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row" className={styles.tableCell}>
                                    <div className="task-name-container">
                                        <div className="task-name" data-tip data-for="description-tip" onClick={()=>{
                                            setSelectedTaskPreview(row);
                                            setIsOpen(true);
                                        }}>
                                            {row.name}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell align="left" className={styles.tableCell}>
                                    {convertUtcToLocal(row.date_added)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
        </TableContainer>
        </Paper>    
    </>
}   