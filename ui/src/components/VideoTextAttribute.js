import {Fragment} from "react";
import {Grid, makeStyles, TextField, Typography} from "@material-ui/core";
import ToggleButton from '@material-ui/lab/ToggleButton';
import EditIcon from '@material-ui/icons/Edit';
import {useState} from "react";

const useStyles = makeStyles(theme => ({
    attributes: {
        padding: theme.spacing(0.25)
    },
    text: {
        width: "100%"
    }
}));

function VideoTextAttribute({ stringValue = "", label = "", span = 12 }) {
    const classes = useStyles();
    const [editing, setEditing] = useState(true);
    return (
        <Fragment>
            <Grid item xs={span}>
                {editing ? <TextField
                        className={classes.text}
                        label={label}
                        color="secondary"
                        multiline maxRows={2} variant="outlined" value={stringValue} /> :
                    <Typography className={classes.text} component="div">{stringValue}</Typography>}
            </Grid>
        </Fragment>
    )
}

export default VideoTextAttribute;

