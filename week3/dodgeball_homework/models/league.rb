require( 'pg' )
require_relative( 'match.rb' )
require_relative( 'team.rb' )


class League

  attr_accessor :matches

  def initialize( matches )
    @matches = matches
  end

  def all_goals
    all_goals = 0
    @matches.each{|match| all_goals += 
    (match.away_team_score + match.home_team_score)}
      return all_goals
    end

    def winners
      @matches.map {|match| if match.winner != "Its a tie" then match.winner else "Its a tie" end}
    end

end