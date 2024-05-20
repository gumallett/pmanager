import './App.css';
import VideosHome from "./components/directory/VideosHome";
import {BrowserRouter, HashRouter, Route, Routes} from "react-router-dom";
import ShowVideo from "./components/video/ShowVideo";
import {adaptV4Theme, createTheme, StyledEngineProvider, ThemeProvider,} from "@mui/material";
import routes from "./routes/routes";
import PMNavBar from "./components/nav/PMNavBar";
import React from "react";
import {isProd} from "./utils";
import {createBrowserHistory, createHashHistory} from "history";
import AdminIndex from "./components/admin/AdminIndex";

const darkTheme = createTheme(adaptV4Theme({
    palette: {
        mode: 'dark',
    },
}));

export const history = isProd()
    ? createHashHistory()
    : createBrowserHistory();

function RootElement() {
    return (
        <div className="App">
            <header className="App-header">
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={darkTheme}>
                        <PMNavBar />

                        <Routes>
                            <Route path={routes.video} element={<VideosHome />} />
                            <Route path={routes.adminIndex} element={<AdminIndex />} />
                            <Route path={`${routes.video}/:id`} element={<ShowVideo />} />
                        </Routes>
                    </ThemeProvider>
                </StyledEngineProvider>
            </header>
        </div>
    );
}

function App() {
    return (
        isProd() ? <HashRouter history={history}>
            <RootElement />
        </HashRouter> : <BrowserRouter history={history}>
            <RootElement />
        </BrowserRouter>
    );
}

export default App;
