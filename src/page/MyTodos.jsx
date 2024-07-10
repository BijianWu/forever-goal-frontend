import axios from "axios";
import { useContext, useEffect, useState } from "react"
import DataStoreContext from "../DataStoreContext";
import { Box, Button, Card, CardActions, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DoneIcon from '@mui/icons-material/Done';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function MyTodos(){
    const dataStoreContext = useContext(DataStoreContext);
    const navigate = useNavigate();
    const matches = useMediaQuery('(min-width:600px)');
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
          localStorage.removeItem("token");
          navigate("/login");
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


        <Typography variant="h3" fontWeight={"bold"} sx={{ mb: 1}}>My Todos</Typography>
        <IconButton aria-label="home" onClick={ () => navigate("/")} sx={{ mb: 3}}>
          <HomeIcon sx={{ fontSize: 40 }} />
        </IconButton>

        <IconButton aria-label="add everyday goal" onClick={ () => navigate("/my-todos/add")} sx={{ mb: 3}}>
          <AddCircleRoundedIcon sx={{ fontSize: 40 }} />
        </IconButton>

        {todos != null && todos.length > 0 &&
              todos.map((row) => (
                <Box key={row.id}>
                  <Stack   direction={matches ? "row" : "column"} spacing={matches ? 4 : 0} justifyContent="space-between"
                  alignItems="center" sx={{ pb: 1}}>
                    <Typography variant="h5"  component="div" spacing={matches ? 1.5 : 0}>
                    {row.item}
                    </Typography>
                    
                      <Stack direction={"row"} spacing={1}>
                        {row.completed ?  <IconButton variant="contained"  color="success" onClick={ () => markAsComplete(row.id, false)}><CheckBoxIcon sx={{ fontSize: 40 }} /></IconButton> : <IconButton color="warning" variant="contained"  onClick={ () => markAsComplete(row.id, true)}><CheckBoxOutlineBlankIcon sx={{ fontSize: 40 }} /></IconButton>}
      
                        <IconButton aria-label="delete todo" onClick={ () => {
                          setOpen(true);
                          setRemoveItem({id: row.id, item: row.item});
                        }} > 
                          <DeleteForeverIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                        
                      </Stack>

                  </Stack>
                  <Divider style={{width:'100%'}} sx={{mb:3}} />
                </Box>
            //   <Card sx={{ minWidth: 275, m: 2 }}>
            //   <CardContent>

            //     <Typography variant="h5" component="div" sx={{ mb: 1.5 }}>
            //     {row.item}
            //     </Typography>
            //     {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
            //       Status {row.completed ? <Chip label="yes" color="success"/> : <Chip label="not yet"/>}
            //     </Typography> */}
            //     <Typography variant="body2">
            //       Actions  
            //     </Typography>
            //   </CardContent>
            //   <CardActions>
            //   {row.completed ?  <Button variant="contained" color="warning"  onClick={ () => markAsComplete(row.id, false)}><CheckBoxOutlineBlankIcon /></Button> : <Button variant="contained" color="success" onClick={ () => markAsComplete(row.id, true)}><CheckBoxIcon /></Button>}

            //   <IconButton aria-label="delete todo" onClick={ () => {
            //     setOpen(true);
            //     setRemoveItem({id: row.id, item: row.item});
            //   }} > 
            //     <RemoveCircleIcon sx={{ fontSize: 40 }} />
            //   </IconButton>
              
            //   </CardActions>
            // </Card>
          ))
        }

    </>
}