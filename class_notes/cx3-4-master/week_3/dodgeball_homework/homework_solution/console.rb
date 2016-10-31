require_relative( 'models/match.rb' )
require_relative( 'models/team.rb' )
require_relative( 'models/league.rb' )

require( 'pry-byebug' )

Match.delete_all()
Team.delete_all()


team1 = Team.new({'name' => 'Edinburgers'})
t1 = team1.save()
team2 = Team.new({'name' => 'FC Glasgae'})
t2 = team2.save()
team3 = Team.new({'name' => 'Living Stone United'})
t3 = team3.save()
team4 = Team.new({'name' => 'AmberDeen'})
t4 = team4.save()

match1 = Match.new({'away_id' => t1.id, 'home_id' => t2.id, 'away_score' => 2, 'home_score' => 2})
m1 = match1.save
match2 = Match.new({'away_id' => t3.id, 'home_id' => t4.id, 'away_score' => 5, 'home_score' => 2})
m2 = match2.save
match3 = Match.new({'away_id' => t4.id, 'home_id' => t1.id, 'away_score' => 0, 'home_score' => 9})
m3 = match3.save
match4 = Match.new({'away_id' => t2.id, 'home_id' => t3.id, 'away_score' => 8, 'home_score' => 6})
m4 = match4.save


league = League.new

binding.pry
nil
