require("pry-byebug")

class Map

  attr_accessor :space

  def initialize(size, positions)
    @space = Array.new(size, {})

    for key in positions.keys
      @space[key] = positions[key]
    end

  end


  def star_position
    return @space.length - 1
  end


  def spaceship_on_planet(spaceship)
    @space[spaceship.position][:planet]
  end


  def spaceship_lands_at_planet(spaceship)
    for position in @space
        if position.class == Hash && position.has_key?(:planet)
          if spaceship_on_planet(spaceship) == position[:planet]
            spaceship.refuel
          end
        end
    end
  end

end
