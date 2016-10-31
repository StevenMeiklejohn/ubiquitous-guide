DROP TABLE albums;
DROP TABLE artists;

CREATE TABLE artists (
  id serial4 primary key,
  artist_name VARCHAR(255)
);

CREATE TABLE albums (
  id serial4 primary key,
  album_name VARCHAR(255),
  artist_id int4 references artists(id)
);