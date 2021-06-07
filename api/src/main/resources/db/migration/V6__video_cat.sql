create table video_metadata_categories (
     video_metadata_entity_id int8 references video_metadata (id),
     categories_id int8 references categories (id)
);
