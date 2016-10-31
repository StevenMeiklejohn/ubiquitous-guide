DROP TABLE shifts;
DROP TABLE employees;
DROP TABLE clients;


CREATE TABLE employees (
  id serial4 primary key,
  name VARCHAR(255),
  bio VARCHAR(255),
  image VARCHAR(255),
  start_date DATE
);

CREATE TABLE clients (
  id serial4 primary key,
  name VARCHAR(255),
  image VARCHAR(255),
  address VARCHAR(255),
  requirements VARCHAR(255)
  -- artist_id int4 references artists(id) on delete cascade
);

CREATE TABLE shifts (
id serial4 primary key,
employee_id int4 references employees(id) on delete cascade,
client_id int4 references clients(id) on delete cascade,
shift_report VARCHAR(255),
shift_date DATE,
shift_time TIME,
shift_status VARCHAR(255)
);