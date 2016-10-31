require_relative( 'models/team.rb' )
require_relative( 'models/match.rb' )
require_relative( 'models/league.rb' )


require( 'pry-byebug')

Match.delete_all
Team.delete_all


team1 = Team.new( { 'name' => 'Dodger Federer' })
team2 = Team.new( { 'name' => 'No Hit Sherlock' })

team3 = Team.new( { 'name' => 'Norfolk Enchance' })
team4 = Team.new( { 'name' => 'Throwbocop' })



t1 = team1.save
t2 = team2.save
t3 = team3.save
t4 = team4.save


match1 = Match.new( {
  'home_team_id' => t1.id,
  'away_team_id' => t2.id,
  'home_team_score' => 2,
  'away_team_score' => 1 } )

match2 = Match.new( {
  'home_team_id' => t3.id,
  'away_team_id' => t4.id,
  'home_team_score' => 2,
  'away_team_score' => 3 } )

match3 = Match.new( {
  'home_team_id' => t2.id,
  'away_team_id' => t3.id,
  'home_team_score' => 1,
  'away_team_score' => 0 } )

match4 = Match.new( {
  'home_team_id' => t4.id,
  'away_team_id' => t1.id,
  'home_team_score' => 3,
  'away_team_score' => 2 } )

@matches = [match1, match2, match3, match4]

m1 = match1.save
m2 = match2.save
m3 = match3.save
m4 = match4.save



league1 = League.new(@matches)


binding.pry
nil

