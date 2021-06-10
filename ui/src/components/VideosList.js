import {useEffect, useState} from "react";
import VideoApi from "../api/api";
import {Link as RouterLink} from "react-router-dom";
import {Link} from "@material-ui/core";


function VideosList(props = { searchQuery: "" }) {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        VideoApi.loadVideos(props.searchQuery).then(videos => setVideos(videos))
    }, [props.searchQuery]);

    return (
        <div className="App">
            {videos.map(video =>
                (
                    <div key={video.id}>
                        <Link variant="body2" color="secondary" component={RouterLink} to={`/videos/${video.id}`}>{video.title}</Link>
                    </div>
                )
            )}
        </div>
    );
}

export default VideosList;
