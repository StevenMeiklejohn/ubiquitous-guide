## Restful pizza shop

#### Objectives:

- Extend to an existing codebase to be RESTful
	- Add show route
	- Add edit and delete

### Recap

OK, yesterday before we knew of REST we created one half of it. If we look at our routes, we built them RESTfully. We had:

- GET route for all/'index' the orders
- GET route for the 'new' form
- POST route to 'create' an order

Today, we want to complete our RESTful app:

- A route to show individual pizza orders
- A route to an edit form and a route to update
- A route to delete a pizza order

## Show

So we can view all the orders but RESTfully we want to have a route to show each individual resource item.

What HTTP verb request is this going to be? 'GET'

```
get '/pizzas/:id' do
  @pizza = Pizza.find( params[:id] )
  erb( :show )
end

```

- :id ; this is a dynamic path, remember? So thic could be /pizza/23
- Pizza.find( params[:id] ) - is a class method
- it takes in the id as an integer - we could use this in our SQL statement and return the individual row in our database table
- @pizza allows us to use the object in our erb view

Let's create our .find class method in pizza.rb:

```
  def self.find( id )
    db = PG.connect( { dbname: 'pizza_shop', host: 'localhost' } )
    sql = "SELECT * FROM pizzas WHERE id=#{id}"
    pizza = db.exec( sql )
    result = Pizza.new( pizza.first )
    db.close
    return result
  end

```

Firstly, the setup is the same as .all we make a connection but then our SQL is slightly different as we want to specify an ID.

Finally, we run the SQL, store the result, make it a Pizza object and then return the result.

Cool, if we look at our SQL database we will see we have an id field we don't have in our object - ID. Let's add ID to our Pizza:

```
#in initialize:
@id = nil || options['id']

#in attr_reader:
attr_reader( :first_name, :last_name, :topping, :quantity, :id )

```
OK, let's now binding.pry in our GET '/pizza/:id' under @pizzas = ....
We should see a single pizza object. This is useful and we can use this to render a show page. Let's create a show.erb in views and in file:

```
<b>Name:</b>
<p><%= @pizza.pretty_name() %></p>
<b>Order:</b>
<p><%= @pizza.quantity %> x <%= @pizza.topping %></p>
```

If we go to /pizzas/1, It should work! Wicked! Let's add a link in index.erb to view the individual pizza orders:

```
  <a href="/pizzas/<%= pizza.id %>">View</a>
```

## Edit

OK, we now want to update pur order. Let's say we want to change our name, quantity etc. How can we do this? 

As per REST, we need a couple of routes for this, the first is a GET:

```
get '/pizzas/:id/edit' do
  @pizza = Pizza.find( params[:id] )
  erb( :edit )
end

```

Our GET route takes a dynamic ID and uses the find method before rendering an :edit erb file. This means we can use the data in our form fields to render the values in the inputs. In our edit.erb:

Copy the :new form to :edit and add in the @pizza values. Remember to tweak:

We also have to add a hidden input in our form to tell Sinatra to look for a put method.

```
<input type="hidden" name="_method" value="put">
```

- action
- submit to edit
- and for each option:

	```
	<%= "selected='selected'" if @pizza.topping() == "Margherita" %>
	<%= "selected='selected'" if @pizza.topping() == "Calzone" %>
	
	```

Great, notice now our for method and action is going to be sent to a different route. Let's create that route:

```
put '/pizzas/:id' do
  @pizza = Pizza.update( params )
  redirect to( "/pizzas/#{params[:id]}" )
end

```

Here we have our POST route setup with a dynamic ID value. We have defined another class method to update our Pizza and passed the entire params to the model.

Finally we have used a sinatra method to redirect to() the GET, what will this do? Go to the GET and render the show page.

Let's create our class method to update:

```
  def self.update( options )
    db = PG.connect( { dbname: 'pizza_shop', host: 'localhost' } )
    sql = "UPDATE pizzas SET 
          first_name='#{options[:first_name]}', 
          last_name='#{options[:last_name]}', 
          topping='#{options[:topping]}',
          quantity='#{options[:quantity]}'
          WHERE id=#{options[:id]}"
    db.exec( sql )
    db.close
  end

```

We setup our db connection and run our SQL. If we restart our server and run we should be able to edit and update. Woohoo!

Let's add a link to edit in show.erb:

```
<a href="/pizzas/<%= @pizza.id %>/edit">Edit</a>

```

## Refactor

Let's look at our pizza.rb file. Especially, let's look at our methods which interact with the database. What's wrong with these? It's not that DRY. 

[TASK:] Spend 20 minutes looking and refactoring this code to make it DRY:

- Ensure you understand why we need to use the class methods
- Ensure you understand what each method is doing
- Refactor the code to make this neater
- Look into begin, ensure end construct, this may help!

All sql methods that interact with database and a new run_sql method could be changed to:

```

  def save()
    Pizza.run_sql(
    "INSERT INTO pizzas ( 
        first_name, 
        last_name, 
        topping, 
        quantity ) VALUES (
        '#{ @first_name }',
        '#{ @last_name }',
        '#{ @topping }',
        #{ @quantity }
        )"
    )
  end

  def self.find( id )
    pizza = Pizza.run_sql( "SELECT * FROM pizzas WHERE id=#{id}" ) 
    result = Pizza.new( pizza.first )
    return result
  end

  def self.update( options )
    Pizza.run_sql(  
      "UPDATE pizzas SET 
        first_name='#{options['first_name']}', 
        last_name='#{options['last_name']}', 
        topping='#{options['topping']}',
        quantity='#{options['quantity']}'
        WHERE id='#{options['id']}'"
    ) 
  end

  def self.all()
    pizzas = Pizza.run_sql( "SELECT * FROM pizzas" )
    result = pizzas.map { |pizza| Pizza.new( pizza ) }
    return result
  end

  private

  def self.run_sql( sql )
    begin
      db = PG.connect( { dbname: 'pizza_shop', host: 'localhost' } )
      result = db.exec( sql )
      return result
    ensure
      db.close
    end
  end

``` 	

## Delete pizza

The final thing we need to do is delete from our database. We know from REST we use the delete http verb. However, because of a lack of browser support we can use POST. Firstly, because it's a post, we need to setup a from in our show:

```
<form action="/pizzas/<%= @pizza.id %>" method="post">
  <input type="hidden" name="_method" name="delete">
  <input type="submit" value="Delete">
</form>

```

Now we have this form, let's setup our controller action:

```
delete '/pizzas/:id' do
  Pizza.destroy( params[:id] )
  redirect to('/pizzas')
end

```

and our destroy method:

```
  def self.destroy( id )
    Pizza.run_sql( "DELETE FROM pizzas WHERE id=#{id}" )
  end

```

## Conclusion:

- Practically used REST
- Used HTTP verbs and routes
- Created and refactored database methods from the model
- Linked to a user interface view using erb


	

