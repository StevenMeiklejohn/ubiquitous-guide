class Board
  attr_reader :state

  def initialize(size, positions)
    @state = Array.new(size,0)
    
    for key in positions.keys
      @state[key] = positions[key]
    end
  end

  def win_tile
    @state.size - 1;
  end

end