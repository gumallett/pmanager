import {Fragment} from "react";
import { Grid, TextField, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import ToggleButton from '@mui/material/ToggleButton';
import EditIcon from '@mui/icons-material/Edit';
import {useState} from "react";

const useStyles = makeStyles(theme => ({
    attributes: {
        padding: theme.spacing(0.25)
    },
    text: {
        width: "100%"
    }
}));

function VideoTextAttribute({ stringValue = "", label = "", span = 12, editable = true, onChange }) {
    const classes = useStyles();
    const [editing, setEditing] = useState(editable);
    return (
        <Fragment>
            <Grid item xs={span}>
                <form noValidate autoComplete="off">
                    {editing ? <TextField
                            className={classes.text}
                            label={label}
                            color="secondary"
                            onChange={onChange}
                            multiline maxRows={2} variant="outlined" value={stringValue} /> :
                        <Typography className={classes.text} component="div">{stringValue}</Typography>}
                </form>
            </Grid>
        </Fragment>
    )
}

export default VideoTextAttribute;

