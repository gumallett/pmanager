import { Grid } from "@mui/material";
import VideoCard from "./VideoCard";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    noResults: {
        textAlign: "left"
    }
}));


export function VideosListGrid({videos = []}) {
    const classes = useStyles();

    return (
        <Grid container spacing={0} direction="row" alignItems="flex-start">
            {videos.length > 0 ? videos.map(video => (
                <Grid item xs={3} key={video.id}>
                    <VideoCard key={video.id} video={video} />
                </Grid>
            )) : <Grid item xs={12}><p className={classes.noResults}>No results found.</p></Grid> }
        </Grid>
    );
}
