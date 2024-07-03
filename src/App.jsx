import { Button, Container, ThemeProvider } from "@mui/material";
import React, { useState } from "react";
import { theme } from "./Theme";
import { Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import EmptyLayout from "./layout/EmptyLayout";
import Register from "./page/Register";
import Login from "./page/Login";
import DataStoreProvider from "./DataStoreProvider";
import MyTodos from "./page/MyTodos";
import { SnackbarProvider } from "notistack";
import MyEverydayGoals from "./page/MyEverydayGoals";
import AddEverydayGoal from "./page/AddEverydayGoal";
import AddTodo from "./page/AddTodo";

export default function App(){

    return <>
        <SnackbarProvider maxSnack={3}>
            <ThemeProvider theme={theme}>
                <DataStoreProvider>
                    <Routes>
                        <Route path="/" element={<EmptyLayout/>}>
                            <Route index element={<Home/>} />
                            <Route path="register" element={<Register/>} />
                            <Route path="login" element={<Login/>} />
                            <Route path="my-todos" element={<MyTodos/>} />
                            <Route path="my-everyday-goals" element={<MyEverydayGoals/>} />
                            <Route path="my-everyday-goals/add" element={<AddEverydayGoal/>} />
                            <Route path="my-todos/add" element={<AddTodo/>} />
                        </Route>
                    </Routes>
                </DataStoreProvider>
            </ThemeProvider>
        </SnackbarProvider>
    </>
}