# Many to many associations

#### Objectives

- Have an awareness of the different types of relationships that exist in a relational database
- Describe and provide an example of a many to many relationship and when we would use one
- Draw and 'model' many to many relationship

## Recap

[:DRAW]:

Until now we have learned 2 associations:

- one to one; for example a Person and NI number
- one to many; Team has many players; Bank has many accounts...

There is one other relationship we need to learn about.

### Many to many

When modelling data there will be occasions when one or more rows in a table are associated with one or more rows in another table.

For example: [:DRAW]

Let's say we are going to build a pokemon collection tracker. Pokemon and Trainers have a name, and a Pokemon can belong to many trainers, and trainers can have many pokemon. Tony might have pikachu, charmander and squirtle, I might have pikachu, charmander and cindaquil.

Trainer:

- name

Pokemon:

- name

Now let's have a think about the relationship between these models. A trainer can have many pokemon and a pokemon can be owned by many users. We can generate a trainers "collection" by finding all of the pokemon which are tied to their trainer id.

When we have a many to many relation like this we require a third table in the mix. We call this a join table. A join table will have two foreign keys; one for each model. It will also usually have it's own ID.

So we need a third model. For our example, OwnedPokemon is probably a good name.

OwnedPokemon:

- id
- trainer_id
- pokemon_id

### Models and our database

Today we are not going to go near Sinatra, but what we do can easily be plugged into it.

```
dropdb pokemon
createdb pokemon
psql -d pokemon -f db/pokemon.sql
```
Let the students have a read through the code for 5 minutes then talk through the structure (mention SqlRunner and MapItems).

### Console

We are also going to make utilising this file our model 'console'. To do this, we will use "Pry" which we have briefly used before. We can do exactly the same thing in Sinatra so it ports over directly.

This will allows us to build our apps from the ground up, testing our relations in the console before we go anywhere near a view page.

```
#console.rb
trainer1 = Trainer.new({ 'name' => 'Tony' })

# CREATE A MODELS CONSOLE
binding.pry
nil
```

Run ``` ruby console.rb ``` and have a look around. ```ls``` to see variables.

Notice that the model currently has no id. This is handled by the database (using the serial4 type) so we don't need to care about it.

If we call Trainer.all, we will notice that there are no trainers. Even though we have made a model, it's just in memory. 

We can call ```trainer1.save()``` to save this model.

Let's add another trainer.

```
trainer1 = Trainer.new({ 'name' => 'Tony' })
trainer2 = Trainer.new({ 'name' => 'Valerie' })

trainer1.save()
trainer2.save()
```

Cool let's now make a pokemon or two.

```
pokemon1 = Pokemon.new({ 'name' => 'Charmander'})
pokemon2 = Pokemon.new({ 'name' => 'Pikachu' })

pokemon1.save()
pokemon2.save()
```
## Deleting Data

What happens if we run our console file multiple times?

You'll notice that when we run our console file that data keeps getting appened - the old data is still there. This is because we never tell the db to delete anything.

Let's add the delete_all method to our console.rb.

```
Trainer.delete_all
Pokemon.delete_all
```

This prevents duplicate data.

[Task:] Create more pokemon and trainers.

### Creating the join model

We now want to make our join model. A join table is often called [Table1Table2] so in our case TrainerPokemon. A more meaningful name is probably OwnedPokemon.

Let's go add the sql. We need a table that does nothing but hold foreign keys to other tables. 

```
CREATE TABLE OwnedPokemons (
  id serial4 primary key,
  trainer_id int4 references trainers(id),
  pokemon_id int4 references pokemons(id)
);
```
We could easily add other data, like the date the pokemon was captured, and it's nickname.

```
touch models/owned_pokemon.rb
```

In owned_pokemon.rb let's stub it out.

```
require( 'pg' )

class OwnedPokemon

  def initialize( options )

  end

  def save()

  end

  def self.all()

  end

  def self.delete_all()

  end
  
end
```
Cool let's add each method, starting with initialize.

```
attr_reader :id, :trainer_id, :pokemon_id

   def initialize( options )
    @id = options['id'].to_i
    @trainer_id = options['trainer_id'].to_i
    @pokemon_id = options['pokemon_id'].to_i
  end
```
We can test this works in the console.

```
#seeds.rb
#ADD REQUIRE RELATIVE 
require_relative( '../models/owned_pokemon.rb' )

entry1 = OwnedPokemon.new({ 'trainer_id' => 1 , 'pokemon_id' => 1})

```
Let's check this runs.

Next let's add save.
```
  def save()
    sql = "INSERT INTO OwnedPokemons (
      trainer_id,
      pokemon_id) 
      VALUES (
        #{ @trainer_id }, 
        #{ @pokemon_id }
      )"
    SqlRunner.run_sql( sql )
  end
```

Let's update our console file...

```
entry1.save()
```

Oh no what has happened here? Let's have a look in the sql file. The product_id and user_id MUST exist in the relevant tables with the primary keys otherwise the foreign key constraint explodes.

### Here Be Dragons

You never want to hard code Ids into your seed file. We never drop the database table itself, only the data in it so the ID numbers keep incrementing! Have a look.

```
ruby db/seeds.rb
Trainer.all.first #look at the id!
```
Always store trainers in variables and reference the id.

We are going to have to tweak our save methods on Pokemon and Trainer so that it returns the last thing that was saved. Before we save, the model has no id (it's generated by the database) and often we want to get that back and use it.

[TASK:] Get the students to think about how we might achieve this.

Some SQL platforms have a last() method we can call. In Postgres, we can type RETURNING * after our SQL query. Let's tweak our save methods!

```
#pokemon.rb
def save()
  sql = "INSERT INTO Pokemons (name) VALUES ('#{ @name }') RETURNING *"
  return Pokemon.map_item(sql)
end
```

Now if we run our seed data can see the item is returned. We need to comment out our entry save method.

```
#entry1.save

p1 = pokemon1.save()
p2 = pokemon2.save()
```

[Task:] Update the save method for Trainers

```
def save()
  sql = "INSERT INTO Trainers (name) VALUES ('#{ @name }') RETURNING *"
  return Trainer.map_item(sql)
end

```

## Finish the methods

Let's go into our OwnedPokemon model, and create the models we need! First, let's create our map_items and map_item functions, to make our lives easier:

```
def self.map_items(sql)
  owned_pokemons = SqlRunner.run_sql( sql )
  result = owned_pokemons.map { |owned_pokemon| OwnedPokemon.new( owned_pokemon ) }
  return result
end

def self.map_item(sql)
  result = OwnedPokemon.map_items(sql)
  return result.first
end
```

Then we can add our self.all function

```
def self.all()
  sql = "SELECT * FROM OwnedPokemons"
  return OwnedPokemon.map_items(sql)
end
```
Run this in terminal and check it works.

Lastly delete

```
 def self.delete_all 
    sql = "DELETE FROM OwnedPokemons"
    SqlRunner.run_sql(sql)
  end
  
```

We can now add this to the very top of the console file

```
OwnedPokemons.delete_all
```

With that, back to the original problem!! We can now get the ids of our newly created items. Let's add some nice seed data.

### Better Seed Data

We can now save our created trainers in variables.

```

trainer1 = Trainer.new({ 'name' => 'Tony' })
trainer2 = Trainer.new({ 'name' => 'Valerie' })

t1 = trainer1.save()
t2 = trainer2.save()

```
Finally, we can pass these ids to our OwnedPokemon entries!

```
entry1 = OwnedPokemon.new({ 'trainer_id' => t1.id , 'pokemon_id' => p1.id })
entry2 = OwnedPokemon.new({ 'trainer_id' => t2.id , 'pokemon_id' => p1.id })
entry3 = OwnedPokemon.new({ 'trainer_id' => t2.id , 'pokemon_id' => p2.id })

entry1.save()
entry2.save()
entry3.save()

```
[Task:] Go and make some more seed data.

## Mapping our join

Ok, we now have a relational link setup. It would be cool if our models could request data from one another though:

- trainer1.pokemons would return all the pokemon belonging to that trainer
- pokemon1.trainers would show you the trainers that own that pokemon

[DRAW ON BOARD]

Let's first write the SQL in the postgres terminal and work it out.

First, we need a valid trainer id.
```
Trainer.all
```
Take a note of an id and slot it in here.
```
psql -d pokemonSELECT * FRO
SELECT p.* from POKEMONS p inner join OWNEDPOKEMONS o ON o.pokemon_id = p.id WHERE trainer_id = 1;
```
Cool now we need to teleport this into our model.

```
#trainer.rb

 def pokemon()
    sql = "SELECT p.* from POKEMONS p inner join OWNEDPOKEMONS c ON c.pokemon_id = p.id WHERE o.trainer_id = #{@id};"
    return Pokemon.map_items(sql)
  end

```
Now in the terminal we can see a trainers pokemon.

```
trainer1.products
```
[TASK:] Add the trainers() method to Pokemon.

```
#product.rb
def trainers()
    sql = "SELECT t.* from Trainers t INNER JOIN OwnedPokemons o ON o.trainer_id = t.id WHERE pokemon_id = #{@id};"
    return Trainer.map_items(sql)
  end
```









