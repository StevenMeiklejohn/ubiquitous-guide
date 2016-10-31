### title

Databases and SQL Introduction

### topic

### learning objectives
 - Understand what a database is 
 - Explain what SQL is
 - Know how to use CRUD
 - Know how to create relationships
 - Undertand INNER JOINS

### standards

### materials

### summary

3.5hours - break in the middle

Frequently the students will have had no prior exposure to SQL, and there's none in the pre-work, so this is really one of the first "never-ever" lessons.

### assessment

### follow-up

====================

# What is a database?

The word "database" is one of those technical terms that *everyone* has heard, but some might struggle to define. Sometimes you'll hear them referred to as "DBMS" (Database Management Systems).

[i]: Ask the class what their definition of a database is
[i]: Ask the class what databases they know and write on the board. Try to group all the SQL ones together, any NoSQL, and any obscure or debateable (like CSV or Excel...)

  - Microsoft SQL Server
  - Oracle
  - MySQL / MariaSQL
  - Microsoft Access
  - PostgreSQL
  - Mongo
  - Redis
  - Cassandra
  - DB2
  - Paradox
  - CSV
  - Excel
  - etc

Looking at the list of databases we've come up with, there's some repetition in the names - we'll look at what "SQL" is in a moment.

There are SQL-type and NoSQL ("Not Only SQL"). Some of these databases are "relational", and some are object stores, some are tree structures, some are flat-files. SQL is fairly ubiquitious so that's what we are going to be learning to use today.

# What do we do with databases

What do we store in databases?
[i:] Get the students to make some suggestions

[i:] Ensure you write the "CRUD" operations on the board under each other as the class suggest them, to read the acronym off vertically. Later, we will align these with the SQL commands written next to them.

 What sorts of manipulations do we make to data in databases?
 
 - Create (we can't do anything unless we can put data in)
 - Read (once it's in there, we need to get it out)
 - Update (if it needs to change, we need to be able to change it)
 - Delete (we'll need to be able to remove data from our database)

We refer to these four operations as "CRUD". This is important since you will come across it later when we begin web programming

[i] As you work through the sql commands, tick these off.

# What is SQL?

"SQL" stands for "Structured Query Language" (pronouced either as "ess-queue-ell" or "sequel"), and is a special purporse programming language developed during the 1970's, and thoughout later decades, with the purpose of managing the structure and data of relational databases.

In the same way that we use Ruby to talk to the computer, we can use SQL to talk to a database.

## PostgreSQL

SQL is just a language - we need an engine to run it on. In the same way that Ruby is just a language, that runs on an "interpreter" - our Ruby robot we spoke about before. 

PostgreSQL is an open source object-relational database system that we will be using on the course. Other SQL engines include MySQL, SQLite, Microsoft SQL Server etc. Although the SQL querying language is the same, the engines will have their own idoms when it comes to creating tables and system admin.

To check that psql is installed, we can type this.

```
  # terminal
  which psql
```

[i:]If there are any issues with running `psql`, ensure that the `postgresapp` is installed and running (it should have been configured in installfest), and that the path is updated to include it - launch `psql` from the system icon, and note the path used.

```
  # terminal
  psql
  \q  -- to quit
```
# Structure

In SQL, a database is a collection of "tables". A table is a collection of "columns" and "rows".

A table describes the type of item that we want to store. A column represents some information we might find interesting about that item. A row is the physical data we want to save.

[i:] Draw this on the board

For example, we might have a Zoo database with a table called Animals. The animals table might have the columns Name, Age and Colour. The animals table might have the row "Leon, 12, Red".

# Creating a database

To work with data in databases we perform the four CRUD operations.
So we'll work through the SQL commands that give us that functionality.

Before we can do anything though, we need to create a table to store our records in. But before we can create a table, we have to create a database to put it in!

```
  # psql
  psql
  create database people; /* REMEMBER COLON **/
  \q
```

## Data Types

So before we run off and create lots of shiny tables, we need to talk about datatypes. You'll be glad to hear they roughly match up to what we have already seen in Ruby. There are many data types we can use in SQL - the most common we will be using are:

* VARCHAR - fixed length text (string)
* CHAR(1) - One charatcer long field
* INT - numerical data (fixnum)
* SERIAL - this is for unique identifiers (more on this later)
* TEXT - variable length text (string)
* BIT - true / false data (trueclass, falseclass, booleans)
* DATE - date... (date)
* DATETIME - date with time (datetime)

We can pass arguments to VARCHAR and INT to say how large we want the data in the field to be as a maximum.

# Creating tables

By convention, we will name our database tables as the plural of the thing we are creating. So rows of animal data would be stored in a table called Animals. Sheep would be stored in a table called... well, sheep.

Let's make a table that's going to store data about people. A person might have the following attributes:

- name
- age
- sex

[i:] Get the students to think about what types these columns will be.

[i]: as you type out the SQL statement, ask the class how big a number could fit into the 'age' field. 32,767 - half a two-byte number. Stave the curiosity by explaining that we'll cover binary later.

[i:] Point out that a char is used when entries in the table are exactly the same size. This offers efficiences.

```
  touch create_people.sql

  #script.sql
  CREATE TABLE people (
    name VARCHAR(255),
    age INT2,
    sex CHAR(1)
    );
    
```
- What is our table called?
- What are the names of our columns?
- What are the size constraints?

There is a special command that we can run from the terminal to execute postgres scripts.

```
  #terminal
  psql -d people -f script.sql
  
  #psql terminal - new tab, keep this open for running selects
  psql
  
  \c people
  \d+ people
  
```

We are going to use two tabs - one for running our script and one for running little queries. We will write all of our statements in the one file and comment them out, so you can keep the story of what we are working through.

[i]: break around here (if you haven't already)


## Creating (-C-rud)

[i:] Remeber to tick off the CRUD items on the board

We're going to start with the C in CRUD but first let's learn the SQL statement that you'll probably use most of all.

```
SELECT * FROM people;
```

This says 'get everything from the people table'. The * means 'all the fields'.

To "create" records in SQL, we use the `INSERT` clause.

We are going to make a lot of use of the Sublime shortcuts cmd + D to copy a line as well as cmd + / to comment a line.

```
  #script.sql
  INSERT INTO people (name,age,sex) VALUES ('rick',12,'M');
  /** SEMI COLONS! **/
  INSERT INTO people (name,age,sex) VALUES ('jay',100,'M');
  
  #terminal
  psql -d people -f script.sql
  
```
Note that the INSERT 1 0 is that 1 row was inserted with an id of 0.

We need to be careful with speechmarks in postgres sql - we should always use single quotes. Single quotes behave in the normal way we'd expect - defining text. Double quotes are reserved for system operations. Try not to worry too much about this, just remember to use single quotes when dealing with data.

If we ever need to use a speechmark in our inserted text, we need to escape it with a backslash or use two of them.

We use the convention uppercase for SQL keywords and lowercase for our own terms. It's not mandatory but it makes it easier to read.

## Inserting nulls

We haven't told the database that every column must be present, so we could do this

```
  #script.sql
  INSERT INTO people (name, age) VALUES ('valerie', 32);
  INSERT INTO people (name, age) VALUES ('valerie', 33);
  
  #terminal
  psql -d people -f script.sql
  
  #psql terminal
  SELECT * FROM people
  
```

## Type Checking

We need to be careful to provide the correct types that we have defined earlier - e.g. sex has to be exactly one character, age has to be  number

[i:] ask the class what they think will happen

```
  INSERT INTO people (age) VALUES ('123'); /** will coerce **/
  
  #terminal
  psql -d people -f script.sql
  
  #script.sql
  INSERT INTO people (age) VALUES ('cats') /** won't coerce **/
  
  #terminal
  psql -d people -f script.sql

```
We also need to be craeful that we keep within the limits of the sizes we specified.

```
  #script.sql
  INSERT INTO people (sex) VALUES ('ff');
  
  #terminal
  psql -d people -f script.sql

```
  
## Selecting (c-R-ud)

This is the R is CRUD.

We "read" records with the `SELECT` clause.

```
#psql terminal
SELECT * FROM people;

```
The star is saying that we want all the fields returned, if we said 

```
#psql terminal
SELECT age FROM people;

```
It would only list the ages.

We can also use SELECT to count how many rows we have

```
#psql terminal
SELECT COUNT(*) FROM people;

```
 
# Updating (cr-U-d)

This is the U in CRUD.

We use the `UPDATE` clause to change the values in existing records.

```
  #script.sql
  UPDATE people SET sex = 'm';
  
  #terminal
  psql -d people -f script.sql
  
```

Note that it says UPDATE 5 - what does this mean?

This has updated all our records (5 of them)...what if we only want certain records to update?

We can use a **where** clause to achieve this.

```
  #script.sql
  UPDATE people SET sex = 'f' WHERE name = 'valerie';
  
  #terminal
  psql -d people -f script.sql
  
```

How would we update only the valere who is 32? We can chain together clauses with the AND keyword.

```
  #script.sql
  UPDATE people SET sex = 'm' WHERE name = 'valerie' AND age = 32;
  
  #psql terminal
  SELECT * FROM people;
  
```

# Deleting (cru-D-)

This is the D in CRUD.

To delete records we use the `DELETE` clause. But **be careful**, there's no undo! When a record is deleted from a DB it's gone for ever. "Undelete" in the database world is "restore from last night's backup" (if there *was* a backup...)

```
  #script.sql
  DELETE FROM people WHERE name = 'rick';
  
  #terminal
  psql -d people -f script.sql
  
  #psql terminal
  SELECT * FROM people;
  
```


# Uniquely identifying rows

Remember that there are two 'valeries' in our database, one is 32 years old, one is 33.

Let's imagine it is 32-year-old Valerie's birthday, and we update the record accordingly.

```
  UPDATE people SET age = 33 WHERE sex = 'f' AND name = 'valerie' AND age = 32;
  
```

That's grand but what happens when the other Valerie's birthday comes along? We have no way of uniquely identifying this row, and any query we try to execute will update both Valerie's.

The answer to this is to add an arbitrary column to every table when we create it. That column will contain a number, which will be unique for each row in the DB, and ideally, is managed by the database itself, so we don't need to worry about adding it when we insert new records.

## Serials

We are going to also need an ID column, to solve our problem of uniquely identifying rows.

The new `id` field is a `SERIAL8` type -- an internal type of PostgreSQL's, which will look after numbering for us in an eight byte integer field. This gives us up to 9 million trillion ids - there are also other sizes of Serial we can use but I'm sure this will do for now ;)

Serials are super special integers, that auto increment themselves. If we had simply used INT, we'd have to manually curate them and make sure we added 1 (which would be horrible). This would also cause issues if we had concurrent users - what if they both made a row at the same time? Serials take care of this nightmare for us.

Let's create a table to store the pets of our people.

Pet's will have

- name
- owner
- date of birth
- date of death (grim!)

[i:] Ask the students to determine what type these columns will be.

We'll create a new file called pets.sql

```
  #pets.sql
  CREATE TABLE pets (
    id SERIAL8,
    name VARCHAR(255),
    owner VARCHAR(255),
    date_of_birth DATE,
    date_of_death DATE
  );

  #terminal
  psql -d people -f pets.sql
  
```
Aside: You will often see 255 used because it's the largest number of characters that can be counted with an 8-bit number. It maximizes the use of the 8-bit count, without frivolously requiring another whole byte to count the characters above 255. We'll come back to binary another time.

Note: Once defined, altering database schemas can be problematic ('involved' would be a good word to use) - beware of managing existing data. For the moment, when we need to, we'll just drop the whole table or DB and start again.

```
  INSERT INTO pets (name, owner, date_of_birth) VALUES ('Flynn', 'michael', '12 Jan 2004');
  
  INSERT INTO pets (name, owner, date_of_birth) VALUES ('Barnaby', 'valerie', '12 Jun 2015');
    
  #terminal
  psql -d people -f pets.sql
```

DO THIS TWICE. See the incrementing index, even though all the other details are identical.

```
	#psql terminal
	SELECT * FROM pets;
```

# Constraints

We can add "constraints" to our table definition, which will validate the data we try to enter against some basic rules.

  - A pet's name must be present
  - A date of birth must be present, but if it's not specified, default to 1st Jan 1970
  - a date of death must not be before date of birth
  - A name must be unique for the owner

```
  #pets.sql
  DROP TABLE pets;

  CREATE TABLE pets (
    id SERIAL8 primary key,
    name VARCHAR(255) not null,
    owner VARCHAR(255) not null,
    date_of_birth DATE not null default '1970-01-01',
    date_of_death DATE check (date_of_death >= date_of_birth)
  );

  ALTER TABLE pets
    ADD CONSTRAINT unique_pets_name_owner UNIQUE(name, owner);

```

A primary key is a column that uniquely defines a record. A primary key column cannot contain a NULL value. A table can have only one primary key. So we are explicitly saying that we want our ID field to be our main identifier for the rows in the table.

```
 #terminal
  psql -d people -f pets.sql

```

Add one row then let them add some valid data.

```
 INSERT INTO pets (name,owner, date_of_birth, date_of_death) VALUES ('kakashi','valerie', '2011-09-01','2012-01-10');
 
  #terminal
  psql -d people -f pets.sql
 
  #psql terminal
  SELECT * FROM pets;

```
Insert some invalid data this time.

```
INSERT INTO pets (name,owner, date_of_birth) VALUES ('kakashi','valerie', '2011-09-01');
-- duplicate pet

 #terminal
  psql -d people -f pets.sql

INSERT INTO pets (owner, date_of_birth) VALUES ('valerie', '12 Jan 2004');
-- no name

 #terminal
  psql -d people -f pets.sql

INSERT INTO pets (name,owner, date_of_death, date_of_birth) VALUES ('pikachu', 'valerie', '1o Jan 2004', '12 Jan 2004');
-- date_of_death is before date_of_birth

 #terminal
  psql -d people -f pets.sql

```

Note the new date format. Most programs will accept this date format and it avoids all conflicts with "cultures" e.g. en-US vs en-UK and which way round months and days should be.

```
#psql terminal
  SELECT * FROM pets;
```

Look at the index... what's noteable?

It should be that there's a gap in the numbering - the records that failed constraints still used up numbers in the sequence.

[i]: Break here before going on to foreign keys


# Foreign Keys

We associated pets with owners by adding the owner's name to the pets table. Can you anticipate anything wrong with this?

  - Duplication - If an ownner changes their name, it needs to be changed everywhere
  - What if two people have the same name?

What other solution could we use? Instead of storing the owner's name, what about storing the ID of their row in the people table?

This field is a 'key' that gives us access to a record in another table -- so we call it a "foreign key". Any column that is referring to a primary key in a foreign table is a foreign key.

[i:] draw this on the board (one to many)

[i:] Gist https://gist.github.com/outragedpinkracoon/5fa582d6b8d13d2e7b18

Let's create a new script called pets-new.sql

```
#pets-new.sql
DROP TABLE pets;
DROP TABLE people;

CREATE TABLE people (
  id SERIAL8 primary key,
  name VARCHAR(255),
  age INT2,
  sex CHAR(1)
  );

CREATE TABLE pets (
  id SERIAL8 primary key,
  name VARCHAR(255) not null,
  owner_id INT8 references people(id),
  date_of_birth DATE not null default '1970-01-01',
  date_of_death DATE check (date_of_death >= date_of_birth)
);

ALTER TABLE pets
  ADD CONSTRAINT unique_pets_name_owner UNIQUE(name, owner_id);

INSERT INTO people (name,age,sex) VALUES ('rick',12,'M');
INSERT INTO people (name,age,sex) VALUES ('jay',100,'M');
INSERT INTO people (name,age,sex) VALUES ('valerie',30,'F');

```

We can see that the people table now has a serial id and the pets table now has a "references people(id)" statement. Our owner_id is a reference to the primary key in the people table.

Foreign keys are generally named according to the convention "table_name_singular_id", unless another name makes more 'sense' (but it would always have `_id` to indicate it's a foreign key).

Now, before we do anything else - what happens if we change the order of the drops and run this again? Because pets now depends on people, if we want to delete the people table we must remove any tables that depend on it's primary keys. Otherwise we'd end up with a whole bunch of zombie references to it.  Let's fix that up and put it back in the correct sequence.

If we inspect our newly created rows, we can see the ids of the owners. Let's use these to create some pets.

```
#pets-new.sql
INSERT INTO pets (name, owner_id, date_of_birth) VALUES ('Turtle', 1, '12 Jan 2004');

INSERT INTO pets (name, owner_id, date_of_birth) VALUES ('Elephant', 2, '12 Jan 2004');

INSERT INTO pets (name, owner_id, date_of_birth) VALUES ('Kitty', 3, '12 Jun 2015');

 #terminal
  psql -d people -f pets-new.sql

```

What happens if we try to add a pet with an id of 4?

```
#pets-new.sql
INSERT INTO pets (name, owner_id, date_of_birth) VALUES ('Doggy', 4, '12 Jan 2004');
```
This is fine, but what if one pet is shared by two owners? How could we structure the data?

- Add an 'owner2_id' field to pets?
- What if there are three owners, or a thousand? Are we going to add a field for each of the possible owners?

[i:] Let them have a break here!!!!!

# Join tables

I think we've had about enough of pets and owners now, so let's do something different.

Let's create a new database to model a zombie apocalypse. We want to keep track of which victims have been bitten by which zombies and whe it happened. Looking at the description of what our DB will do, all the nouns indicate tables we'll need.

Zombies will have
- a name
- a type
- an id

Victims will have
- a name
- infection date

[i:] draw this on the board (many to many)

Now zombie's can bite multiple people, and people can be bitten by multiple zombies (ouch) so we can't simply add a person_id to a zombie or a zombie_id to a person. What are we going to do?

This is where the magic of join tables comes in.

- - 

```
#psql terminal
  CREATE DATABASE zombies;
```

```
  touch zombies.sql
  subl .
```
[i:] Gist https://gist.github.com/outragedpinkracoon/cb331baa6c56a336e2ca
```
  CREATE TABLE zombies
  (
    id SERIAL8 primary key,
    name VARCHAR(255) not null,
    type VARCHAR(255)
  );

  CREATE TABLE victims
  (
    id SERIAL8 primary key,
    name VARCHAR(255) not null,
    run_speed INT2
  );
  DROP TABLE;
  CREATE TABLE bitings
  (
    id SERIAL8 primary key,
    victim_id INT8 references victims(id),
    zombie_id INT8 references zombies(id),
    infected_on DATE not null
  );
```
Let's run this script

```
  psql -d zombies -f zombies.sql

```

Lets insert some victims

```
  #zombies.sql
  INSERT INTO victims (name, run_speed) VALUES ('Keith',100);
  INSERT INTO victims (name, run_speed) VALUES ('Rick',2);
  INSERT INTO victims (name, run_speed) VALUES ('Jay',75);
  INSERT INTO victims (name, run_speed) VALUES ('Michael',75);
  
  #terminal
   psql -d zombies -f zombies.sql
```

Next let's insert some zombies.

```
  INSERT INTO zombies (name, type) VALUES ('Paul', 'Runner');
  INSERT INTO zombies (name, type) VALUES ('Sky', 'Drooler');
  INSERT INTO zombies (name, type) VALUES ('Beth', 'Walker');
  INSERT INTO zombies (name, type) VALUES ('Evelyn', 'Drooler');
 
 ```
 Now let's add some unfortunate incidents to the bitings table.
 ```
INSERT INTO bitings (zombie_id, victim_id, infected_on) VALUES (1, 1, 'Jan 12 2015');
INSERT INTO bitings (zombie_id, victim_id, infected_on) VALUES (2, 2,'Jan 13 2015');
INSERT INTO bitings (zombie_id, victim_id, infected_on) VALUES (3, 3, 'Jan 14 2015');

--zombie 1 went on a killing spree
INSERT INTO bitings (zombie_id, victim_id, infected_on) VALUES (1, 2, 'Jan 12 2015');
```

How do we find out the names of the people who have been bitten by Paul?
```
  #psql terminal
  -- First, find out the ID of paul.
  SELECT * FROM zombies WHERE name = 'Paul';

  -- We just want the victim_id for our purposes.
  SELECT victim_id FROM bitings WHERE zombie_id = 1;

  -- Now we can get the people's names from the person_ids. Note that (2,3) is kind of like an array.
  SELECT name FROM victims WHERE id IN (1,2);
  
  --all in one go
 

We had to execute three queries here to get the data we wanted, which isn't very efficient. But it got us there.

# An intro to the dark art of joins

We can actually join a couple of these statements together...

```
select name from victims where id IN (select victim_id from bitings where zombie_id = 1);
  
```
It's a bit ungainly but it gets the job done.  This is such a common thing to do that SQL has the concept of joins to achieve this.

There are several kinds of joins but we are just going to have a quick look at inner joins for now.

[i:] Draw 2 circles, one for victims and one for bitings. Show the overlap being the inner join - where the id is present in both tables.

If we wanted to list all the victims names and when they were infected we could do this

```
select victims.name, bitings.infected_on from victims inner join bitings on bitings.victim_id = victims.id;

```

We can use this to remove the nested IN statement and replace it with an inner join too:

```
select name from victims inner join bitings on victims.id = bitings.victim_id where bitings.zombie_id = 1;

```

This is fine, but what if we don't know what the zombie id is we only know his name is Paul?

```
select victims.name from victims inner join bitings on victims.id = bitings.victim_id inner join zombies on zombies.id = bitings.zombie_id where zombies.name = 'Paul';

```

We can also do some cool stuff like count how many times Paul has bitten someone

```
select count(bitings.victim_id) from bitings inner join zombies on zombies.id = bitings.zombie_id where zombies.name = 'Paul';

```

## Bonus Points

For your own learning, I recommend you have a look into the other kinds of joins and also aliasing - this saves us typing out the table names every single time.

You might also like to look into how to order and group results.
