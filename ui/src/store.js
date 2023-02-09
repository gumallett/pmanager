import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { videosReducer } from "./components/video/videosSlice";
import { searchReducer } from "./components/nav/searchSlice";
import { appReducer } from "./appSlice";
import {videoDetailsReducer} from "./components/video/videoSlice";

const rootReducer = {
    videos: videosReducer,
    videoDetails: videoDetailsReducer,
    search: searchReducer,
    app: appReducer,
}

export const store = configureStore({
    reducer: combineReducers(rootReducer),
    devTools: process.env.NODE_ENV !== 'production',
});
