create table video_metadata (
    id int8 primary key,
    title varchar(255) not null,
    description varchar(1000) not null,
    uri varchar(1000) not null,
    filename varchar(255) not null,
    content_type varchar(255) not null,
    source varchar(255) not null,
    rating integer,
    views integer,
    size int8 not null,
    length int8 not null,
    width int8,
    height int8,
    notes varchar(1000) not null,
    file_create_date timestamp not null,
    last_accessed timestamp,
    last_modified timestamp not null
);
