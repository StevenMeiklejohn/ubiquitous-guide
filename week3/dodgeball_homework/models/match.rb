require( 'pg' )
require_relative('../db/sql_runner')

class Match

attr_reader( :id, :home_team_id, :away_team_id, :home_team_score, :away_team_score )

def initialize( options )
  @id = options['id'].to_i
  @home_team_id = options['home_team_id'].to_i
  @away_team_id = options['away_team_id'].to_i
  @home_team_score = options['home_team_score'].to_i
  @away_team_score = options['away_team_score'].to_i

end

def save()
  sql = "INSERT INTO matches (
  home_team_id, 
  away_team_id, 
  home_team_score, 
  away_team_score
  ) VALUES ( 
  #{ @home_team_id },
  #{ @away_team_id },
  #{ @home_team_score }, 
  #{ @away_team_score }) RETURNING *"
  return Match.map_item( sql )
end

def self.all()
  sql = "SELECT * FROM matches"
  return Match.map_items(sql)
end

def self.delete_all
  sql = "DELETE FROM matches"
  SqlRunner.run(sql)
end

# def teams
#   sql = "SELECT t*id from teams t
#   INNER JOIN league2016 l
#   ON l.team1_id = t.id
#   WHERE match1_id = #{@id};"
#   return Team.map_items(sql)
# end

def self.map_items(sql)
  matches = SqlRunner.run( sql )
  result = matches.map { |data| Match.new(data)}
  return result
end

def self.map_item(sql)
  result = Match.map_items(sql)
  return result.first
end




# def match_winner
#   if home_team_score > away_team_score
#     winner = home_team_id
#   elsif home_team_score < away_team_score
#     winner = away_team_id
#     else
#     winner = 'draw'
#   end
#   # result = get_team_name(winner)
#   return winner
# end

def winner
  if away_won?
    sql = "SELECT teams.* FROM teams INNER JOIN matches ON matches.away_team_id = teams.id WHERE teams.id = #{@away_team_id}"
    return Team.map_item(sql)
  elsif home_won?
    sql = "SELECT teams.* FROM teams INNER JOIN matches ON matches.home_team_id = teams.id WHERE teams.id = #{@home_team_id}"
    return Team.map_item(sql)
  elsif tie?
    return "It's a tie"
  end
end


def away_won?
  @away_team_score > @home_team_score
end

def home_won?
  @home_team_score > @away_team_score
end

def tie?
  @home_team_score == @away_team_score
end



      





end