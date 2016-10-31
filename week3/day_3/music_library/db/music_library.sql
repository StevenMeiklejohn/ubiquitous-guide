CREATE TABLE artists (
id serial4 primary key,
name VARCHAR(255)
);

CREATE TABLE albums (
id serial4 primary key,
name VARCHAR(255),
artist_id int4 references artists(id)
);
-- # SQL PostGres keyword 'primary key' will enforce uniqueness.
-- #SQL keyword 'references' allows our albums table to access artist id. I.e. is a 'foreign key'.