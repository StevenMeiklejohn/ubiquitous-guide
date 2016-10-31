require_relative("turn_log")

class Game
  attr_reader :current_player, :winner, :log

  def initialize(players, board)
    @players = players
    @board = board
    @current_player = players[0]
    @winner = nil
    @log = []
  end

  def number_of_players
    return @players.count
  end

  def update_current_player
    @current_player = @players.rotate![0]
  end

  def next_turn(spaces)
    return if(is_won?)

    distance_to_end = @board.win_tile - @current_player.position
    movement = spaces > distance_to_end ? distance_to_end : spaces
    @current_player.move(movement)

    modifier = @board.state[@current_player.position] || 0

    @current_player.move(modifier)

    @log << TurnLog.new(player: @current_player, roll: spaces, modifier: modifier)

    update_current_player
  end

  def is_won?
    for player in @players
      @winner = player if player.position >= @board.win_tile
    end
    return @winner.nil? ? false : true
  end

end
