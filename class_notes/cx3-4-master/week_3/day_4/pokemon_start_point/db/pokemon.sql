DROP TABLE Pokemons;
DROP TABLE Trainers;

CREATE TABLE Trainers (
  id serial4 primary key,
  name VARCHAR(255)
);

CREATE TABLE Pokemons (
  id serial4 primary key,
  name VARCHAR(255)
);