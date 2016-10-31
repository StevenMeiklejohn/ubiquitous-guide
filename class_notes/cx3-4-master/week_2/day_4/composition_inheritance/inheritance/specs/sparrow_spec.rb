require('minitest/autorun')
require('minitest/rg')
require_relative('../sparrow')

class SparrowTest < MiniTest::Test
  def setup
    @sparrow = Sparrow.new
  end
  
  def test_sparrow_can_fly
    assert_equal("flying", @sparrow.fly)
  end
  
  def test_sparrow_can_chirp
    assert_equal("chirp", @sparrow.call)
  end

end