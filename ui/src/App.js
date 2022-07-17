import './App.css';
import VideosList from "./components/directory/VideosList";
import { Route, Routes } from "react-router-dom";
import ShowVideo from "./components/video/ShowVideo";
import { adaptV4Theme, createTheme, StyledEngineProvider, ThemeProvider, } from "@mui/material";
import routes from "./routes/routes";
import PMNavBar from "./components/nav/PMNavBar";

const darkTheme = createTheme(adaptV4Theme({
    palette: {
        mode: 'dark',
    },
}));

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={darkTheme}>
                        <PMNavBar />

                        <Routes>
                            <Route path={routes.video} element={<VideosList />} />
                            <Route path={`${routes.video}/:id`} element={<ShowVideo />} />
                        </Routes>
                    </ThemeProvider>
                </StyledEngineProvider>
            </header>
        </div>
    );
}

export default App;
