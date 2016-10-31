CREATE TABLE pet_store (
id serial4 primary key,
name VARCHAR(255),
address VARCHAR(255),
stock_type VARCHAR(255)
);

CREATE TABLE pets (
id serial4 primary key,
name VARCHAR(255),
pet_type VARCHAR(255)
);