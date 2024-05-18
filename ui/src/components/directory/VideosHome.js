import {memo, useCallback, useEffect, useMemo} from "react";
import {Box, Container, Grid, Pagination, Typography} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import SortDropdown from "./SortDropdown";
import { VideosListGrid } from "./VideosListGrid";
import FilterPanel from "./FilterPanel";
import {
    fetchCategories, fetchSources,
    fetchTags,
    fetchVideos,
    selectCategories, selectSources,
    selectTags,
    selectTotalPages, selectTotalRecords,
    selectVideos
} from "../video/videosSlice";
import { useDispatch, useSelector } from "react-redux";
import { pageChanged, sortChanged } from "../nav/searchSlice";
import { deserializeQueryString } from "../../utils";

function PaginationAndSort({showSort = false, totalPages, currentPage, mt, pb}) {
    const [search, setSearch] = useSearchParams();
    const dispatch = useDispatch();
    const deserializedParams = useMemo(() => deserializeQueryString(search), [search]);

    return (
        <Grid container spacing={0} direction="row" alignItems="flex-start">
            <Grid item xs={5}>
                <Pagination sx={{mt: mt, pb: pb}} page={currentPage} count={totalPages} shape="rounded" onChange={changePage}/>
            </Grid>
            {showSort ? <Grid item xs={2}>
                <SortDropdown sortValue={deserializedParams.sort} onSortChange={changeSort}/>
            </Grid> : ""}
        </Grid>
    )

    function changeSort(value) {
        search.set('sort', value);
        setSearch(search);
        dispatch(sortChanged(value));
    }

    function changePage(e, val) {
        search.set('page', val);
        setSearch(search);
        dispatch(pageChanged(val));
    }
}

function VideosListComp({videos = [], totalPages, totalRecords, currentPage}) {
    return (
        <Box>
            <Typography sx={{textAlign: 'left', p: 0, mt: 1, mb: 0}} variant={"h6"}>{totalRecords} results</Typography>
            <PaginationAndSort showSort={true} mt={"15px"} currentPage={currentPage} totalPages={totalPages} />
            <VideosListGrid videos={videos} />
            <PaginationAndSort mt={"15px"} pb={"20px"} currentPage={currentPage} totalPages={totalPages} />
        </Box>
    );
}

const VideosList = memo(VideosListComp);

function VideosHome() {
    const dispatch = useDispatch();
    const totalPages = useSelector(selectTotalPages);
    const totalRecords = useSelector(selectTotalRecords);
    const videos = useSelector(selectVideos);
    const cats = useSelector(selectCategories);
    const tags = useSelector(selectTags);
    const sources = useSelector(selectSources);
    const [searchParams,] = useSearchParams();

    const deserializedParams = useMemo(() => deserializeQueryString(searchParams), [searchParams]);

    const loadVideos = useCallback((q, page, sort, tags, excludeTags, categories, sources, lengthFrom, lengthTo) => {
        if (q.length !== 1 && q.length !== 2) {
            return [
                dispatch(fetchVideos([q, page ? page - 1 : 0, 12, sort ? sort : undefined, tags, excludeTags, categories, sources, lengthFrom, lengthTo])),
                dispatch(fetchTags(q)),
                dispatch(fetchCategories(q)),
                dispatch(fetchSources(q)),
            ];
        }

        return [];
    }, [dispatch]);

    useEffect(() => {
        document.title = `Videos List - ${searchParams.get("search") || ''}`;
    }, [searchParams]);

    useEffect(() => {
        const params = deserializedParams;
        const promises = loadVideos(params.searchText,
            params.page,
            params.sort,
            params.tagsAsString,
            params.excludeTagsAsString,
            params.categoriesAsString,
            params.sourcesAsString,
            params.lengthFrom,
            params.lengthTo
        );
        return () => promises.forEach(it => it.abort())
    }, [deserializedParams, loadVideos]);

    return (
        <Container maxWidth="xl">
            <div className="App">
                <Grid container spacing={2} direction="row" alignItems="flex-start">
                    <Grid item xs={9}>
                        <VideosList videos={videos} currentPage={deserializedParams.page} totalPages={totalPages} totalRecords={totalRecords} />
                    </Grid>
                    <Grid item xs={3}>
                        <FilterPanel tags={tags} categories={cats} sources={sources} />
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
}

export default VideosHome;
