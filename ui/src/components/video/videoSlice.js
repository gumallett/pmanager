import {combineReducers, createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import VideoApi from "../../api/api";

const videosAdapter = createEntityAdapter({
    selectId: (video) => video.id,
    sortComparer: false
});

export const fetchVideo = createAsyncThunk("video/fetchVideo", (id, api) => {
    return VideoApi.loadVideo(id, api);
});

export const fetchRelatedVideos = createAsyncThunk("video/fetchRelated", (args = [], api) => {
    const [id] = args;
    return VideoApi
        .loadRelated(id, api);
});

export const fetchCategories = createAsyncThunk("video/fetchCategories", (q, api) => {
    return VideoApi.fetchCategories(q, api);
});

export const fetchTags = createAsyncThunk("video/fetchTags", (q, api) => {
    return VideoApi.fetchTags(q, api);
});

export const fetchSources = createAsyncThunk("video/fetchSources", (q, api) => {
    return VideoApi.fetchSources(q, api);
});

export const updateRating = createAsyncThunk("video/updateRating", ([id, newVal] = [], api) => {
    return VideoApi.updateVideo(id, {rating: newVal}).then(() => ({rating: newVal}));
});

export const updateMetadata = createAsyncThunk("video/updateMetadata", ([id, data], api) => {
    return VideoApi.updateVideo(id, data).then(() => data);
});

export const updateTags = createAsyncThunk("video/updateTags", ([id, newTags], api) => {
    return VideoApi.updateVideo(id, {tags: newTags}).then(() => ({tags: newTags}));
});

export const updateCategories = createAsyncThunk("video/updateCategories", ([id, newCats], api) => {
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

export const relatedVideosSlice = createSlice({
    name: 'relatedVideos',
    initialState: videosAdapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRelatedVideos.fulfilled, (state, action) =>
            {
                videosAdapter.setAll(state, action.payload.records)
            })
    }
});

export const tagsSlice = createSlice({
    name: 'tags',
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTags.fulfilled, (state, action) => action.payload.records)
    }
});

export const catsSlice = createSlice({
    name: 'categories',
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.fulfilled, (state, action) => action.payload.records)
    }
});

export const sourcesSlice = createSlice({
    name: 'sources',
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSources.fulfilled, (state, action) => action.payload.records)
    }
});

export const videoDetailsReducer = combineReducers({
    videoDetails: videoSlice.reducer,
    relatedVideos: relatedVideosSlice.reducer,
    categories: catsSlice.reducer,
    tags: tagsSlice.reducer,
    sources: sourcesSlice.reducer,
});

export const selectVideoDetails = (state) => state.videoDetails.videoDetails;
export const selectRelatedVideos = (state) => videosAdapter.getSelectors((state) => state.videoDetails.relatedVideos).selectAll(state);
export const selectTags = (state) => state.videoDetails.tags;
export const selectCategories = (state) => state.videoDetails.categories;
export const selectSources = (state) => state.videoDetails.sources;
