require( 'pg' )
require_relative('../db/sql_runner')

class Match

  attr_accessor :id, :away_id, :home_id, :away_score, :home_score

  def initialize(options)
    @id = options['id'].to_i
    @away_id = options['away_id'].to_i
    @home_id = options['home_id'].to_i
    @away_score = options['away_score'].to_i
    @home_score = options['home_score'].to_i
  end

  def save
    sql = "INSERT INTO matches (away_id, home_id, away_score, home_score) VALUES (#{@away_id},#{@home_id},#{@away_score}, #{@home_score}) RETURNING *"
    return Match.map_item(sql)
  end

  def self.all()
    sql = "SELECT * FROM matches"
    return Match.map_items(sql)
  end

  def self.delete_all
    sql = "DELETE FROM matches"
    SqlRunner.run(sql)
  end

  def winner
    if away_won?
      sql = "SELECT teams.* FROM teams INNER JOIN matches ON matches.away_id = teams.id WHERE teams.id = #{@away_id}"
      return Team.map_item(sql)
    elsif home_won?
      sql = "SELECT teams.* FROM teams INNER JOIN matches ON matches.home_id = teams.id WHERE teams.id = #{@home_id}"
      return Team.map_item(sql)
    elsif tie?
      return "It's a tie"
    end
  end

  def away_won?
    @away_score > @home_score
  end

  def home_won?
    @home_score > @away_score
  end

  def tie?
    @home_score == @away_score
  end

  def self.map_items(sql)
    matches = SqlRunner.run(sql)
    result = matches.map { |match| Match.new( match ) }
    return result
  end

  def self.map_item(sql)
    result = Match.map_items(sql)
    return result.first
  end

end