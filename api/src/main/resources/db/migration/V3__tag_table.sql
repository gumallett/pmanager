create table tags (
    id int8 primary key,
    name varchar(255) not null,
    video_id int8 references video_metadata (id)
);
