import { combineReducers, createAction, createSlice } from "@reduxjs/toolkit";
import { appInit } from "../../appSlice";
import { deserializeQueryString } from "../../utils";

export const searchTextChanged = createAction('search/searchChanged');
export const pageChanged = createAction('search/pageChanged');
export const sortChanged = createAction('search/sortChanged');
export const tagsChanged = createAction('search/tagsChanged');
export const excludeTagsChanged = createAction('search/excludeTagsChanged');
export const categoriesChanged = createAction('search/categoriesChanged');
export const sourcesChanged = createAction('search/sourcesChanged');
export const lengthChanged = createAction('search/lengthChanged');

const initialState = deserializeQueryString(new URLSearchParams(window.location.search));

const searchTextSlice = createSlice({
    name: 'search',
    initialState: initialState.searchText,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(searchTextChanged, (state, action) => action.payload)
            .addCase(appInit, (state, action) => action.payload.searchText)
    }
});

const pagesSlice = createSlice({
    name: 'pages',
    initialState: initialState.page,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(pageChanged, (state, action) => action.payload)
            .addCase(appInit, (state, action) => action.payload.page)
            .addCase(tagsChanged, (state, action) => 1)
            .addCase(excludeTagsChanged, (state, action) => 1)
            .addCase(categoriesChanged, (state, action) => 1)
    }
});

const tagsSlice = createSlice({
    name: 'selectedTags',
    initialState: initialState.tags,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(tagsChanged, (state, action) => action.payload)
            .addCase(appInit, (state, action) => action.payload.tags)
    }
});

const tagsStrSlice = createSlice({
    name: 'selectedTagsStr',
    initialState: initialState.tagsAsString,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(tagsChanged, (state, action) => action.payload.map(it => it.name).join(','))
            .addCase(appInit, (state, action) => action.payload.tags.map(it => it.name).join(','))
    }
});

const sortSlice = createSlice({
    name: 'sort',
    initialState: initialState.sort,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sortChanged, (state, action) => action.payload)
            .addCase(appInit, (state, action) => action.payload.sort)
    }
});

const excludeTagsSlice = createSlice({
    name: 'selectedExcludeTags',
    initialState: initialState.excludeTags,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(excludeTagsChanged, (state, action) => action.payload)
            .addCase(appInit, (state, action) => action.payload.excludeTags)
    }
});

const exclTagsStrSlice = createSlice({
    name: 'selectedExcludeTagsStr',
    initialState: initialState.excludeTagsAsString,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(tagsChanged, (state, action) => action.payload.map(it => it.name).join(','))
            .addCase(appInit, (state, action) => action.payload.excludeTags.map(it => it.name).join(','))
    }
});

const categoriesSlice = createSlice({
    name: 'selectedCategories',
    initialState: initialState.categories,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(categoriesChanged, (state, action) => action.payload)
            .addCase(appInit, (state, action) => action.payload.categories)
    }
});

const categoriesStrSlice = createSlice({
    name: 'selectedCategoriesStr',
    initialState: initialState.categoriesAsString,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(tagsChanged, (state, action) => action.payload.map(it => it.name).join(','))
            .addCase(appInit, (state, action) => action.payload.categories.map(it => it.name).join(','))
    }
});

const sourcesSlice = createSlice({
    name: 'selectedSources',
    initialState: initialState.categories,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sourcesChanged, (state, action) => action.payload)
            .addCase(appInit, (state, action) => action.payload.sources)
    }
});

const sourcesStrSlice = createSlice({
    name: 'selectedSourcesStr',
    initialState: initialState.categoriesAsString,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sourcesChanged, (state, action) => action.payload.map(it => it.name).join(','))
            .addCase(appInit, (state, action) => action.payload.sources.map(it => it.name).join(','))
    }
});

const lengthSlice = createSlice({
    name: 'selectedLength',
    initialState: [initialState.lengthFrom, initialState.lengthTo],
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(lengthChanged, (state, action) => action.payload)
            .addCase(appInit, (state, action) => [])
    }
});

export const searchReducer = combineReducers({
    searchText: searchTextSlice.reducer,
    page: pagesSlice.reducer,
    sort: sortSlice.reducer,
    selectedCategories: categoriesSlice.reducer,
    selectedCategoriesStr: categoriesStrSlice.reducer,
    selectedTags: tagsSlice.reducer,
    selectedTagsStr: tagsStrSlice.reducer,
    selectedExcludeTags: excludeTagsSlice.reducer,
    selectedExcludeTagsStr: exclTagsStrSlice.reducer,
    selectedSources: sourcesSlice.reducer,
    selectedSourcesStr: sourcesStrSlice.reducer,
    selectedLength: lengthSlice.reducer,
});
