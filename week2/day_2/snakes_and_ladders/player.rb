class Player

attr_accessor( :player_name, :position )

def initialize (name)
  @player_name=name
  @position=0
end


def move( distance )
  @position += distance
end






end