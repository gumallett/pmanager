const baseUrl = "http://localhost:8080/gum/videos/1.0.0/videos";

const loadVideos = (query, page = 0, size = 10, sort = '_score', tags = '', excludeTags = '', categories = '', sources = '', lengthFrom = '', lengthTo = '', api) => {
    return fetch(`${baseUrl}?q=${query}&page=${page}&size=${size}&sort=${sort}&tags=${tags}&exclude_tags=${excludeTags}&categories=${categories}&sources=${sources}&lengthFrom=${lengthFrom}&lengthTo=${lengthTo}`, {signal: api.signal})
        .then(res => res.json())
        .then(json => json.data);
};

const loadVideo = (id, api) => {
    return fetch(`${baseUrl}/${id}/view`, {signal: api.signal}).then(res => res.json()).then(json => json.data)
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

const deleteVideo = (id, perma = false, api) => {
    return fetch(`${baseUrl}/${id}?permanent=${perma ? 'true' : 'false'}`, {
        method: 'DELETE',
        signal: api.signal
    }).then(res => {
        if (res.ok) {
            return {
                success: res.ok
            };
        }
        throw new Error("General failure.");
    });
}

const fetchTags = (query, api) => {
    return fetch(`${baseUrl}/tags?q=${query}`, {signal: api.signal})
        .then(res => res.json())
        .then(json => json.data);
}

const fetchCategories = (query, api) => {
    return fetch(`${baseUrl}/categories?q=${query}`, {signal: api.signal})
        .then(res => res.json())
        .then(json => json.data);
}

const fetchSources = (query, api) => {
    return fetch(`${baseUrl}/sources?q=${query}`, {signal: api.signal})
        .then(res => res.json())
        .then(json => json.data);
}

const indexDirectory = (directory, api) => {
    return fetch(`${baseUrl}/index?directory=${directory}`, {signal: api.signal})
        .then(res => {
            if (res.ok) {
                return {
                    success: res.ok
                };
            }
            throw new Error("General failure.");
        });
}

const reindex = (api) => {
    return fetch(`${baseUrl}/reindex`, {signal: api.signal});
}

const VideoApi = {
    baseUrl,
    loadVideos,
    loadVideo,
    updateVideo,
    deleteVideo,
    fetchTags,
    fetchCategories,
    fetchSources,
    indexDirectory,
    reindex,
}

export default VideoApi
