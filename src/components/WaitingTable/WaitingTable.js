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
import convertUtcToLocal from '../../utils/dateHelpers';
import { BsTrash } from 'react-icons/bs';

function createData(name, description, date_added) {
  return {
    name,
    description,
    date_added
  };
}

export default function WaitingTable(props) {
    const { tasks, setSelectedTaskPreview, setIsOpen } = props;
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [theme, setTheme] = useState('light');

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
                                            {row.name}
                                        </div>
                                    </TableCell>
                                    <TableCell align="left" className={styles.tableCell}>
                                        {convertUtcToLocal(row.date_added)}
                                    </TableCell>
                                    <TableCell align="right" className={styles.tableCell}>
                                        <div className="task-actions-container">
                                            <div className="delete-action">
                                                <BsTrash />
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