import { useEffect, useRef } from "react";
import VideoApi from "../../api/api";
import videojs from "video.js";
import { thumbnailUri } from "../../utils";

import './videoPlayer.css';

function VideoPlayer({ videoDetail = {} }) {
    let videoRef = useRef(null);
    let playerRef = useRef(null);

    useEffect(() => {
        if (!playerRef.current) {
            if (!videoRef.current) {
                return;
            }

            if (videoDetail.id) {
                const apiStaticPath = `${VideoApi.baseUrl}/static?path=${encodeURIComponent(videoDetail.uri)}&videoId=${encodeURIComponent(videoDetail.id)}`;
                let player = playerRef.current = videojs(videoRef.current, {
                    sources: [{ src: apiStaticPath, type: videoDetail.videoFileInfo.contentType }],
                    controls: true,
                    preload: 'auto',
                    inactivityTimeout: 5000
                });
            }
        }
    }, [videoDetail]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, []);


    return (
        <video id="player" controls width="750" preload="auto" className="video-js" poster={thumbnailUri(videoDetail.thumbUri)} ref={videoRef}>
            Sorry, your browser doesn't support embedded videos.
        </video>
    );
}

export default VideoPlayer;
