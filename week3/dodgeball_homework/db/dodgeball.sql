DROP TABLE league;
DROP TABLE matches;
DROP TABLE teams;

CREATE TABLE teams (
id serial4 primary key,
name VARCHAR(255)
);

CREATE TABLE matches (
id serial4 primary key,
home_team_id int4 references teams(id),
away_team_id int4 references teams(id),
home_team_score int4,
away_team_score int4
);



