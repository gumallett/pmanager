import { Fragment, useState } from "react";
import {Autocomplete, Grid, TextField, Typography} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
    attributes: {
        padding: theme.spacing(0.25)
    },
    text: {
        width: "100%"
    }
}));

function VideoTextAttribute({ stringValue = "", label = "", span = 12,
                                editable = true, useAutoComplete = false,
                                autoCompleteValues = [], maxRows = 2, onChange }) {
    const classes = useStyles();
    const [editing] = useState(editable);
    const [value, setValue] = useState(stringValue);

    function autoCompleteChanged(event, value) {
        onChange(value);
        setValue(value);
    }

    function textChanged(event) {
        onChange(event.target.value);
        setValue(event.target.value);
    }

    return (
        <Fragment>
            <Grid item xs={span}>
                <form noValidate autoComplete="off">
                    {editing ?
                        useAutoComplete ? <Autocomplete sx={{ width: '100%' }}
                                                        disablePortal
                                                        selectOnFocus
                                                        clearOnBlur
                                                        freeSolo
                                                        value={value || ""}
                                                        onInputChange={autoCompleteChanged}
                                                        renderInput={(params) => <TextField {...params}
                                                                                            label={label}
                                                                                            color="secondary"
                                                                                            autoFocus
                                                                                            variant={"outlined"} />}
                                                        options={autoCompleteValues ? autoCompleteValues : []} />
                                        : <TextField
                                            className={classes.text}
                                            label={label}
                                            color="secondary"
                                            onChange={textChanged}
                                            multiline maxRows={maxRows} variant="outlined" value={stringValue} />
                            : <Typography className={classes.text} component="div">{stringValue}</Typography>}
                </form>
            </Grid>
        </Fragment>
    )
}

export default VideoTextAttribute;

