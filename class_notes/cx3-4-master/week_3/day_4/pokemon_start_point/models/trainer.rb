require( 'pg' )
require_relative('../db/sql_runner')

class Trainer

  attr_reader( :id, :name )

  def initialize( options )
    @id = options['id'].to_i
    @name = options['name']
  end

  def save()
    sql = "INSERT INTO Trainers (name) VALUES ('#{ @name }')"
    SqlRunner.run( sql )
  end

  def self.all()
    sql = "SELECT * FROM Trainers"
    return Trainer.map_items(sql)
  end

  def self.delete_all
    sql = "DELETE FROM Trainers"
    SqlRunner.run(sql)
  end

  def self.map_items(sql)
    trainers = SqlRunner.run( sql )
    result = trainers.map { |trainer| Trainer.new( trainer ) }
    return result
  end

  def self.map_item(sql)
    result = Trainer.map_items(sql)
    return result.first
  end

end