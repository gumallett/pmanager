import { useCallback, useEffect, useRef } from "react";
import VideoApi from "../../api/api";
import videojs from "video.js";
import { thumbnailUri } from "../../utils";

import './videoPlayer.css';
import { Box } from "@mui/material";


function VideoPlayer({ videoDetail = {}, preview = false, play = false }) {
    const playerRef = useRef(null);
    const videoBoxRef = useRef(null);

    const createPlayerOptions = useCallback(() => {
        const videoUri = preview ? videoDetail.previewUri : videoDetail.uri;
        const apiStaticPath = `${VideoApi.baseUrl}/static?path=${encodeURIComponent(videoUri)}&videoId=${encodeURIComponent(videoDetail.id)}`;

        return {
            sources: [{src: process.env.NODE_ENV === 'production' ? videoUri : apiStaticPath, type: videoDetail.videoFileInfo.contentType}],
            controls: !preview,
            preload: preview ? 'auto' : 'auto',
            inactivityTimeout: 5000,
            fluid: true,
            restoreEl: true,
            aspectRatio: preview ? "16:9" : "16:9",
            loop: preview,
            muted: preview,
            autoplay: false,
            poster: thumbnailUri(videoDetail.thumbUri),
        };
    }, [videoDetail.id, preview])

    const setupPlayer = useCallback(() => {
        const elem = videoBoxRef.current.children[0];
        return videojs(elem, createPlayerOptions());
    }, [videoBoxRef, createPlayerOptions]);

    useEffect(() => {
        if (!playerRef.current) {
            if (!videoBoxRef.current) {
                return;
            }

            if (videoDetail.id) {
                playerRef.current = setupPlayer();
            }
        } else {
            const player = playerRef.current;
            const newOpts = player.options(createPlayerOptions());
            player.poster(newOpts.poster);
            player.src(newOpts.sources);
        }
    }, [videoDetail.id, videoBoxRef, playerRef, createPlayerOptions, setupPlayer]);

    useEffect(() => {
        const player = playerRef.current;

        if (videoBoxRef.current && player) {
            if (preview && play) {
                player.play();
            }
        }
    }, [preview, playerRef, videoBoxRef, play]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);


    return (
        <Box ref={videoBoxRef} sx={{ display: "flex", width: "100%", height: preview ? "100%" : "", mt: preview ? 0 : 2 }}>
            {// Warning: will be managed and replaced in the dom by videojs
            }
            <video className="video-js">
                Sorry, your browser doesn't support embedded videos.
            </video>
        </Box>
    );
}

export default VideoPlayer;
