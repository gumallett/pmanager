import {combineReducers, createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import VideoApi from "../../api/api";


const videosAdapter = createEntityAdapter({
    selectId: (video) => video.id,
    sortComparer: false
});


export const fetchVideos = createAsyncThunk("videos/fetchVideos", (args = [], api) => {
    const [q, page, size, sort, tags, excludeTags, categories, sources, lengthFrom, lengthTo] = args;
    return VideoApi
        .loadVideos(q, page, size, sort, tags, excludeTags, categories, sources, lengthFrom, lengthTo, api);
});

export const fetchCategories = createAsyncThunk("videos/fetchCategories", (q, api) => {
    return VideoApi.fetchCategories(q, api);
});

export const fetchTags = createAsyncThunk("videos/fetchTags", (q, api) => {
    return VideoApi.fetchTags(q, api);
});

export const fetchSources = createAsyncThunk("videos/fetchSources", (q, api) => {
    return VideoApi.fetchSources(q, api);
});

export const indexDirectory = createAsyncThunk("videos/indexDirectory", (dir, api) => {
    return VideoApi.indexDirectory(dir, api);
});

export const reindex = createAsyncThunk("videos/reindex", (q, api) => {
    return VideoApi.reindex(api);
});

export const deleteVideo = createAsyncThunk("videos/reindex", (args = [], api) => {
    const [id, permanent] = args;
    return VideoApi.deleteVideo(id, permanent, api);
});

export const videosAdminSlice = createSlice({
    name: 'videosAdmin',
    initialState: {},
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(indexDirectory.fulfilled, (state, action) => ({index: "", error: ""}))
            .addCase(indexDirectory.rejected, (state, action) => ({index: "", error: "General failure"}))
    }
});

export const videosSlice = createSlice({
    name: 'videos',
    initialState: videosAdapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVideos.fulfilled, (state, action) =>
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

export const videosMeta = createSlice({
    name: 'videosMeta',
    initialState: {
        status: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVideos.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchVideos.rejected, (state, action) => {
                state.status = 'error'
            })
            .addCase(fetchVideos.fulfilled, (state, action) => {
                state.status = 'loaded'
                state.totalPages = action.payload.totalPages;
                state.totalRecords = action.payload.totalRecords;
            })
    }
});

export const videosReducer = combineReducers({
    records: videosSlice.reducer,
    meta: videosMeta.reducer,
    categories: catsSlice.reducer,
    tags: tagsSlice.reducer,
    sources: sourcesSlice.reducer,
})

export const selectVideo = (id) => {
    return (state) => videosAdapter.getSelectors((state) => state.videos.records).selectById(state, id);
}

export const selectVideos = (state) => videosAdapter.getSelectors((state) => state.videos.records).selectAll(state);
export const selectTags = (state) => state.videos.tags;
export const selectCategories = (state) => state.videos.categories;
export const selectSources = (state) => state.videos.sources;

export const selectTotalPages = (state) => state.videos.meta.totalPages;
export const selectTotalRecords = (state) => state.videos.meta.totalRecords;
