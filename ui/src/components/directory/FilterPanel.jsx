import { useSearchParams } from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {
    Autocomplete, Box,
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    Slider,
    TextField,
    Typography
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
    categoriesChanged,
    excludeTagsChanged, lengthChanged,
    tagsChanged
} from "../nav/searchSlice";
import { deserializeQueryString } from "../../utils";
import debounce from 'lodash.debounce';

function PanelHeader({title = ""}) {
    return (
        <Typography component={"span"} variant={"h5"}>{title}</Typography>
    )
}

function FilterPanel({tags, categories}) {
    const RANGE_MAX = 60;
    const [search, setSearch] = useSearchParams();
    const [showTags, setShowTags] = useState(true);
    const dispatch = useDispatch();
    const deserializedParams = useMemo(() => deserializeQueryString(search), [search]);
    const [tmpLength, setTmpLength] = useState([
        deserializedParams.lengthFrom / 1000 / 60,
        deserializedParams.lengthTo ? deserializedParams.lengthTo / 60 / 1000 : RANGE_MAX
    ]);

    const debouncedSearch = useMemo(() => {
        return debounce(handleRangeChange, 250);
    }, [search]);

    useEffect(() => {
        if (tmpLength) {
            debouncedSearch(null, tmpLength);
        }
        return () => debouncedSearch.cancel();
    }, [tmpLength]);

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
                <Typography sx={{mb: 1, p: 0}} variant={"h6"}>Duration Range (min)</Typography>
                <Box sx={{mt: 3, ml: 1, mr: 1}}>
                    <Slider
                        getAriaLabel={() => "Duration Range"}
                        value={tmpLength}
                        onChange={(event, newvalue) => setTmpLength(newvalue)}
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

    function handleRangeChange(event, newvalue) {
        if (newvalue[1] === RANGE_MAX) {
            search.set('lengthFrom', newvalue[0] * 60 * 1000);
            search.set('lengthTo', '');
        } else {
            search.set('lengthFrom', newvalue[0] * 60 * 1000);
            search.set('lengthTo', newvalue[1] * 60 * 1000);
        }

        setSearch(search);
        dispatch(lengthChanged(newvalue));
    }

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

    function toggleTags() {
        setShowTags(!showTags);
    }
}

export default FilterPanel;
