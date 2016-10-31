class River

attr_accessor :river_name, :fish_in_river

def initialize(name, fish)
  @river_name=name
  @fish_in_river=fish
end

def lose_fish
  return @fish_in_river.pop
end



end
