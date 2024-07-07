import axios from "axios";
import { useContext, useEffect, useState } from "react"
import DataStoreContext from "../DataStoreContext";
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function MyTodos(){
    const dataStoreContext = useContext(DataStoreContext);
    const navigate = useNavigate();
    useEffect(() => {
        // https://stackoverflow.com/questions/5968196/how-do-i-check-if-a-cookie-exists
        // const matched = document.cookie.match(/^(.*;)?\s*token\s*=\s*[^;]+(.*)?$/)
        // console.log(matched)
        // if(matched === null){
        //   navigate("/login");
        // }
        if(!dataStoreContext.isInitialised){
          console.error("dataStoreContext has not yet initialized");
        }


        if(!dataStoreContext.token){
          console.error("token has not yet initialized");
        }
        console.log("MyTodos initialized");
      }, []);

    const [todos, setTodos] = useState([]);
    useEffect(() => {
      dataStoreContext.setIsLoading(true);
        axios.get(process.env.REACT_APP_BACKEND_URL + '/todos', { headers: { 'Authorization': 'Bearer ' +dataStoreContext.token}, withCredentials: true })
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
          dataStoreContext.setIsLoading(false);
        });
    }, []);

    const markAsComplete = (id, completed) => {
      dataStoreContext.setIsLoading(true);
      axios.patch(process.env.REACT_APP_BACKEND_URL + '/todos/' + id, { completed: completed}, { headers: { 'Authorization': 'Bearer ' +dataStoreContext.token}, withCredentials: true })
        .then(function (response) {
          console.log(response);
      
          const nextTodos = todos.map(todo => {
              if (todo.id === id) {
                // No change
                return {
                  ...todo,
                  completed: completed
                };
              } else {
                return todo;
              }
            });
            // Re-render with the new array
            setTodos(nextTodos);
            enqueueSnackbar("Todo updated", {variant: "success"})
        })
        .catch(function (error) {
          console.log(error);
          enqueueSnackbar("Error updating todo", {variant: "error"})
        })
        .finally(function () {
          dataStoreContext.setIsLoading(false);
        });
    }

    const deleteTodo = (id) => {
      dataStoreContext.setIsLoading(true);
      axios.delete(process.env.REACT_APP_BACKEND_URL + '/todos/' + id, { headers: { 'Authorization': 'Bearer ' +dataStoreContext.token}, withCredentials: true })
        .then(function (response) {
          console.log(response);
    
            // Re-render with the new array
            setTodos(todos.filter(todo => todo.id !== id));
            enqueueSnackbar("Todo deleted", {variant: "success"})
        })
        .catch(function (error) {
          console.log(error);
          enqueueSnackbar("Error deleting todo", {variant: "error"})
        })
        .finally(function () {
          dataStoreContext.setIsLoading(false);
        });
  }

  const [open, setOpen] = useState(false);
  const [removeItem, setRemoveItem] = useState({});

    return <>


      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm the deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {removeItem.item}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            setOpen(false);
            deleteTodo(removeItem.id);
          }} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>


        <h1>MyTodos page</h1>
        <IconButton aria-label="home" onClick={ () => navigate("/")} sx={{ mb: 3}}>
          <HomeIcon sx={{ fontSize: 40 }} />
        </IconButton>

        <IconButton aria-label="add everyday goal" onClick={ () => navigate("/my-todos/add")} sx={{ mb: 3}}>
          <AddCircleRoundedIcon sx={{ fontSize: 40 }} />
        </IconButton>

        {todos != null && todos.length > 0 &&
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        {/* <TableCell>Id</TableCell> */}
                        <TableCell align="left">Item</TableCell>
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
                              <IconButton aria-label="delete todo" onClick={ () => {
                                setOpen(true);
                                setRemoveItem({id: row.id, item: row.item});
                              }} > 
                                <RemoveCircleIcon sx={{ fontSize: 40 }} />
                              </IconButton>
                            </TableCell>
                            {/* <TableCell component="th" scope="row">
                                {row.id}
                            </TableCell> */}
                            <TableCell align="left">{row.item}</TableCell>
                            <TableCell align="right">{row.completed ? <Chip label="yes" color="success"/> : <Chip label="not yet"/>}</TableCell>
                            <TableCell align="right">
                                {row.completed ?  <Button variant="contained" color="warning"  onClick={ () => markAsComplete(row.id, false)}>Mark as todo</Button> : <Button variant="contained" onClick={ () => markAsComplete(row.id, true)}>Mark as complete</Button>}
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        }
    </>
}