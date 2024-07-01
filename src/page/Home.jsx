import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const navigate = useNavigate();

    return <>
        <h1>Home page</h1>

        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea onClick={ () => navigate("/my-todos")}>
                <CardMedia
                component="img"
                height="140"
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
    </>
}