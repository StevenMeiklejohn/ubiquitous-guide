require("minitest/autorun")
require("minitest/rg")
require_relative("../map.rb")
require_relative("../spaceship.rb")

class TestMap < Minitest::Test

  def setup

    positions = {
      0 => {planet: "icepop"},
      1 => {wormhole: 16},
      2 => {planet: "LV426"},
      6 => {planet: "new_wave"},
      18 => {planet: "big_fizz"}
    }

    @map = Map.new( 20, positions)
    @spaceship = Spaceship.new( name: "Firefly", position: 2, fuel_level: 50, fuel_per_lightyear: 10 )

  end

  def test_map_has_20_light_years
    assert_equal( 20, @map.space.size)
  end

  def test_light_year_1_is_wormhole
    assert_equal( 16, @map.space[1][:wormhole])
  end

  def test_planet_exists
    assert_equal("icepop", @map.space[0][:planet])
    assert_equal("LV426", @map.space[2][:planet])
    assert_equal("new_wave", @map.space[6][:planet])
    assert_equal("big_fizz", @map.space[18][:planet])
  end

  def test_star_position
    assert_equal( 19, @map.star_position)
  end

  def test_refuel_if_planet
    @spaceship.move(4)
    @map.spaceship_lands_at_planet(@spaceship)
    assert_equal(50, @spaceship.fuel_level)
  end

  def test_not_refuel_if_not_planet
    @spaceship.move(3)
    @map.spaceship_lands_at_planet(@spaceship)
    assert_equal(20, @spaceship.fuel_level)
  end

  def test_spaceship_on_planet
    assert_equal( "LV426", @map.spaceship_on_planet(@spaceship))
  end

end



















