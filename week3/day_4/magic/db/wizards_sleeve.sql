DROP TABLE sleeves;
DROP TABLE wizards;
DROP TABLE magical_items;

CREATE TABLE wizards (
id serial4 primary key,
name VARCHAR(255)
);

CREATE TABLE magical_items (
id serial4 primary key,
name VARCHAR(255)
);

CREATE TABLE sleeves (
id serial4 primary key,
wizard_id int4 references wizards(id),
magical_item_id int4 references magical_items(id)
);