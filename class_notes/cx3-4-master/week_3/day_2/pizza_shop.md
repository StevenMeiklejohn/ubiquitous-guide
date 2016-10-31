## Single models with databases

##### Objectives

- Create a single SQL table
- Create a single Ruby Model
- Hook up a single model to a database and persist data
- Map a row in our SQL table to an instance of an object

### Introduction

For the last few weeks we have setup programs that have been amazing and powerful but limited to the fact that when you run them and the script stops executing all the data you have created disappeared into thin air.

This week we are going to increase the power of our apps by learning and using persistence and talking to a database.

This way we can:

- gather large amounts of data over time
- we can perform processing on existing data
- add and create new data as well as updating our old i.e CRUD!

### Pizza Ordering software

Today we are going to introduce this idea of persistence by creating software that tracks pizza orders for Tony's Pizzas!

We want to be able to:

- Create new orders
- Read/Find existing orders
- Update existing orders 
- Delete existing orders

Up until now most of this functionality would have been pretty hard to accomplish as we only had the computer's memory to use.

First of all though, we will setup our model and object - just like we have done many times in Week 2.

## Pizza/DB model

We are going to setup a model and it's role will be to speak to the database. We have created many models which are tested and each small method did something which we knew would work.

We could do the same for this Pizza DB model but it's more hassle than it's worth to test database models. It can be done but we aren't going to. 

What we want to do:

1. Setup a Pizza model
2. Create readers for our instances:
	- first_name
	- last_name
	- topping
	- qunatity

In terminal:

```
mkdir models
touch models/pizza.rb

```

pizza.rb:

```
require( 'pry-byebug' )

class Pizza

  attr_reader( :first_name, :last_name, :topping, :quantity )

  def initialize( options )
    @first_name = options['first_name']
    @last_name = options['last_name']
    @topping = options['topping']
    @quantity = options['quantity'].to_i
  end

end

binding.pry
nil
```

In terminal:

```
ruby models/pizza.rb
```

Instantiate pizzas and ctrl + c to quit - our pizzas are gone!

## Adding a database

Great, now we can create instances of Pizzas and we can create as many as we want but this is manual and time consuming. It would be nice to start talking to a database to handle all of our records.

#### Mapping an instance to a table row

[DRAW:]

- an instance of a pizza e.g. <# Pizza @first_name="Rick" @last_name="Henry" @topping="Margherita" @qunatity=4>
- a SQL table called Pizza:

-------------------------------------------------
id	| first_name | last_name | topping | qunatity
_________________________________________________

We have a Pizza instance here with all the information we need about that pizza order. If we wanted to save a record of our pizza, it would make sense to take those instance variable values and create a new row in our database table.

We will:

- Require a gem, 'pg', which allows us to:
	- Make a connection to a database
	- Execute SQL on that database
- Create an instance method, let's call it 'save', but it could be called anything e.g. persist_pizza etc.
- Write our sql in our method and execute it
- New up a new instance and invoke the save instance method

We can then check our table and see if it is has persisted.

### The PG gem

We first of all need to require a gem called PG. This gem handles our connection to a database and executes SQL for us.

```
<!-- in terminal -->
gem install pg

<!-- in pizza.rb -->
require( 'pg' )
```

### Creating a Database and table

In Terminal:

```
createdb pizza_shop
mkdir db
touch db/pizza_shop.sql

```

in .sql we want to create our table to stor our pizza orders. What do we want to save?

- first_name
- last_name
- topping
- quantity

Basically all columns that we created in our form. We want to take these seperate inputs and save them as a new row in our database.

Let's chuck in an ID as well so we can differentiate between the orders.

```
CREATE TABLE pizzas (
  id serial4 primary key,
  first_name varchar(255),
  last_name varchar(255),
  topping varchar(255),
  quantity int2
);

```

In terminal: ```psql -d pizza_shop -f db/pizza_shop.sql```

- -d; database select
- -f; file to run in context of selected database

### Creating our first database method

In pizza.rb:

```
  def save()
    db = PG.connect( { dbname: 'pizza_shop', host: 'localhost' } )
    sql = "INSERT INTO pizzas ( 
      first_name, 
      last_name, 
      topping, 
      quantity ) VALUES (
      '#{ @first_name }',
      '#{ @last_name }',
      '#{ @topping }',
      '#{ @quantity }'
      )"
    db.exec(sql)
    db.close
  end

```

#### What's happening here?

1. In our method we create a connection to our DB and save it in a variable.
2. We save to a variable a sql command in a string.
3. We execute that using the db method .exec buefore finally closing the connection. 
4. We close the connection - we don't want to leave it open.

Our .save method is an instance method. Meaning we can use it on any object Pizza we new up. Let's new up a couple of pizzas below our model:

```
pizza1 = Pizza.new( { "first_name" => "Val", "last_name" => "Gibson", "topping" => "Calzone", "quantity" => 4 } )
pizza2 = Pizza.new( { "first_name" => "Jay", "last_name" => "Chetty", "topping" => "Calzone", "quantity" => 2 } )

```

If we run ``` ruby models/pizza.rb ``` we can inspect the pizzas we have newed up and we also have an instance method save() we can use on them.

exit from pry and let's access our database.

In terminal:

```
psql -d pizza_shop
select * from pizzas;

```
Brilliant, we have mapped a Ruby instance to a SQL table row.

## Reading from the database

Now, we want to go the other way. We want to:

- Read/take from our db table
- map them to ruby objects

Class discussion: Let's say I wanted to get all the table rows from the database. Using the existing Pizza model, how could I do this. Specifically:

- We created a save method for an instance; one individual object
- Is it right to create an instance method to get all the records?
- Is it wrong that one individual should be able to get all the others?

Ideally, it's not an instances control to get all the records from a database. But it could be the class. We could ask Pizza to go and grab all the records. We can create a class method.

### Pizza.all()

We can create a class method like so:

```
  def self.all()
    db = PG.connect( { dbname: 'pizza_shop', host: 'localhost' } )
    sql = "SELECT * FROM pizzas"
    pizzas = db.exec(sql)
    db.close
    return pizzas
  end
```
Let's run pizza.rb in terminal. Now we can invoke our newly created class method. This gives us an opportunity to see what the PG gem returns from the database.

```
  Pizza.all()
```

It's a PG::Result object. We know what object are. ntuples refers to the number of rows of  data it's taken from the db.

If we run ``` Pizza.all().first() ``` we get a hash of the first row of data. So this PG::Result is an array of hashes. Each individual hash is a row in the table. 

### Mapping all the rows to objects

So we know we have, essentially, an array of hashes. We want to convert this into an array of Pizza objects. How can we do this?

TASK: Take 10 minutes for students to try this.

```
 return pizzas.map { |pizza| Pizza.new( pizza ) }
```
Map returns a new array and we pass in each hash to create a new pizza instance into the new array.

Now if we run this pizza.rb script and type ``` Pizza.all() ``` We get an array with one item in it. Let's take a look at pizza2.

This is just in memory but we have our .save() so let's save pizza2. Now if we run Pizza.all() we have multiple items in our array.

#### Adding the id

In our database return we have the ID in the hash, it would be cool to to have that information in our Pizza instances as well. This is a super easy fix - add this to the initialize on the pizza model:

```
  @id = options['id'].to_i

```
Remember, the ID of an object is extremely useful - it's the only unique identifier we have between the rows. This will be useful later in the lab!

TASK: create 3 more new pizza instances. Save them and look at .all().

## Analysing our data

So far we have really just been interacting with the database. We've basically built a database model.

Now we want to analyse the data we've got. We could write our logic in the Pizza.rb model and test it but that's a bit grubby. Let's create a new model - Sales.

DRAW: Pizza.all() -> Sales

In terminal:

```
touch models/sales.rb
mkdir specs
touch specs/sales_spec.rb

```

Our sales model is going to consume all of our pizzas. So:

```
require_relative( 'pizza' )

class Sales

  def initialize( pizzas )
    @pizzas = pizzas
  end

end
```

and the spec:

```
require( 'minitest/autorun' )
require_relative( '../models/sales' )

class TestSales < Minitest::Test

  def setup
    pizza1 = Pizza.new( { "first_name" => "Val", "last_name" => "Gibson", "topping" => "Calzone", "quantity" => 4 } )
    pizza2 = Pizza.new( { "first_name" => "Jay", "last_name" => "Chetty", "topping" => "Calzone", "quantity" => 2 } )
    @sales = Sales.new( [ pizza1, pizza2 ] )
  end

end 
```

[NOTE:] We will need to remove the pry and pizzas from our pizza.rb file.

First of all, it would be cool to know total cash sales or revenue. Let's setup a test. All pizzas are 10 quid at Tony's

```
  def test_total_revenue
    result = @sales.total_revenue
    assert_equal( 60, result )
  end

```

And the method:

```
  def total_revenue 
    @pizzas.reduce(0) { |sum, pizza| sum + pizza.quantity } * 10
  end
  
```

## Bringing it all together

Now we have created a sales model which performs analysis. We also have a Pizza model which talks to our database. It would be cool to bring these together and see them in action.

in terminal:

```
touch db/console.rb
```

We can setup a 'console' environment where we can test and use all our models. This is how we can manually test our software.

In console.rb:

```
require_relative( '../models/pizza' )
require_relative( '../models/sales' )
require( 'pry-byebug' )

pizzas = Pizza.all()
sales = Sales.new( pizzas )

binding.pry
nil

```






 







