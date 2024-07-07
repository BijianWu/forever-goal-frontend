import axios from "axios";
import { useContext, useEffect, useState } from "react"
import DataStoreContext from "../DataStoreContext";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function MyEverydayGoals(){
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

      console.log("MyEverydayGoals initialized");
    }, []);

    const [everydayGoals, setEverydayGoals] = useState([]);
    useEffect(() => {
        dataStoreContext.setIsLoading(true);
        axios.get(process.env.REACT_APP_BACKEND_URL + '/everyday-goals', { headers: { 'Authorization': 'Bearer ' +dataStoreContext.token}, withCredentials: true })
        .then(function (response) {
          // handle success
          console.log(response);
          setEverydayGoals(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          localStorage.removeItem("token");
          navigate("/login");
        })
        .finally(function () {
          // always executed
          dataStoreContext.setIsLoading(false);
        });
    }, []);

    const markAsDoneToday = (id, completed) => {
      dataStoreContext.setIsLoading(true);
        axios.patch(process.env.REACT_APP_BACKEND_URL + '/everyday-goals/' + id, { completed: completed}, { headers: { 'Authorization': 'Bearer ' +dataStoreContext.token}, withCredentials: true })
          .then(function (response) {
            console.log(response);
        
            const updatedEverydayGoals = everydayGoals.map(todo => {
                if (todo.id === id) {
                  return {
                    ...todo,
                    dateUpdated: response.data.dateUpdated,
                    days: response.data.days,
                    isDoneToday: true
                  };
                } else {
                  return todo;
                }
              });
              // Re-render with the new array
              setEverydayGoals(updatedEverydayGoals);
              enqueueSnackbar("Goal updated", {variant: "success"})
          })
          .catch(function (error) {
            console.log(error);
            enqueueSnackbar("Error updating goal", {variant: "error"})
          })
          .finally(function () {
            // always executed
            dataStoreContext.setIsLoading(false);
          });
    }

    const deleteEverydayGoal = (id) => {
      dataStoreContext.setIsLoading(true);
      axios.delete(process.env.REACT_APP_BACKEND_URL + '/everyday-goals/' + id, { headers: { 'Authorization': 'Bearer ' +dataStoreContext.token}, withCredentials: true })
        .then(function (response) {
          console.log(response);
    
            // Re-render with the new array
            setEverydayGoals(everydayGoals.filter(goal => goal.id !== id));
            enqueueSnackbar("Goal deleted", {variant: "success"})
        })
        .catch(function (error) {
          console.log(error);
          enqueueSnackbar("Error deleting goal", {variant: "error"})
        })
        .finally(function () {
          // always executed
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
              deleteEverydayGoal(removeItem.id);
            }} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <h1>My everyday goal page</h1>

        <IconButton aria-label="home" onClick={ () => navigate("/")} sx={{ mb: 3}}>
          <HomeIcon sx={{ fontSize: 40 }} />
        </IconButton>

        <IconButton aria-label="add everyday goal" onClick={ () => navigate("/my-everyday-goals/add")} sx={{ mb: 3}}>
          <AddCircleRoundedIcon sx={{ fontSize: 40 }} />
        </IconButton>


        
        {everydayGoals != null && everydayGoals.length > 0 &&
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        {/* <TableCell>Id</TableCell> */}
                        <TableCell align="left">Item</TableCell>
                        <TableCell align="right">Date updated</TableCell>
                        <TableCell align="right">Days</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {everydayGoals.map((row) => (
                            <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                              <IconButton aria-label="delete everyday goal" onClick={ () => {
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
                            <TableCell align="right">{row.dateUpdated}</TableCell>
                            <TableCell align="right">{row.days}</TableCell>
                            <TableCell align="right">
                            {row.isDoneToday ? <Chip label="done today" color="success"/> : <Chip label="not done today"/>}
                            </TableCell>
                            <TableCell align="right">
                              {row.isDoneToday ? "NONE" : <Button variant="contained" color="warning"  onClick={ () => markAsDoneToday(row.id, false)}>Mark as done</Button>}
                              
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        }
    </>
}