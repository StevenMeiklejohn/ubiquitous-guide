require_relative 'game'
require_relative 'player'
require_relative 'board'
require_relative 'dice'
require_relative 'viewer'

class SnakeAndLadders

  def initialize(dice)
    @dice = dice

    positions = {
      2 => 4,
      7 => -7,
    }
    board = Board.new(9, positions)

    player1 = Player.new("Val")
    player2 = Player.new("Rick")

    players = [player1,player2]
    @game = Game.new(players,board)
  end

  def simulate(viewer)
    until(@game.is_won?)
      @game.next_turn(@dice.roll)
    end

    viewer.replay(@game.log)
  end

end

game = SnakeAndLadders.new(Dice.new)
game.simulate(Viewer.new)
