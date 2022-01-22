import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    sortDropdown: {
        marginTop: 15
    },
}));

function SortDropdown({ sortValue = '', defaultSort = '_score', onSortChange = () => '' }) {
    const handleChange = (event) => {
        onSortChange(event.target.value);
    };

    return (
        <FormControl variant={'standard'} sx={{ m: 1, minWidth: 130 }}>
            <InputLabel id="sort-label">Sort</InputLabel>
            <Select
                labelId="sort-label"
                id="sort-select"
                value={sortValue ? sortValue : defaultSort}
                label="Sort"
                onChange={handleChange}
            >
                <MenuItem value={'_score'}>Relevance</MenuItem>
                <MenuItem value={'videoFileInfo.createDate'} >Create Date</MenuItem>
                <MenuItem value={'lastAccessed'}>Access Date</MenuItem>
                <MenuItem value={'rating'}>Rating</MenuItem>
                <MenuItem value={'views'}>Views</MenuItem>
            </Select>
        </FormControl>
    );
}

export default SortDropdown;
