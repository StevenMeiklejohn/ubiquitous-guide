require( 'minitest/autorun' )
require('pry-byebug')
require_relative( '../models/league' )
require_relative( '../models/team' )
require_relative( '../models/match' )


class TestSales < Minitest::Test

  def setup
    Match.delete_all
    Team.delete_all
    @team1 = Team.new({'name' => 'Edinburgers'}).save()
    @team2 = Team.new({'name' => 'FC Glasgae'}).save()
    @team3 = Team.new({'name' => 'Living Stone United'}).save
    @team4 = Team.new({'name' => 'AmberDeen'}).save
    @match1 = Match.new({'away_id' => @team1.id, 'home_id' => @team2.id, 'away_score' => 2, 'home_score' => 2}).save
    @match2 = Match.new({'away_id' => @team3.id, 'home_id' => @team4.id, 'away_score' => 5, 'home_score' => 2}).save
    @match3 = Match.new({'away_id' => @team4.id, 'home_id' => @team1.id, 'away_score' => 0, 'home_score' => 9}).save
    @match4 = Match.new({'away_id' => @team2.id, 'home_id' => @team3.id, 'away_score' => 8, 'home_score' => 6}).save
    @league = League.new([@match1, @match2, @match3, @match4])
  end

  def test_all_goals
    assert_equal( 34, @league.all_goals )
  end


end 