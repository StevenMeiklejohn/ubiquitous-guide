# Associations Intro

#### Objectives

- Explain the following types of associations:
	- One to one
	- One to many
	- Many to many

Up until now we have created single model applications which map to a single SQL table. This is pretty cool but we probably want more data to play with. 

For example, our Pizza shop might want information on their customers.

 Let's have a think - if you owned an online pizza store, what data would you want to have? Think of some of the drawbacks from our app yesterday:

- We couldn't select from a menu
- Our customers could keep 'repeating' in our table
- No customer database

It would be cool to maybe have a table for the customers and a table for the menu.

[:DRAW]

PIZZA
id
name
size

CUSTOMER
id
name
address

In SQL, when we start to have multiple tables, we relate a data ( this is why we call SQL a relational database ) row to one or more data rows in another table. We can do this a few different ways.

- One to one
- One to many
- Many to many

We relate data by individual table row

## One to one

With a one to one relationship in SQL this means a row is directly associated with itself. For example, let's say we have a Person table:

------------------------------
id | name | NI
______________________________

Here each row has a name, id and an NI number. This is a one to one relationship. Each attribute is directly associated with this row.

## One to many

Now we can start working with multiple tables. Let's say we are a bank manager of multiple branches and we want to setup a database to deal with accounts.

We might have a Branches table.

BRANCHES
id
address

We may also have an Accounts table.

ACCOUNTS
id
name
sort

So every new customer gets an account. But what if we wanted to associate the account to the branch? How could we do this? 

We can setup a one to many association. We can say one branch row is associated to many account rows.  With this setup, we use the branch_id as the FOREIGN KEY. We use this foreign key to reference the ID of the associated row in the other table.

So, in account:

branch_id

## Many to Many

OK, let's go back to our Pizza shop. We have a Pizza table and a Customer table. What's the association here?

- A customer row can be associated to many pizzas
- A pizza row can be associated to many customers

In this situation, we can call this many to many relationship. When we have this situation we need a third table - or join table. The purpose of this join table is to track the id of the rows in the other two tables.

For our pizza example, we need a join. We can create a table, Order.

ORDER
id
pizza_id
customer_id

Here the join has two foreign keys. We can now associate customers to many pizzas and pizzas to many customers.

## TASK:

Design the following data:

- USERS & PHOTOS
- QUIDDITCH PLAYERS & BROOMSTICKS
- BASKETBALL TEAMS & PLAYERS
- ARTISTS & VENUES