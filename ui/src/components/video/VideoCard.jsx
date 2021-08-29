import { Card, CardContent, CardMedia, Link, makeStyles } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import VideoApi from "../../api/api";
import routes from "../../routes/routes";

const useStyles = makeStyles((theme) => ({
    card: {
        marginTop: 15,
        marginLeft: 15,
        maxWidth: 320
    }
}));

function VideoCard({ video }) {
    const classes = useStyles();

    return (
        <Card className={classes.card} variant="outlined">
            <CardMedia>
                <Link component={RouterLink} to={`${routes.video}/${video.id}`}>
                    <img
                        src={`${VideoApi.baseUrl}/static?path=${encodeURIComponent(video.thumbUri)}`}
                        alt="Preview img"/>
                </Link>
            </CardMedia>
            <CardContent>
                <Link variant="body2" color="secondary" component={RouterLink}
                      to={`${routes.video}/${video.id}`}>{video.title}</Link>
            </CardContent>
        </Card>
    );
}

export default VideoCard;
