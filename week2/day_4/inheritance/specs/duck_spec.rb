require('minitest/autorun')
require("minitest/rg")
require_relative('../duck.rb')

class DuckTest < MiniTest::Test

  def setup
    @duck = Duck.new(2)
  end

  def test_duck_can_fly
    assert_equal("flying", @duck.fly)
  end

  def test_duck_has_2_legs
    assert_equal(2, @duck.num_legs)
  end


end