create table video_metadata_tags (
    video_metadata_entity_id int8 references video_metadata (id),
    tags_id int8 references tags (id)
);
