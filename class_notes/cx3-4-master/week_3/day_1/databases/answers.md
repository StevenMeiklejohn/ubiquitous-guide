

## Section 1

  Revision of concepts that we've learnt in SQL today

  1. Select the names of all users.
  SELECT name FROM users;

  2. Select the names of all shows that cost less than £15.
  SELECT name FROM shows WHERE price < 15;

  3. Insert a user with the name "Val Gibson" into the users table.
  INSERT INTO users (name) VALUES ('Val Gibson');

  4. Select the id of the user with your name.
  SELECT id FROM users WHERE name = '<YOUR NAME!>';

  5. Insert a record that Val Gibson wants to attend the show "Two girls, one cup of comedy".
  INSERT INTO shows_users (user_id, show_id) values ((SELECT id FROM users WHERE name = 'Val Gibson'), (SELECT id FROM shows WHERE name = 'Two girls, one cup of comedy'));

  6. Updates the name of the "Val Gibson" user to be "Valerie Gibson".
  UPDATE users SET name = 'Valerie Gibson' WHERE name = 'Val Gibson';

  7. Deletes the user with the name 'Valerie Gibson'.
  DELETE FROM users WHERE name = 'Valerie Gibson';

  8. Deletes the shows for the user you just deleted.
  DELETE FROM shows_users WHERE user_id NOT IN (SELECT id FROM users);


## Section 2

  This section involves more complex queries.  You will need to go and find out about aggregate funcions in SQL to answer some of the next questions.

  9. Select the names and prices of all shows, ordered by price in ascending order.
  SELECT name, price FROM shows ORDER BY price ASC;

  10. Select the average price of all shows.
  SELECT avg(price) FROM shows;

  11. Select the price of the least expensive show.
  SELECT min(price) FROM shows;

  12. Select the sum of the price of all shows.
  SELECT sum(price) FROM shows;

  13. Select the sum of the price of all shows whose prices is less than £20.
  SELECT sum(price) FROM shows WHERE price < 20;

  14. Select the name and price of the most expensive show.
  SELECT name, price FROM shows WHERE price = (SELECT max(price) FROM shows);

  15. Select the name and price of the second from cheapest show.
  SELECT name, price FROM shows ORDER BY price ASC LIMIT 1 OFFSET 1;

  16. Select the names of all users whose names start with the letter "A".
  SELECT name FROM users WHERE name like 'A%';

  17. Select the names of users whose names contain "el".
  SELECT name FROM users WHERE name like '%el%';


## Section 3

  The following questions can be answered by using nested SQL statements but ideally you should learn about JOIN clauses to answer them.

  18. Select the time for the Edinburgh Royal Tattoo.
  SELECT time FROM times t JOIN shows s ON t.show_id = s.id WHERE s.name = 'Edinburgh Royal Tattoo';

  19. Select the number of users who want to see "Shitfaced Shakespeare".
  SELECT count(show_id) FROM shows_users su JOIN shows s ON su.show_id = s.id WHERE s.name = 'Shitfaced Shakespeare';

  20. Select all of the user names and the count of shows they're going to see.

  SELECT u.name, count(su.show_id) FROM users u JOIN shows_users su ON su.user_id = u.id GROUP BY u.id;

  21. SELECT all users who are going to a show at 13:30.

  SELECT show_id FROM times WHERE time = '13:30';
  SELECT DISTINCT user_id FROM shows_users WHERE show_id IN (3, 6);
  SELECT name FROM users WHERE id IN (1, 3, 5, 8, 9, 13, 15, 11, 12, 16, 17);

  or

  SELECT u.name FROM users u JOIN shows_users su ON u.id = su.user_id JOIN times t ON su.show_id = t.show_id WHERE t.time = '13:30';


## Hints

  - As with anything, if you get stuck, move on, then go back if you have time.
  - Don't spend all night on it!
  - Use resources online to solve harder ones - there are solutions to these questions that work with what we've learnt today, but other tools exist in SQL that could make the queries 'better' or 'easier'.

