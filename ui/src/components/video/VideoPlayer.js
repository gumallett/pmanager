import { useCallback, useEffect, useRef } from "react";
import VideoApi from "../../api/api";
import videojs from "video.js";
import { thumbnailUri } from "../../utils";

import './videoPlayer.css';
import { Box } from "@mui/material";


function VideoPlayer({ videoDetail = {}, preview = false, play = false }) {
    const playerRef = useRef(null);
    const videoBoxRef = useRef(null);

    const keybinds = useCallback(() => {
        let ctrl = false;
        let shift = false;
        let dot = false;
        return (e) => {
            const player = playerRef.current;
            if (!player || preview) {
                return;
            }
            const curTime = player.currentTime();
            if (e.which === 16) {
                shift = true;
                ctrl = false;
                dot = false;
            }
            if (e.which === 17) {
                ctrl = true;
                shift = false;
                dot = false;
            }
            if (e.which === 190) {
                ctrl = false;
                shift = false;
                dot = true;
            }

            if (e.which === 37 && dot) {
                player.currentTime(curTime - 10);
            } else if (e.which === 39 && dot) {
                player.currentTime(curTime + 10);
            } else if (e.which === 37 && shift) {
                player.currentTime(curTime - 5);
            } else if (e.which === 39 && shift) {
                player.currentTime(curTime + 5);
            } else if (e.which === 37 && ctrl) {
                player.currentTime(curTime - 1);
            } else if (e.which === 39 && ctrl) {
                player.currentTime(curTime + 1);
            } else if (e.which !== 16 && e.which !== 17 && e.which !== 190) {
                shift = false;
                ctrl = false;
                dot = false;
            }
        }
    }, [playerRef, preview])

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

    const focusHandler = useCallback((e) => {
        if (!playerRef.current) {
            return;
        }

        if (e.which === 119) {
            playerRef.current.focus();
        }
    }, [playerRef]);

    useEffect(() => {
        const handler = keybinds();
        if (!preview) {
            document.addEventListener("keydown", handler, false);
            document.addEventListener("keydown", focusHandler, false);
        }

        return () => {
            if (!preview) {
                document.removeEventListener("keydown", handler);
                document.removeEventListener("keydown", focusHandler);
            }
        }
    }, [playerRef, preview]);

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
