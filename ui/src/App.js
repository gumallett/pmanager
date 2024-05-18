import './App.css';
import VideosHome from "./components/directory/VideosHome";
import {BrowserRouter, HashRouter, Route, Routes, useLocation, useSearchParams} from "react-router-dom";
import ShowVideo from "./components/video/ShowVideo";
import {adaptV4Theme, createTheme, StyledEngineProvider, ThemeProvider,} from "@mui/material";
import routes from "./routes/routes";
import PMNavBar from "./components/nav/PMNavBar";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {deserializeQueryString, isProd} from "./utils";
import {createBrowserHistory, createHashHistory} from "history";
import {locationChanged, selectAppLoaded, selectLocation} from "./appSlice";
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
    const dispatch = useDispatch();
    const [search, setSearch] = useSearchParams();
    const location = useLocation();

    useEffect(() => {
        dispatch(locationChanged({
            location: location,
            search: deserializeQueryString(search)
        }));
    }, [location]);

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
