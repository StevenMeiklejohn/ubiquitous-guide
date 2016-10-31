require('minitest/autorun')
require('minitest/rg')
require_relative('../duck')
require_relative('../behaviours/quack')
require_relative('../behaviours/glide')

class DuckTest < MiniTest::Test
  def setup
    @duck = Duck.new(Quack.new, Glide.new)
  end
  
  def test_duck_can_fly
    assert_equal("glide", @duck.fly)
  end

  def test_duck_can_quack
    assert_equal("quack", @duck.call)
  end

  def test_duck_has_2_legs
    assert_equal(2, @duck.num_legs)
  end
end