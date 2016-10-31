DROP TABLE OwnedPokemons;
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

CREATE TABLE OwnedPokemons (
  id serial4 primary key,
  trainer_id int4 references trainers(id),
  pokemon_id int4 references pokemons(id)
);