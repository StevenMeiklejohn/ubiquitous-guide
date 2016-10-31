require('minitest/autorun')
require_relative('../fish.rb')
require_relative('../river.rb')

class TestRiver < Minitest::Test

  def setup
    @fish1 = Fish.new("Bob")
    @fish2 = Fish.new("Harry")
    @fish3 = Fish.new("Fred")
    @river = River.new([@fish1,@fish2,@fish3])
  end

  def test_initial_state
    assert_equal(3, @river.number_of_fishes)
  end

  def test_can_get_fish
    fish = @river.get_fish
    assert_equal(fish.name, @fish3.name)

  end

end