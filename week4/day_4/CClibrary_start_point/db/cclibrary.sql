DROP TABLE rentals;
DROP TABLE books;
DROP TABLE members;


CREATE TABLE books(
  id serial4 PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255)
);

CREATE TABLE members (
  id serial4 PRIMARY KEY,
  name VARCHAR(255),
  address VARCHAR(255)
);

CREATE TABLE rentals (
  id serial4 PRIMARY KEY,
  book_id int4 references books(id),
  member_id int4 references members(id)
);