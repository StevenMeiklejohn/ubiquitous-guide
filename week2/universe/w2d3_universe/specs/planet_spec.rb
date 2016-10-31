require("minitest/autorun")
require("minitest/rg")
require_relative("../planet.rb")

class TestPlanet < Minitest::Test

def setup

@LV426 = Planet.new("LV426")
@ice_pop = Planet.new("ice_pop")
@new_wave = Planet.new("new_wave")
@big_fizz = Planet.new("big_fizz")

end

end
