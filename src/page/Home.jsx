import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const navigate = useNavigate();

    return <>
        <h1>Home page</h1>

        {/* <Grid container spacing={2}>
            <Grid item xs={8}>
                <Item>xs=8</Item>
            </Grid>
            <Grid item xs={4}>
                <Item>xs=4</Item>
            </Grid>
            <Grid item xs={4}>
                <Item>xs=4</Item>
            </Grid>
            <Grid item xs={8}>
                <Item>xs=8</Item>
            </Grid>
        </Grid> */}

        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea onClick={ () => navigate("/my-todos")}>
                <CardMedia
                component="img"
                height="200"
                image={require("../assets/images/todo-lists.jpg")}
                alt="green iguana"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    My Todos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    click here to view all your todos
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>

        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea onClick={ () => navigate("/my-todos")}>
                <CardMedia
                component="img"
                height="200"
                image={require("../assets/images/heaven.jpg")}
                alt="green iguana"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    My Todos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    click here to view all your todos
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    </>
}