import {useSearchParams} from "react-router-dom";
import {useCallback, useEffect, useMemo, useState} from "react";
import {
    Autocomplete,
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    Slider,
    TextField,
    Typography
} from "@mui/material";
import {useDispatch} from "react-redux";
import {categoriesChanged, excludeTagsChanged, lengthChanged, sourcesChanged, tagsChanged} from "../nav/searchSlice";
import {deserializeQueryString} from "../../utils";
import debounce from 'lodash.debounce';

function PanelHeader({title = ""}) {
    return (
        <Typography component={"span"} variant={"h5"}>{title}</Typography>
    )
}

function FilterPanel({tags, categories, sources}) {
    const RANGE_MAX = 60;
    const [search, setSearch] = useSearchParams();
    const [showTags, setShowTags] = useState(true);
    const dispatch = useDispatch();
    const deserializedParams = useMemo(() => deserializeQueryString(search), [search]);
    const [tmpLength, setTmpLength] = useState([
        deserializedParams.lengthFrom / 1000 / 60,
        deserializedParams.lengthTo ? deserializedParams.lengthTo / 60 / 1000 : RANGE_MAX
    ]);

    const handleRangeChange = useCallback((newvalue) => {
        if (newvalue[1] === RANGE_MAX) {
            search.set('lengthFrom', newvalue[0] * 60 * 1000);
            search.set('lengthTo', '');
        } else {
            search.set('lengthFrom', newvalue[0] * 60 * 1000);
            search.set('lengthTo', newvalue[1] * 60 * 1000);
        }

        setSearch(search);
        dispatch(lengthChanged(newvalue));
    }, [search, setSearch, dispatch]);

    const debouncedSearch = useMemo(() => {
        return debounce(handleRangeChange, 300);
    }, [handleRangeChange]);

    const onRangeChange = useCallback((event, newvalue) => {
        setTmpLength(newvalue);
        if (newvalue) {
            debouncedSearch(newvalue);
        }
    }, [debouncedSearch, setTmpLength]);

    return (
        <Card sx={{mt: 2, ml: 2, textAlign: "left", height: "870px", overflow: "auto"}}>
            <CardContent>
                <CardActionArea onClick={toggleTags}><CardHeader sx={{mb: 1, p: 0}} title={<PanelHeader title={"Filters"} />} /></CardActionArea>
                <Typography sx={{mb: 1, p: 0}} variant={"h6"}>Tags</Typography>
                <Autocomplete multiple filterSelectedOptions renderInput={(params) => <TextField {...params} label="Select a tag for filtering" />}
                              value={deserializedParams.tags}
                              options={tags} getOptionLabel={opt => opt.name} isOptionEqualToValue={(opt, val) => opt.name === val.name} sx={{ width: "100%" }} onChange={autoCompleteTagSelected} />
                <Typography sx={{mb: 1, p: 0}} variant={"h6"}>Exclude Tags</Typography>
                <Autocomplete multiple filterSelectedOptions renderInput={(params) => <TextField {...params} label="Select a tag to exclude" />}
                              value={deserializedParams.excludeTags}
                              options={tags} getOptionLabel={opt => opt.name} isOptionEqualToValue={(opt, val) => opt.name === val.name} sx={{ width: "100%" }} onChange={autoCompleteExcTagSelected} />
                <Typography sx={{mb: 1, p: 0}} variant={"h6"}>Categories</Typography>
                <Autocomplete multiple filterSelectedOptions renderInput={(params) => <TextField {...params} label="Select a category to filter" />}
                              value={deserializedParams.categories}
                              options={categories} getOptionLabel={opt => opt.name} isOptionEqualToValue={(opt, val) => opt.name === val.name} sx={{ width: "100%" }} onChange={autoCompleteCatSelected} />
                <Typography sx={{mb: 1, p: 0}} variant={"h6"}>Sources</Typography>
                <Autocomplete multiple filterSelectedOptions renderInput={(params) => <TextField {...params} label="Select a source to filter" />}
                              value={deserializedParams.sources}
                              options={sources} getOptionLabel={opt => opt.name} isOptionEqualToValue={(opt, val) => opt.name === val.name} sx={{ width: "100%" }} onChange={autoCompleteSourceSelected} />
                <Typography sx={{mb: 1, p: 0}} variant={"h6"}>Duration Range (min)</Typography>
                <Box sx={{mt: 4, ml: 1, mr: 1}}>
                    <Slider
                        getAriaLabel={() => "Duration Range"}
                        value={tmpLength}
                        onChange={onRangeChange}
                        min={0}
                        max={60}
                        getAriaValueText={value => value === RANGE_MAX ? `${RANGE_MAX}+` : value}
                        valueLabelFormat={value => value === RANGE_MAX ? `${RANGE_MAX}+` : value}
                        valueLabelDisplay={"on"}
                    />
                </Box>
            </CardContent>
        </Card>
    )

    function autoCompleteTagSelected(event, value) {
        const arr = value || [];
        if (arr.length > 0) {
            search.set('tags', arr.map(it => it.name).join(","));
            search.set('page', 1);
            setSearch(search);
        } else {
            search.set('tags', "");
            search.set('page', 1);
            setSearch(search);
        }

        dispatch(tagsChanged(arr));
    }

    function autoCompleteExcTagSelected(event, value) {
        const arr = value || [];
        if (arr) {
            search.set('excludeTags', arr.map(it => it.name).join(","));
            search.set('page', 1);
            setSearch(search);
        } else {
            search.set('excludeTags', "");
            search.set('page', 1);
            setSearch(search);
        }

        dispatch(excludeTagsChanged(arr));
    }

    function autoCompleteCatSelected(event, value) {
        const arr = value || [];
        if (arr) {
            search.set('categories', arr.map(it => it.name).join(","));
            search.set('page', 1);
            setSearch(search);
        } else {
            search.set('categories', "");
            search.set('page', 1);
            setSearch(search);
        }
        dispatch(categoriesChanged(arr));
    }

    function autoCompleteSourceSelected(event, value) {
        const arr = value || [];
        if (arr) {
            search.set('sources', arr.map(it => it.name).join(","));
            search.set('page', 1);
            setSearch(search);
        } else {
            search.set('sources', "");
            search.set('page', 1);
            setSearch(search);
        }
        dispatch(sourcesChanged(arr));
    }

    function toggleTags() {
        setShowTags(!showTags);
    }
}

export default FilterPanel;
