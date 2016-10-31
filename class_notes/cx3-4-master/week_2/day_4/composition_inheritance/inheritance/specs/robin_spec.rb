require('minitest/autorun')
require('minitest/rg')
require_relative('../robin')

class RobinTest < MiniTest::Test
  def setup
    @robin = Robin.new
  end
  
  def test_robin_can_chirp
    assert_equal("chirp", @robin.call)
  end

  def test_robin_can_fly
    assert_equal("flying", @robin.fly)
  end
end
