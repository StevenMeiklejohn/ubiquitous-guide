require("minitest/autorun")
require("minitest/rg")
require_relative("../spaceship.rb")

class TestSpaceship < Minitest::Test

  def setup
    @spaceship = Spaceship.new( name: "Firefly", position: 2, fuel_level: 50, fuel_per_lightyear: 10 )
  end

  def test_spaceship_name
    assert_equal("Firefly", @spaceship.spaceship_name)
  end

  def test_move_spaceship
    @spaceship.move(1)
    assert_equal(3, @spaceship.position)
    assert_equal(40, @spaceship.fuel_level)
  end

  def test_refuel
    @spaceship.move(1)
    @spaceship.refuel()
    assert_equal(50, @spaceship.fuel_level)
  end

  def test_max_fuel
    @spaceship.refuel()
    assert_equal(50, @spaceship.fuel_level)
  end


end