import { Button, Container, ThemeProvider } from "@mui/material";
import React, { useState } from "react";
import { theme } from "./Theme";
import { Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import EmptyLayout from "./layout/EmptyLayout";

export default function App(){

    return <>
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path="/" element={<EmptyLayout/>}>
                    <Route index element={<Home/>} />
                    
                </Route>
            </Routes>

        </ThemeProvider>
    </>
}