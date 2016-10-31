require( 'pg' )
require_relative( '../db/sql_runner.rb')
require_relative( './pets.rb')


class Pet_store

  attr_accessor( :id, :name, :address, :stock_type )



  def initialize( options )
    @id = options['id'].to_i
    @name = options['name']
    @address = options['address']
    @stock_type = options['stock_type']
  end

  ######################



  def save
    sql = "INSERT INTO pet_store (
    name,
    address,
    stock_type
    ) 
    VALUES (
    '#{ @name }',
    '#{ @address }',
    '#{ @stock_type }'
    ) 
    RETURNING * "
    pet_store = SqlRunner.run( sql ).first
    result = Pet_store.new( pet_store )
    return result
  end


  def update()
    sql = "UPDATE pet_store 
    SET name = '#{ @name }',
    address = '#{ @address }',
    stock_type = '#{ @stock_type }'
    WHERE id = #{@id}"
    pet_store = SqlRunner.run( sql )
    result = Pet_store.new( pet_store )
    return result
  end

  def delete()
    sql = "DELETE FROM pet_store WHERE id = #{@id}"
    pet_store = SqlRunner.run( sql )
    result = Pet_store.new( pet_store )
  end


  def self.all()
    sql = "SELECT * FROM Pet_store"
    list = SqlRunner.run( sql )
    #list.map = put the data returned as list (an arbitrary word) into an array (this will be an array of hashes).
    #{ |pet| Pets.new(pet) }
    #assign in turn each hash entry as 'pet' then, on each entry in turn, feed that data into the Pets.new function.
    return list.map { |pet| Pet_store.new( list ) }
  end




end