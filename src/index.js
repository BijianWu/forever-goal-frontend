import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';
import { BrowserRouter, HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter basename="/forever-goal-frontend">
        <App />
    </BrowserRouter>

)