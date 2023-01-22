import { combineReducers, createAction, createSlice } from "@reduxjs/toolkit";

export const appLoaded = createAction('app/appLoaded');
export const appInit = createAction('app/appInit');
export const locationChanged = createAction('app/locationChanged');

const appLoadedSlice = createSlice({
    name: 'appLoaded',
    initialState: false,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(appLoaded, (state, action) => action.payload)
            .addCase(appInit, () => true)
    }
});

const locationSlice = createSlice({
    name: 'appLoaded',
    initialState: false,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(locationChanged, (state, action) => action.payload.location)
    }
});

export const appReducer = combineReducers({
    appLoaded: appLoadedSlice.reducer,
    location: locationSlice.reducer,
});

export const selectAppLoaded = (state) => state.app.appLoaded;
export const selectLocation = (state) => state.app.location;
