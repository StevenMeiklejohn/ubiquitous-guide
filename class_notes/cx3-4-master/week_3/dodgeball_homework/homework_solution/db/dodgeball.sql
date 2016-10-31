DROP TABLE teams;
DROP TABLE matches;

CREATE TABLE teams (
  id serial4 primary key,
  name VARCHAR(255)
);

CREATE TABLE matches (
  id serial4 primary key,
  home_id int4 references teams(id),
  away_id int4 references teams(id),
  home_score int4,
  away_score int4
);