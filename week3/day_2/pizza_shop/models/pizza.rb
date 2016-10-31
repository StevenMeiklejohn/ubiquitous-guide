#Instance method

require( 'pry-byebug' )
require( 'pg' )

class Pizza

  attr_accessor( :first_name, :last_name, :topping, :quantity)
  #allows methods in the class to read/update any of these variables by names.

  def initialize( options )
    @id = options[ 'id' ].to_i
    @first_name = options[ 'first_name']
    @last_name = options[ 'last_name' ]
    @topping = options[ 'topping']
    @quantity = options[ 'quantity' ].to_i
  end

#creating a hash called options which contains our variables.
#These options will also serve as our SQL table rows/columns.

# pizza = Pizza.new( {'first_name' => 'Rick', 'last_name' => 'Henry', 'topping' => 'margherita', 'quantity' => 2} )
#instatiate a pizza. Define options as a hash.
#To use with SQL ensure to use the hash syntax above (not the variable: style)




#in terminal type;
#gem install pg
#install's pg gem which is what we use to connect to postgres SQL (database)

#next create a new database.
# In the command line/terminal
# createdb pizza_shop

#create another directory 'db' at the same level as 'models'
#in db create a pizza_shop.sql. fill in pizza_shop.sql
#create tabel in SQL. In terminal, type.
#psql -d pizza_shop -f db/pizza_shop.sql 

#take out earlier instansiation which was just for demonstration.

#Create a method for sending relevant data in Rubot memory to the database.

def save()
  #create a connection using PG (class).....
  db = PG.connect( { dbname:'pizza_shop', host:'localhost' } )
  sql = "INSERT INTO pizzas (
    first_name,
    last_name,
    topping,
    quantity ) 
    VALUES (
    '#{ @first_name }',
    '#{ @last_name }',
    '#{ @topping }',
    #{ @quantity }
    );"
#tell the db to carry out this function
    db.exec( sql )
#close database connection
    db.close()
end


#try out a new instantiation. 
#run pizza.rb script....

#In the command line type
# ruby models/pizza.rb 

#instantiate pizza
#pizza = Pizza.new( { 'first_name' => 'Keith', 'last_name' => 'Douglas', 'topping' => 'Pepperoni', 'quantity' => 4 } )

#save the pizza. type...
#pizza.save

#Brief Overview.
#=> The command have been....
#ruby models/pizza.rb
#pizza = Pizza.new( { 'first_name' => 'Keith', 'last_name' => 'Douglas', 'topping' => 'Pepperoni', 'quantity' => 4 } )
#pizza.save


#To demonstrate this has all worked.....
#cmd +t new terminal
#access database---
#psql -d pizza_shop
#instantiate new pizza-------
#pizza = Pizza.new( { 'first_name' => 'Keith', 'last_name' => 'Douglas', 'topping' => 'Pepperoni', 'quantity' => 4 } )
#pizza_shop=# select * from pizzas;

#===================================

#Now we will create a 'class method'
#If we wanted to return all the pizza orders, its not really the pizza instance's (object's) job to do it.
#For something like that we would use a class method

# def Pizza.all()
# end

#alternatively....

def self.all()
  db = PG.connect( { dbname: 'pizza_shop', host: 'localhost' } )
  sql = "SELECT * FROM pizzas"
  db.exec( sql )
  #store the return value from the database as variable 'pizzas'
  pizzas = db.exec( sql )
  db.close()
  #return the contents of the variable and map it back to the pizza hash. Feed it back in to the pizza initialise method, thereby creating a pizza.
  #So, return an array of pizza instances. 
  return pizzas.map { |pizza| Pizza.new( pizza ) }
end


#re-run.ruby models/pizza.rb
#the terminal should return something like....
##<PG::Result:0x007f9c428dc300 status=PGRES_TUPLES_OK ntuples=2 nfields=5 cmd_tuples=2>




#=================================
#now create an instance method to update the entry.

def update()
  db = PG.connect( { dbname:'pizza_shop', host:'localhost' } )
  sql = "UPDATE pizzas 
          SET first_name = '#{ @first_name }',
          last_name = '#{ @last_name }',
          topping = '#{ @topping }',
          quantity = #{ @quantity }
          WHERE id = #{@id}"
  db.exec( sql )
  db.close()
end

#options = ( { 'first_name' => 'Steve', 'last_name' => 'Meiklejohn', 'topping' => 'Pepperoni', 'quantity' => 2 } )
#######################
##UPDATE INSTRUCTIONS.
#ruby models/pizza.rb 
##put all pizzas into an array called 'pizzas'
#pizzas = Pizza.all()
##return (to ruby/rubot) the pizza we want to update using .first or array index. and assign it to variable 'pizza'
#pizza = pizzas.first / Pizza.all[1]
##define the update in the array
#pizza.first_name = "Rick"
##update to the database
#pizza.update
#check contents of database.
#Pizza.all()

#################################


#now create an instance method to delete the entry


def delete()
  db = PG.connect( { dbname:'pizza_shop', host:'localhost' } )
  sql = "DELETE FROM pizzas WHERE id = #{@id}"
  db.exec( sql )
  db.close()
end









binding.pry
nil

end




#