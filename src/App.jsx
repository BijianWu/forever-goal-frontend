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
                        </Route>
                    </Routes>
                </DataStoreProvider>
            </ThemeProvider>
        </SnackbarProvider>
    </>
}