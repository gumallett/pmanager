import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import VideoApi from "../../api/api";

export const fetchVideo = createAsyncThunk("videos/fetchVideo", (id, api) => {
    return VideoApi.loadVideo(id, api);
});

export const updateRating = createAsyncThunk("videos/updateRating", ([id, newVal] = [], api) => {
    return VideoApi.updateVideo(id, {rating: newVal}).then(() => ({rating: newVal}));
});

export const updateMetadata = createAsyncThunk("videos/updateMetadata", ([id, data], api) => {
    return VideoApi.updateVideo(id, data).then(() => data);
});

export const updateTags = createAsyncThunk("videos/updateTags", ([id, newTags], api) => {
    return VideoApi.updateVideo(id, {tags: newTags}).then(() => ({tags: newTags}));
});

export const updateCategories = createAsyncThunk("videos/updateCategories", ([id, newCats], api) => {
    return VideoApi.updateVideo(id, {categories: newCats}).then(() => ({categories: newCats}));
});

export const videoSlice = createSlice({
    name: 'videoDetails',
    initialState: {videoFileInfo: {}},
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVideo.fulfilled, (state, action) => action.payload)
            .addCase(updateRating.fulfilled, (state, action) => ({...state, ...action.payload}))
            .addCase(updateMetadata.fulfilled, (state, action) => ({...state, ...action.payload}))
            .addCase(updateTags.fulfilled, (state, action) => ({...state, ...action.payload}))
            .addCase(updateCategories.fulfilled, (state, action) => ({...state, ...action.payload}))
    }
});

export const videoDetailsReducer = videoSlice.reducer;

export const selectVideoDetails = (state) => state.videoDetails;
