class Board

  attr_accessor( :state )

  def initialize(size, positions )
    @state = Array.new( size, 0)
    for key in positions.keys
      #for keys in #positions. 
      #so, for keys=[2, 7]
      @state[key]=positions[key]
      #@state is default (signified by the "0" in "@state = Array.new( size, 0)"
      #so state is[0, 0, 0, 0, 0, 0, 0, 0, 0]
      #so, on firt loop state[key]=2 will be changed from 0 to 4.
      #on second loop state[key]=7 will be changed from 0 to 7.
     end
  end

  def state
    return @state
  end

  def wintile
    return @state.length - 1
  end




end
