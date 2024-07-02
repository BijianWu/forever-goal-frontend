import axios from "axios";
import { useContext, useEffect, useState } from "react"
import DataStoreContext from "../DataStoreContext";
import { Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export default function MyEverydayGoals(){
    const dataStoreContext = useContext(DataStoreContext);
    const navigate = useNavigate();
    useEffect(() => {
        // https://stackoverflow.com/questions/5968196/how-do-i-check-if-a-cookie-exists
        const matched = document.cookie.match(/^(.*;)?\s*token\s*=\s*[^;]+(.*)?$/)
        console.log(matched)
        if(matched === null){
          navigate("/login");
        }
      }, []);

    const [everydayGoals, setEverydayGoals] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL + '/everyday-goals', { withCredentials: true })
        .then(function (response) {
          // handle success
          console.log(response);
          setEverydayGoals(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
    }, []);

    const markAsComplete = (id, completed) => {
        axios.patch(process.env.REACT_APP_BACKEND_URL + '/everyday-goals/' + id, { completed: completed}, { withCredentials: true})
          .then(function (response) {
            console.log(response);
        
            const updatedEverydayGoals = everydayGoals.map(todo => {
                if (todo.id === id) {
                  return {
                    ...todo,
                    dateUpdated: response.data[0].dateUpdated,
                    days: response.data[0].days
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
          });
    }

    return <>
        <h1>My everyday goal page</h1>

        {everydayGoals != null && everydayGoals.length > 0 &&
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell align="right">Item</TableCell>
                        <TableCell align="right">Date updated</TableCell>
                        <TableCell align="right">Days</TableCell>
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
                                {row.id}
                            </TableCell>
                            <TableCell align="right">{row.item}</TableCell>
                            <TableCell align="right">{row.dateUpdated}</TableCell>
                            <TableCell align="right">{row.days}</TableCell>
                            <TableCell align="right">
                              <Button variant="contained" color="warning"  onClick={ () => markAsComplete(row.id, false)}>Mark as todo</Button>
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        }
    </>
}