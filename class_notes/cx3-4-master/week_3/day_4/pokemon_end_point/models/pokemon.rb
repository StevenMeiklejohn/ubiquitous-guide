require( 'pg' )
require_relative('trainer')
require_relative('../db/sql_runner')

class Pokemon 

  attr_reader( :id, :name )

  def initialize( options )
    @id = options['id'].to_i
    @name = options['name']
  end

  def save()
    sql = "INSERT INTO Pokemons (name) VALUES ('#{ @name }') RETURNING *"
    return Pokemon.map_item(sql)
  end

  def trainers()
    sql = "SELECT t.* from Trainers t INNER JOIN OwnedPokemons o ON o.trainer_id = t.id WHERE pokemon_id = #{@id}"
    return Trainer.map_items(sql)
  end

  def self.all()
    sql = "SELECT * FROM Pokemons"
    return Pokemon.map_items(sql)
  end

  def self.delete_all 
    sql = "DELETE FROM Pokemons"
    SqlRunner.run(sql)
  end

  def self.map_items(sql)
    pokemons = SqlRunner.run(sql)
    result = pokemons.map { |pokemon| Pokemon.new( pokemon ) }
    return result
  end

  def self.map_item(sql)
    result = Pokemon.map_items(sql)
    return result.first
  end

end