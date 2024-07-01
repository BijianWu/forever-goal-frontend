import axios from "axios";
import { useContext, useEffect, useState } from "react"
import DataStoreContext from "../DataStoreContext";
import { Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export default function MyTodos(){
    const dataStoreContext = useContext(DataStoreContext);

    const [todos, setTodos] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL + '/todos', { withCredentials: true })
        .then(function (response) {
          // handle success
          console.log(response);
          setTodos(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
    }, []);

    const markAsComplete = (id) => {
        axios.patch('http://localhost:9090/todos/' + id, {}, { withCredentials: true})
          .then(function (response) {
            console.log(response);
        
            const nextTodos = todos.map(todo => {
                if (todo.id === id) {
                  // No change
                  return {
                    ...todo,
                    completed: true
                  };
                } else {
                  return todo;
                }
              });
              // Re-render with the new array
              setTodos(nextTodos);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    return <>
        <h1>MyTodos page</h1>

        {todos != null && todos.length > 0 &&
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell align="right">Item</TableCell>
                        <TableCell align="right">completed</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {todos.map((row) => (
                            <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.id}
                            </TableCell>
                            <TableCell align="right">{row.item}</TableCell>
                            <TableCell align="right">{row.completed ? <Chip label="yes" color="success"/> : <Chip label="not yet"/>}</TableCell>
                            <TableCell align="right">
                                {row.completed ?  <Button variant="contained" disabled></Button> : <Button variant="contained" onClick={ () => markAsComplete(row.id)}>Mark as complete</Button>}
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        }
    </>
}