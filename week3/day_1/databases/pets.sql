-- CREATE table pets(
--   id SERIAL8,
--   name VARCHAR(255),
--   owner VARCHAR(225),
--   date_of_birth DATE,
--   expiry_date DATE);

-- INSERT INTO pets (name, owner, date_of_birth) VALUES ('Barnaby', 'Valerie', '12 Jun 2004');
-- INSERT INTO pets (name, owner, date_of_birth) VALUES ('Flynn', 'Valerie', '12 Jun 2015');

-- DROP TABLE pets;

-- CREATE TABLE pets(
-- id SERIAL8 primary key,
-- name VARCHAR(255) not null,
-- owner VARCHAR(255) not null,
-- date_of_birth DATE not null default '1970 01 01',
-- expiry_date DATE check (expiry_date >= date_of_birth)
-- );

-- ALTER TABLE pets
--   ADD CONSTRAINT unique_owner_name2 UNIQUE(name, owner);

-- INSERT INTO pets(name, owner, date_of_birth, expiry_date) VALUES ('Mr Bojangles', 'Roger Melley', '12 Jun 2004', '10 Jun 2005');

-- INSERT INTO pets(name, owner, date_of_birth, expiry_date) VALUES ('SPG', 'Vivien', '12 Jun 2002', '10 Jun 2003');




DROP TABLE pets;
DROP TABLE people;

CREATE TABLE people(
  id SERIAL8 primary key,
  name VARCHAR(255),
  age INT2,
  sex CHAR(1)
  );

CREATE TABLE pets(
id SERIAL8 primary key,
name VARCHAR(255) not null,
owner_id INT8 references people(id),
date_of_birth DATE not null default '1970 01 01',
expiry_date DATE check (expiry_date >= date_of_birth)
);

ALTER TABLE pets
  ADD CONSTRAINT unique_owner_name UNIQUE(name);

  INSERT INTO people (name, age, sex) VALUES ('Rick', 27, 'm');
  INSERT INTO people (name, age, sex) VALUES ('Jay', 32, 'm');
  INSERT INTO people (name, age, sex) VALUES ('Valerie', 30, 'f');


  











