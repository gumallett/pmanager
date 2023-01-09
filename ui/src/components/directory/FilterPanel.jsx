import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Autocomplete, Card, CardActionArea, CardContent, CardHeader, TextField, Typography } from "@mui/material";

function PanelHeader({title = ""}) {
    return (
        <Typography component={"span"} variant={"h5"}>{title}</Typography>
    )
}

function FilterPanel({tags, categories}) {
    const [search, setSearch] = useSearchParams();
    const [showTags, setShowTags] = useState(true);

    return (
        <Card sx={{mt: 2, ml: 2, textAlign: "left", height: "870px", overflow: "auto"}}>
            <CardContent>
                <CardActionArea onClick={toggleTags}><CardHeader sx={{mb: 1, p: 0}} title={<PanelHeader title={"Filters"} />} /></CardActionArea>
                <Typography sx={{mb: 1, p: 0}} variant={"h6"}>Tags</Typography>
                <Autocomplete multiple filterSelectedOptions renderInput={(params) => <TextField {...params} label="Select a tag for filtering" />}
                              value={search.get('tags') ? search.get('tags').split(',').map(it => ({name: it})) : []}
                              options={tags} getOptionLabel={opt => opt.name} isOptionEqualToValue={(opt, val) => opt.name === val.name} sx={{ width: "100%" }} onChange={autoCompleteTagSelected} />
                <Typography sx={{mb: 1, p: 0}} variant={"h6"}>Exclude Tags</Typography>
                <Autocomplete multiple filterSelectedOptions renderInput={(params) => <TextField {...params} label="Select a tag to exclude" />}
                              value={search.get('excludeTags') ? search.get('excludeTags').split(',').map(it => ({name: it})) : []}
                              options={tags} getOptionLabel={opt => opt.name} isOptionEqualToValue={(opt, val) => opt.name === val.name} sx={{ width: "100%" }} onChange={autoCompleteExcTagSelected} />
                <Typography sx={{mb: 1, p: 0}} variant={"h6"}>Categories</Typography>
                <Autocomplete multiple filterSelectedOptions renderInput={(params) => <TextField {...params} label="Select a category to filter" />}
                              value={search.get('categories') ? search.get('categories').split(',').map(it => ({name: it})) : []}
                              options={categories} getOptionLabel={opt => opt.name} isOptionEqualToValue={(opt, val) => opt.name === val.name} sx={{ width: "100%" }} onChange={autoCompleteCatSelected} />
            </CardContent>
        </Card>
    )

    function autoCompleteTagSelected(event, value) {
        if (value && value.length) {
            search.set('tags', value.map(it => it.name).join(","));
            search.set('page', 1);
            setSearch(search);
        } else {
            search.set('tags', "");
            search.set('page', 1);
            setSearch(search);
        }
    }

    function autoCompleteExcTagSelected(event, value) {
        if (value && value.length) {
            search.set('excludeTags', value.map(it => it.name).join(","));
            search.set('page', 1);
            setSearch(search);
        } else {
            search.set('excludeTags', "");
            search.set('page', 1);
            setSearch(search);
        }
    }

    function autoCompleteCatSelected(event, value) {
        if (value && value.length) {
            search.set('categories', value.map(it => it.name).join(","));
            search.set('page', 1);
            setSearch(search);
        } else {
            search.set('categories', "");
            search.set('page', 1);
            setSearch(search);
        }
    }

    function toggleTags() {
        setShowTags(!showTags);
    }
}

export default FilterPanel;
