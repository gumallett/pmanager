import { Card, CardContent, CardMedia, Grid, Link, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Link as RouterLink } from "react-router-dom";
import routes from "../../routes/routes";
import VisibilityIcon from '@mui/icons-material/Visibility';
import GradeIcon from '@mui/icons-material/Grade';
import { displayRating, thumbnailUri, toDuration } from "../../utils";

const useStyles = makeStyles((theme) => ({
    card: {
        marginTop: 15,
        marginLeft: 15,
        maxWidth: 320,
        textAlign: "left"
    },
    viewsIcon: {
        paddingTop: 2
    },
    cardContent: {
        padding: 7,
        paddingBottom: "0 !important"
    },
    bottomRow: {

    }
}));

function VideoCard({ video }) {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardMedia>
                <Link component={RouterLink} to={`${routes.video}/${video.id}`}>
                    <img
                        src={thumbnailUri(video.thumbUri)}
                        width={320}
                        height={180}
                        alt="Preview img"/>
                </Link>
            </CardMedia>
            <CardContent className={`${classes.cardContent}`}>
                <Link variant="body2" color="secondary" component={RouterLink}
                      to={`${routes.video}/${video.id}`}>{video.title}</Link><br/>
                <Typography variant="caption">{`${video.source}`}</Typography>
                <Grid className={classes.bottomRow} container direction="row" spacing={2} justifyContent="flex-start" alignItems="center">
                    <Grid container direction="row" spacing={1} item xs={3} justifyContent="flex-start" alignItems="stretch">
                        <Grid item xs={6}><VisibilityIcon className={classes.viewsIcon} fontSize="small" /></Grid>
                        <Grid item xs={6}><Typography variant="caption">{`${video.views ? video.views : "0"}`}</Typography></Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1} item xs={3} justifyContent="flex-start" alignItems="stretch">
                        <Grid item xs={6}><GradeIcon className={classes.viewsIcon} fontSize="small" /></Grid>
                        <Grid item xs={6}><Typography variant="caption">{`${displayRating(video.rating)}`}</Typography></Grid>
                    </Grid>
                    <Grid container item xs={6} justifyContent="flex-end" alignItems="stretch"><Typography variant="caption">{toDuration(video.videoFileInfo.length)}</Typography></Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default VideoCard;
