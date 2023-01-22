import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { videosReducer } from "./components/video/videosSlice";
import { searchReducer } from "./components/nav/searchSlice";
import { appReducer } from "./appSlice";

const rootReducer = {
    videos: videosReducer,
    search: searchReducer,
    app: appReducer,
}

export const store = configureStore({
    reducer: combineReducers(rootReducer),
    devTools: process.env.NODE_ENV !== 'production',
});
