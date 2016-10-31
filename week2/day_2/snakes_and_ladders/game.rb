class Game

attr_accessor(:current_player)

def initialize (players, board)
  @players = players
  @board = board
  @current_player = players[0]
  @winner = nil
end

def number_of_players
  return @players.count
end

def update_current_player
  @current_player = @players.rotate![0]
end

def next_turn( distance )
  distance_to_end = @board.wintile - @current_player.position

  movement = distance > distance_to_end ? distance_to_end : distance

  @current_player.move( movement )

  modifier = @board.state[@current_player.position]

  @current_player.move( modifier )

  update_current_player
end

def is_won?
  for player in @players
    @winner = player if player.position == @board.wintile
  end
  return @winner.nil? ? false : true
end




end
