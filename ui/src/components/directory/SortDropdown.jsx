import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { memo } from "react";

function SortDropdownComp({ sortValue = '', defaultSort = '_score', onSortChange = () => '' }) {
    const handleChange = (event) => {
        onSortChange(event.target.value);
    };

    const availableSorts = [
        {label: 'Relevance', value: '_score'},
        {label: 'Create Date', value: 'videoFileInfo.createDate'},
        {label: 'Access Date', value: 'lastAccessed'},
        {label: 'Rating', value: 'rating'},
        {label: 'Views', value: 'views'},
        {label: 'Length', value: 'videoFileInfo.length'},
    ]

    return (
        <FormControl variant={'standard'} sx={{ m: 1, ml: 10, minWidth: 175,textAlign: 'left' }}>
            <InputLabel id="sort-label">Sort</InputLabel>
            <Select
                labelId="sort-label"
                id="sort-select"
                value={sortValue ? sortValue : defaultSort}
                label="Sort"
                onChange={handleChange}
            >
                {availableSorts.map(sort => <MenuItem value={sort.value} key={sort.value}>{sort.label}</MenuItem>)}
            </Select>
        </FormControl>
    );
}

const SortDropdown = memo(SortDropdownComp);

export default SortDropdown;
