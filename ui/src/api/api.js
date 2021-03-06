const baseUrl = "http://localhost:8080/gum/videos/1.0.0/videos";

const loadVideos = (query, page = 0, size = 10, sort = '_score') => {
    return fetch(`${baseUrl}?q=${query}&page=${page}&size=${size}&sort=${sort}`)
        .then(res => res.json())
        .then(json => json.data);
};

const loadVideo = (id) => {
    return fetch(`${baseUrl}/${id}/view`).then(res => res.json()).then(json => json.data)
};

const updateVideo = (id, data) => {
    return fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

const VideoApi = {
    baseUrl,
    loadVideos,
    loadVideo,
    updateVideo
}

export default VideoApi
