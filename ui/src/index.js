import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
    BrowserRouter, HashRouter,
} from "react-router-dom";
import { isElectron } from "./utils";
import { createBrowserHistory, createHashHistory } from "history";

export const history = isElectron()
    ? createHashHistory()
    : createBrowserHistory();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {isElectron() ? <HashRouter history={history}>
        <App />
    </HashRouter> : <BrowserRouter history={history}>
        <App />
    </BrowserRouter>}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
