import { Button, Container, ThemeProvider } from "@mui/material";
import React, { useState } from "react";
import { theme } from "./Theme";
import { Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import EmptyLayout from "./layout/EmptyLayout";
import Register from "./page/Register";
import Login from "./page/Login";

export default function App(){

    return <>
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path="/" element={<EmptyLayout/>}>
                    <Route index element={<Home/>} />
                    <Route path="register" element={<Register/>} />
                    <Route path="login" element={<Login/>} />
                </Route>
            </Routes>

        </ThemeProvider>
    </>
}