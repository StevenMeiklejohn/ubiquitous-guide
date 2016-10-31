# Pizza Shop - Post

##### Objectives

-	Setup a form using a post method and action
-  Submit form to post route
-  Use params to initialize model object
-  Display object to a create post
-  Use TDD on models

Up until now with our new found knowledge of frameworks we have setup a server and have:

- created a 'Hello World' app
- created a calculator serving up different types of content e.g. JSON and HTML
- made 'get' requests to routes to ask for information from a server

## HTTP Post

If we have some software or app, more often than not, we need to take in some information.

We would then use these inputs to do something. Often, this will be creating or updating information stored in a database. Think back to CRUD on database Monday.

Just like when we wanted information and we asked to HTTP 'GET' that resource, we 'POST' when we have users information that we want to manipulate.

## Tony's Pizza

We are going to build:

- Sinatra app
- Display a new HTML form which we will take the input from a form to order a Pizza
- We will display the Pizza order information back to the user

## Setup

Let's setup our sinatra app. Remember, we can use MVC:

```
	mkdir pizza_shop
	cd pizza_shop
	mkdir public specs models views
	touch pizza_controller.rb
```

Let's start with our controller. This listens to the requests and talks to our models and sends stuff to the view. He's the middle man.

In our controller.rb:

```
require( 'sinatra' )
require( 'sinatra/contrib/all' )
require( 'pry-byebug' )
require_relative('./models/pizza')

get '/pizzas/new' do 
  # return 'Hello World'
  erb( :new )
end

```

Cool, we have created a view if you remember erb called new. Let's create that and it's layout.

```
 touch views/layout.erb
 touch views/new.erb
```

In layout html tab and put in ```<%= yield %>```

## Creating a post form


```
#new.erb
<h1>Order a pizza</h1>

<form action="/pizzas" method="post">
  <label for="first_name">First Name:</label>
  <input type="text" name="first_name">
  <label for="last_name">Last Name:</label>
  <input type="text" name="last_name">

  <input type='submit' value="Order Pizza">
</form>

```

Firstly we create a form tag which has two properties:

- action; this is the route we want to direct to
- method; the HTTP verb which we want to send it to (remember the request response cycle)

We don't want to 'GET' in this case we want to send up information to our server. We want to 'POST' this information.

Secondly, we create some inputs for a first and a last name. These inputs have an important property:

- name; our information will be set in the params hash - this 'name' will be the key of the input value

Finally we have a submit input. This will trigger a page refresh and send the form to the server to our specified action route with method.

## Dealing with a POST route

Great, we can now post our name information from our form to our server, but we have an error. But we have no route in our controller to deal with it.

```
post '/pizzas' do 
  # binding.pry
  @pizza = Pizza.new( params[:first_name], params[:last_name] )
  erb( :create )
end

```

1. We use a method sinatra gives us 'post' and we set the path to pizza  
2. If we pry in here and look at params we can see the info sent up
3. We then send back erb template (we have access to the instance variable @pizza - a pizza instance object)

## Pizza model

We have instantiated a pizza. We need to now setup our class and specs. What we want to do:

1. Setup a spec to test we can instantiate a pizza
2. Test that we can access the first name and last name
3. Once passed, use our instance variable in our route to render the first and last name.

pizza_spec.rb:

```
require( 'minitest/autorun' )
require_relative( '../models/pizza' )

class TestPizza < MiniTest::Test

  def setup
    @pizza = Pizza.new( 'Tony', 'Goncalves' )
  end

  def test_first_name()
    assert_equal( 'Tony', @pizza.first_name() )
  end

  def test_second_name()
    assert_equal( 'Goncalves', @pizza.last_name() )
  end

end
```

pizza.rb:

```
class Pizza

  attr_reader( :first_name, :last_name )

  def initialize( input_first_name, input_last_name )
    @first_name = input_first_name
    @last_name = input_last_name
  end

end

```

In create.erb:

```
<%= @pizza.first_name() %><br>
<%= @pizza.last_name() %>

```

If we refresh we should get our first and last name. Wouldn't it be nice to take these two names and concatenate them together? Of course we need a test for that?

[TASK:] Take 5 and get students to implement this.

pizza_spec.rb:

```
  def test_pretty_name()
    assert_equal( 'Tony Goncalves', @pizza.pretty_name() )
  end
```

pizza.rb:

```
  def pretty_name()
    return @first_name.concat(" #{@last_name}")
  end
```

create.erb:

```
<%= @pizza.pretty_name() %>
```

## Other inputs

Ok, we have a name of our customer so Tony knows who is ordering a pizza, but that's not much use. We need to know what they want to order. Let's use some alternative inputs to add to our form.

#### Pizza select

It would be cool to offer some different options for the customer to choose a pizza and select the quantity. new.erb:

```
  <label for="topping">Select a pizza:</label>
  <select name="topping">
    <option value="Margherita">Margherita</option>
    <option value="Calzone">Calzone</option>
  </select>

  <label for="quantity">Quantity:</label>
  <input type="number" name="quantity">
```

If we binding.pry the controller and check params we should see the two new inputs. Think about the quantity in particular!

We want to display this new information to the user. In pizza_spec.rb:

```
  def test_topping()
    assert_equal( 'Calzone', @pizza.topping() )
  end

  def test_quantity()
    assert_equal( Fixnum, @pizza.quantity().class )
    assert_equal( 10, @pizza.quantity() )
  end
``` 

Run to get error. In pizza.rb:

```
    @topping = topping
    @quantity = quantity.to_i
    
    
    ## accessors:
    attr_reader( :first_name, :last_name, :topping, :quantity )

```

Run to get passes. OK, back to our controller an we can add the arguments to our new object. This could get quite lengthy. Think of all the potential params we could end up with??

- Drinks
- Cooking notes
- Desserts
- Multiple pizzas etc

Params is just a hash right? So we could just pass that in? So in our controler; ``` @pizza = Pizza.new( params ) ```

And in our pizza.rb:

```
  def initialize( options )
    @first_name = options['first_name']
    @last_name = options['last_name']
    @topping = options['topping']
    @quantity = options['quantity'].to_i
  end
```

- 'options' here is just a hash so we can access values through the keys

Let's update our spec as well:

```
  def setup
    options = {
      "first_name" => 'Tony', 
      "last_name" => 'Goncalves', 
      "topping" => 'Calzone', 
      "quantity" => '10'
    }
    @pizza = Pizza.new( options )
  end
```

### Total cost

We need to total up the cost of our pizzas! For now, let's say all Tony's pizzas are a reasonanle 10 pounds. In our pizza_spec.rb:

```
  def test_total()
    assert_equal( 100, @pizza.total() )
  end
```

Run the spec and in pizza.rb:

```
  def total() 
    return @quantity * 10
  end
```

Run the spec and in create.erb:

```
<h5>Total:</h5>
<p>£<%= @pizza.total() %></p>
```

## Databases!

Our app is cool but we are getting to a point where persisting data would be a cool thing to do. We could then keep track of pizza orders and see total orders etc. In Terminal:


```
createdb pizza_shop
touch pizza_shop.sql

```

in .sql we want to create our table to store our pizza orders. What do we want to save?

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

In terminal: ```psql -d pizza_shop -f pizza_shop.sql```

- -d; database select
- -f; file to run in context of selected database

## Connecting to the Database

For this, we can use a gem. There is a postgres gem

```
gem install pg

<!-- in pizza.rb -->
require('pg')
```

Let's now use this gem. This gives a class that we can use to connect to and run sql on our db. What we want to do when a user submits the new form for a pizza is:

- Open a connection to the DB
- Run the SQL to save the Pizza record
- Close the DB connection

So in our class/model, we could create a save method. In pizza.rb:

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
      #{ @quantity }
      )"
    db.exec(sql)
    db.close
  end

```

Firstly, in our method we create a connection to our DB and save it in a variable.

Secondly, we save to a variable a sql command in a string and then execute that using the db method .exec buefore finally closing the connection.

If we submit the form we will see it doesn't really let us know if it worked or not. However, let's check our PG database in terminal:

```
psql -d pizza_shop
SELECT * FROM pizzas
```

## Displaying pizza orders

So we've proved we can save data to a databse using a web interface which is awesome but now we want to go the other way. We want to display our orders.

What we really need to do is have a route to handle this request. Now we are wanting to 'GET' information. So, let's say we wanted to get all the pizza orders from the database. We need:

- a 'GET' route to handle this request
- a method on the pizza using sql to get all the pizza entries
- populate the data in erb and send to client

```
get '/pizzas' do
  @pizzas = Pizza.all()
  erb ( :index )
end
```

Here, we have invoked a Pizza.all() method. This is known as a class method. We have created many methods that function on the instance of the object. A class method functions on the class.

You can't use a class method on an instance:

```
  def self.all()

  end
```

#### Retrieving all pizza in index:

```
db = PG.connect( { dbname: 'pizza_shop', host: 'localhost' } )
sql = "SELECT * FROM pizzas"
pizzas = db.exec( sql )
result = pizzas.map { |pizza| Pizza.new( pizza ) }
db.close
return result
```

1. We open connection to database and store to db variable
2. Write sql statement to get all the database entries
3. Create varaiable and store the result of executing db sql
4. The pg gem returns an array of db objects, which are not pizza objects. We re map the array and convert objects to Pizza instances
5. We close the db connection and return result

Cool if we binding.pry:

```
get '/pizzas' do
  @pizzas = Pizza.all()
  binding.pry
  erb ( :index )
end
```

We can see what we get back from our method - an array of pizza instances.

Now we have this collection we can iterate over this into the view to display in our browser. index.erb:

```
<h2>Pizza Orders</h2>

<% @pizzas.each do |pizza| %>
  <b>Name:</b>
  <p><%= pizza.pretty_name() %></p>
  <b>Order:</b>
  <p><%= pizza.quantity %> x <%= pizza.topping %></p>
  <hr>
<% end %>

```

## Conclusion

- A new HTTP verb - POST; we use this in forms to send information to a server.
- Created a POST route and multiple GET routes.
- Serve content in HTML
- Test driven model logic