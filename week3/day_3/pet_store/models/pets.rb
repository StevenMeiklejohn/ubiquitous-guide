require( 'pg' )
require_relative( '../db/sql_runner.rb')


class Pets

  attr_accessor( :id, :name, :pet_type )

  def initialize( options )
    @id = options[ 'id' ].to_i
    @name = options[ 'name' ]
    @pet_type = options[ 'pet_type' ]
    # @pet_store_id = options[ 'pet_store.id' ].to_i
  end



  def save
    #Returning * will return everything the method saves in an object hash, instead of returning nil.
    sql = "INSERT INTO pets (name, pet_type) 
    VALUES 
    ('#{@name}',
    '#{@pet_type}')
    RETURNING *"
    pet = SqlRunner.run( sql ).first
    #We add .first as sql will return the data as an array (of hashes), i.e. one item in an array. the .first method removes the array 'casing' there by returning a hash which fits with our options hash.
    result = Pets.new( sql )
    return result
  end




  def update()
    sql = "UPDATE pets 
    SET name = '#{ @name }',
    pet_type = '#{ @pet_type }'
    WHERE id = #{@id}"
    pet = SqlRunner.run( sql )
    result = Pets.new( sql )
    return result
  end


  def delete()
    sql = "DELETE FROM pets WHERE id = #{@id}"
    pets = SqlRunner.run( sql )
    result = Pets.new( pets )
  end



  def self.all()
    sql = "SELECT * FROM pets"
    list = SqlRunner.run( sql )
    return list.map { |pet| Pets.new( pet ) }
    #list.map = put the data returned as list (an arbitrary word) into an array (this will be an array of hashes).
    #{ |pet| Pets.new(pet) }
    #assign in turn each hash entry as 'pet' then, on each entry in turn, feed that data into the Pets.new function.
  end


end
