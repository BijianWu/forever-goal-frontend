import axios from "axios";
import { useContext, useEffect, useState } from "react"
import DataStoreContext from "../DataStoreContext";
import { Box, Button, Card, CardActions, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useNavigate, useSearchParams } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DoneIcon from '@mui/icons-material/Done';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function MyTodos(){
  const getValidatedSearchParams = () => {
    const sParam = searchParams.get('show');

    if(sParam == null || sParam === undefined){
      return 0;
    } else{
      if(sParam < 0){
        setSearchParams({ show: 0}, {replace: true});
        return 0;
      } else if(sParam > 2){
        setSearchParams({ show: 2}, {replace: true});
        return 2;
      }
    }

    return sParam;
  }

    const dataStoreContext = useContext(DataStoreContext);
    const navigate = useNavigate();
    const matches = useMediaQuery('(min-width:600px)');
    const [todos, setTodos] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    // const showSearchQueryParam = searchParams.get('show');
    const [show, setShow] = useState(getValidatedSearchParams());
    const handleShowChange = (event) => {
      setShow(event.target.value);
      // const queryString = "?show=" + event.target.value;
      setSearchParams({ show: event.target.value}, {replace: true});
      getTodos(dataStoreContext.token, event.target.value);
    };



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

    useEffect(() => {
        getTodos(dataStoreContext.token);
    }, []);

    const getTodos = async (token, showParam) => {
      const queryString = showParam == null ? "?show=" + searchParams.get('show') : "?show=" + showParam;
      dataStoreContext.setIsLoading(true);

      await axios.get(process.env.REACT_APP_BACKEND_URL + '/todos' + queryString, { headers: { 'Authorization': 'Bearer ' + token}, withCredentials: true })
        .then(function (response) {
          // handle success
          console.log(response);
          setTodos(response.data);
        })
        .catch(async function (error) {
          if(error.response.status === 401){
            console.log("refreshing right now")
            // retry refresh
            const token = await dataStoreContext.refresh();
            await getTodos(token, showParam);
          } else{
            // handle error
            console.log(error);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            navigate("/login");
          }

        })
       
        dataStoreContext.setIsLoading(false);
    }

    const markAsComplete = async (id, completed, token) => {
      dataStoreContext.setIsLoading(true);

      await axios.patch(process.env.REACT_APP_BACKEND_URL + '/todos/' + id, { completed: completed}, { headers: { 'Authorization': 'Bearer ' + token}, withCredentials: true })
        .then(function (response) {
          console.log(response);
      
          let nextTodos = todos.map(todo => {
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

            if(show == 1) {
              nextTodos = nextTodos.filter(todo => !todo.completed);
            } else if(show == 2) {
              nextTodos = nextTodos.filter(todo => todo.completed);
            }

            // Re-render with the new array
            setTodos(nextTodos);
            enqueueSnackbar("Todo updated", {variant: "success"})
        })
        .catch(async function (error) {
          if(error.response.status === 401){
            const token = await dataStoreContext.refresh();
            await markAsComplete(id, completed, token);
          } else {
            console.log(error);
            enqueueSnackbar("Error updating todo", {variant: "error"})
          }

        });

        dataStoreContext.setIsLoading(false);
    }

    const deleteTodo = async (id, token) => {
      dataStoreContext.setIsLoading(true);

      await axios.delete(process.env.REACT_APP_BACKEND_URL + '/todos/' + id, { headers: { 'Authorization': 'Bearer ' + token}, withCredentials: true })
        .then(function (response) {
          console.log(response);
    
            // Re-render with the new array
            setTodos(todos.filter(todo => todo.id !== id));
            enqueueSnackbar("Todo deleted", {variant: "success"})
        })
        .catch(async function (error) {
          if(error.response.status === 401){
            const token = await dataStoreContext.refresh();
            await deleteTodo(id, token);
          } else {
            console.log(error);
            enqueueSnackbar("Error deleting todo", {variant: "error"});
          }

        })

        dataStoreContext.setIsLoading(false);
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
            deleteTodo(removeItem.id, dataStoreContext.token);
          }} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>


        <Typography variant="h3" fontWeight={"bold"} sx={{ mb: 1}}>My Todos</Typography>
        {/* <IconButton aria-label="home" onClick={ () => navigate("/")} sx={{ mb: 3}}>
          <HomeIcon sx={{ fontSize: 40 }} />
        </IconButton> */}

        <Stack direction={"row"} spacing={3} marginBottom={4}>
          <IconButton aria-label="add goal" onClick={ () => navigate("/my-todos/add")} sx={{ mb: 3}}>
            <AddCircleRoundedIcon sx={{ fontSize: 40 }} />
          </IconButton>

          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="show-todos-select-label">Show</InputLabel>
              <Select
                labelId="show-todos-select-label"
                id="show-todos-select"
                value={show}
                label="Show"
                onChange={handleShowChange}
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={2}>Finished</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>

        {todos != null && todos.length > 0 &&
              todos.map((row) => (
                <Box key={row.id}>
                  <Stack   direction={matches ? "row" : "column"} spacing={matches ? 4 : 0} justifyContent="space-between"
                  alignItems="center" sx={{ pb: 1}}>
                    <Typography variant="h5"  component="div" spacing={matches ? 1.5 : 0}>
                    {row.item}
                    </Typography>
                    
                      <Stack direction={"row"} spacing={1}>
                        {row.completed ?  <IconButton variant="contained"  color="success" onClick={ () => markAsComplete(row.id, false, dataStoreContext.token)}><CheckBoxIcon sx={{ fontSize: 40 }} /></IconButton> : <IconButton color="warning" variant="contained"  onClick={ () => markAsComplete(row.id, true, dataStoreContext.token)}><CheckBoxOutlineBlankIcon sx={{ fontSize: 40 }} /></IconButton>}
      
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