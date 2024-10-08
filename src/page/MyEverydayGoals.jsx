import axios from "axios";
import { useContext, useEffect, useState } from "react"
import DataStoreContext from "../DataStoreContext";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckIcon from '@mui/icons-material/Check';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { REFRESH_TOKEN_NAME, TOKEN_NAME } from "../constant/constant";

export default function MyEverydayGoals(){
    const dataStoreContext = useContext(DataStoreContext);
    const navigate = useNavigate();
    const matches = useMediaQuery('(min-width:800px)');

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
        getCurrentGoals(dataStoreContext.token);
    }, []);

    const getCurrentGoals = async (token) => {
      dataStoreContext.setIsLoading(true);
      
      await axios.get(process.env.REACT_APP_BACKEND_URL + '/everyday-goals', { headers: { 'Authorization': 'Bearer ' +token}, withCredentials: true })
      .then(function (response) {
        // handle success
        console.log(response);
        setEverydayGoals(response.data);
      })
      .catch(async function (error) {
        console.log(error)
        if(error.response.status === 401){
          console.log("refreshing right now")
          // retry refresh
          const token = await dataStoreContext.refresh();
          await getCurrentGoals(token);
        } else{
        // handle error
          console.log(error);
          localStorage.removeItem(TOKEN_NAME);
          localStorage.removeItem(REFRESH_TOKEN_NAME);
          navigate("/login");
          dataStoreContext.setIsLoading(false);
        }

      })

      dataStoreContext.setIsLoading(false);

    }

    const markAsDoneToday = async (id, completed, token) => {
      dataStoreContext.setIsLoading(true);
        await axios.patch(process.env.REACT_APP_BACKEND_URL + '/everyday-goals/' + id, { completed: completed}, { headers: { 'Authorization': 'Bearer ' + token}, withCredentials: true })
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
          .catch(async function (error) {
            if(error.response.status === 401){
              // retry refresh
              const token = await dataStoreContext.refresh();
              await markAsDoneToday(id, completed, token);
            } else{
              console.log(error);
              enqueueSnackbar("Error updating goal", {variant: "error"})
            }

          });

          dataStoreContext.setIsLoading(false);
    }

    const deleteEverydayGoal = async (id, token) => {
      dataStoreContext.setIsLoading(true);
      await axios.delete(process.env.REACT_APP_BACKEND_URL + '/everyday-goals/' + id, { headers: { 'Authorization': 'Bearer ' + token}, withCredentials: true })
        .then(function (response) {
          console.log(response);
    
            // Re-render with the new array
            setEverydayGoals(everydayGoals.filter(goal => goal.id !== id));
            enqueueSnackbar("Goal deleted", {variant: "success"})
        })
        .catch(async function (error) {
          if(error.response.status === 401){
            // retry refresh
            const token = await dataStoreContext.refresh();
            await deleteEverydayGoal(id, token);
          } else {
            console.log(error);
            enqueueSnackbar("Error deleting goal", {variant: "error"})
          }

        });

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
              deleteEverydayGoal(removeItem.id, dataStoreContext.token);
            }} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Typography variant="h3" fontWeight={"bold"} sx={{ mb: 1}}>My goals</Typography>

        {/* <IconButton aria-label="home" onClick={ () => navigate("/")} sx={{ mb: 3}}>
          <HomeIcon sx={{ fontSize: 40 }} />
        </IconButton> */}

        <IconButton aria-label="add goal" onClick={ () => navigate("/my-everyday-goals/add")} sx={{ mb: 4}}>
          <AddCircleRoundedIcon sx={{ fontSize: 40 }} />
        </IconButton>

        {/* {everydayGoals != null && everydayGoals.length > 0 &&
        
          <Paper>
            <Stack>
              <Box>

              </Box>

              <Box>

              </Box>
            </Stack>
          </Paper>
        } */}

        {everydayGoals.map((row) => (
          <Paper elevation={2} key={row.id} sx={{mb:2, p:1}}>
          <Stack direction={matches ? "row" : "column"} spacing={0} justifyContent="space-between" alignItems={"center"}>
            <Box>
              <Stack direction={matches ? "column" : "row"} spacing={matches ? 1 : 4} alignItems={"center"} justifyContent={"center"}>
                <Typography variant="overline">
                  Name:
                </Typography>
                <Typography variant="h5" >
                  {row.item}
                </Typography>
              </Stack>
            </Box>

            <Box>
            <Stack direction={matches ? "column" : "row"} spacing={matches ? 1 : 4} alignItems={"center"} justifyContent={"center"}>
              <Typography variant="overline">
                Date updated:
              </Typography>
              <Typography variant="h5">
                {row.dateUpdated.startsWith("000") ? "N/A" : new Date(row.dateUpdated).toDateString()}
              </Typography>
            </Stack>
            </Box>

            <Box>
              <Stack direction={matches ? "column" : "row"} spacing={matches ? 1 : 4} alignItems={"center"} justifyContent={"center"}>
                <Typography variant="overline">
                  Days:
                </Typography>
                <Typography variant="h5">
                  {row.days}
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Stack direction={matches ? "column" : "row"} spacing={matches ? 1 : 4} alignItems={"center"} justifyContent={"center"}>


                <Typography variant="overline">
                  Status: 
                </Typography>{row.isDoneToday ? <Chip label="done today" color="success"/> : <Chip label="not done today"/>}

              </Stack>
            </Box>

            <Box>
              <Stack direction={matches ? "column" : "row"} spacing={matches ? 1 : 4} alignItems={"center"} justifyContent={"center"}>
                <Typography variant="overline">
                  Actions:
                </Typography>
                <Box>
                  {row.isDoneToday ? <Button variant="contained" color="info" disabled ><RadioButtonCheckedIcon /></Button> : <Button variant="contained" color="warning"  onClick={ () => markAsDoneToday(row.id, false, dataStoreContext.token)}><RadioButtonUncheckedIcon /></Button>}

                    <IconButton aria-label="delete everyday goal" onClick={ () => {
                      setOpen(true);
                      setRemoveItem({id: row.id, item: row.item});
                    }} >
                      <DeleteForeverIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                </Box>

              </Stack>
            </Box>
          </Stack>
        </Paper>
        ))}

    </>
}