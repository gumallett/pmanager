import {Box, Button, Grid, Paper, TextField, Typography} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import makeStyles from "@mui/styles/makeStyles";
import {useDispatch} from "react-redux";
import {useState} from "react";
import {indexDirectory} from "../video/videosSlice";


const useStyles = makeStyles(theme => ({
    attributes: {
        maxWidth: 750,
        padding: theme.spacing(2),
        margin: "auto",
        marginTop: 20,
        textAlign: "left"
    },
    uri: {
        overflowWrap: "anywhere"
    },
}));

function AdminIndex() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [directory, setDirectory] = useState("");
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState("");

    return (
        <Paper className={classes.attributes}>
            <Box component={"form"} noValidate autoComplete={"off"} onSubmit={onSubmit}>
                <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
                    <Grid item xs={9}>
                        <TextField
                            required
                            label="Index Directory"
                            value={directory}
                            onChange={(event) => setDirectory(event.target.value)}
                            sx={{width: "100%"}}
                        />
                    </Grid>
                    <Grid item xs={3} container justifyContent="center" alignItems="center">
                        <Button onClick={onSubmit} variant={"contained"} size={"large"} endIcon={<SendIcon />}>Go</Button>
                    </Grid>
                    {success ? <Grid item xs={12}><Typography color={"springgreen"} variant={"h6"}>Operation was successful.</Typography></Grid> : ""}
                    {failure ? <Grid item xs={12}><Typography color={"indianred"} variant={"h6"}>Operation failed: {failure}</Typography></Grid> : ""}
                </Grid>
            </Box>
        </Paper>
    );

    function onSubmit(event) {
        let dirToIndex = `file:///${directory.replaceAll("\\", "/")}`;
        console.log(encodeURIComponent(dirToIndex));
        dispatch(indexDirectory(dirToIndex))
            .then((res) => {
                console.log(res);
                if (res.meta.requestStatus === 'fulfilled') {
                    setSuccess(true);
                    setFailure("");
                } else {
                    setSuccess(false);
                    setFailure("General failure.");
                }
                return null;
            })
            .catch(() => setFailure("General failure."))
        return false;
    }
}

export default AdminIndex;
