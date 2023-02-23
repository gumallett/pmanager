import { combineReducers, createAction, createSlice } from "@reduxjs/toolkit";
import { appInit, locationChanged } from "../../appSlice";
import { deserializeQueryString } from "../../utils";

export const searchTextChanged = createAction('search/searchChanged');
export const pageChanged = createAction('search/pageChanged');
export const sortChanged = createAction('search/sortChanged');
export const tagsChanged = createAction('search/tagsChanged');
export const excludeTagsChanged = createAction('search/excludeTagsChanged');
export const categoriesChanged = createAction('search/categoriesChanged');
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
            .addCase(locationChanged, (state, action) => action.payload.search.searchText)
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
            .addCase(locationChanged, (state, action) => action.payload.search.page)
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
            .addCase(locationChanged, (state, action) => action.payload.search.tags)
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
            .addCase(locationChanged, (state, action) => action.payload.search.tagsAsString)
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
            .addCase(locationChanged, (state, action) => action.payload.search.sort)
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
            .addCase(locationChanged, (state, action) => action.payload.search.excludeTags)
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
            .addCase(locationChanged, (state, action) => action.payload.search.excludeTagsAsString)
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
            .addCase(locationChanged, (state, action) => action.payload.search.categories)
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
            .addCase(locationChanged, (state, action) => action.payload.search.categoriesAsString)
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
            .addCase(locationChanged, (state, action) => [action.payload.search.lengthFrom, action.payload.search.lengthTo])
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
    selectedLength: lengthSlice.reducer,
});

export const selectSearch = (state) => state.search.searchText;
export const selectPage = (state) => state.search.page;
export const selectSort = (state) => state.search.sort;
export const selectTags = (state) => state.search.selectedTags;
export const selectCategories = (state) => state.search.selectedCategories;
export const selectExcludeTags = (state) => state.search.selectedExcludeTags;
export const selectTagsStr = (state) => state.search.selectedTagsStr;
export const selectCategoriesStr = (state) => state.search.selectedCategoriesStr;
export const selectExcludeTagsStr = (state) => state.search.selectedExcludeTagsStr;
