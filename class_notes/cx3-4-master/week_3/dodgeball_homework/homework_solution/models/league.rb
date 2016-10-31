require 'pry-byebug'
class League

  attr_accessor :matches

  def initialize(matches)
    @matches = matches
  end

  def all_goals
    all_goals = 0
    @matches.each {|match| all_goals += (match.away_score + match.home_score)}
    return all_goals
  end

  def winners
    @matches.map {|match| if match.winner != "It's a tie" then match.winner else "It's a tie" end}
  end



end