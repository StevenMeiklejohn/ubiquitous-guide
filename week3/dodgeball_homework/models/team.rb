require( 'pg' )
require_relative('../db/sql_runner')

class Team

  attr_reader( :id, :name )

  def initialize( options )
    @id = options['id'].to_i
    @name = options['name']
  end

  def save()
    sql = "INSERT INTO teams (name) VALUES
    ('#{ @name }') RETURNING *"
    return Team.map_item( sql )
   end

   def self.all()
    sql = "SELECT * FROM teams"
    return Team.map_items( sql )
  end

  def self.delete_all()
    sql = "DELETE FROM teams"
    SqlRunner.run(sql)
  end


  def self.map_items(sql)
    teams = SqlRunner.run(sql)
    result = teams.map { |team| Team.new(team ) }
    return result
  end

  def self.map_item( sql )
    result = Team.map_items( sql )
    return result.first
  end


end