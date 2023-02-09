import {
    combineReducers,
    createAction,
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    createSlice
} from "@reduxjs/toolkit";
import VideoApi from "../../api/api";


const videosAdapter = createEntityAdapter({
    selectId: (video) => video.id,
    sortComparer: false
});


export const fetchVideos = createAsyncThunk("videos/fetchVideos", (args = [], api) => {
    const [q, page, size, sort, tags, excludeTags, categories] = args;
    return VideoApi
        .loadVideos(q, page, size, sort, tags, excludeTags, categories, api);
});

export const fetchCategories = createAsyncThunk("videos/fetchCategories", (q, api) => {
    return VideoApi.fetchCategories(q, api);
});

export const fetchTags = createAsyncThunk("videos/fetchTags", (q, api) => {
    return VideoApi.fetchTags(q, api);
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
})

export const selectVideo = (id) => {
    return (state) => videosAdapter.getSelectors((state) => state.videos.records).selectById(state, id);
}

export const selectVideos = (state) => videosAdapter.getSelectors((state) => state.videos.records).selectAll(state);
export const selectTags = (state) => state.videos.tags;
export const selectCategories = (state) => state.videos.categories;

export const selectTotalPages = (state) => state.videos.meta.totalPages;
