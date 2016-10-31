DROP TABLE ownedpokemons;
DROP TABLE pokemons;
DROP TABLE trainers;

CREATE TABLE trainers (
  id serial4 primary key,
  name VARCHAR(255)
);

CREATE TABLE pokemons (
  id serial4 primary key,
  name VARCHAR(255)
);

CREATE TABLE ownedpokemons (
id serial4 primary key,
pokemon_id int4 references pokemons(id),
trainer_id int4 references trainers(id)
);