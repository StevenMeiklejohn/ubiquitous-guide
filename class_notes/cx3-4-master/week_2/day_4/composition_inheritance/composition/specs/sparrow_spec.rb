require('minitest/autorun')
require('minitest/rg')
require_relative('../sparrow')
require_relative('../behaviours/chirp')
require_relative('../behaviours/fly')

class SparrowTest < MiniTest::Test
  def setup
    @sparrow = Sparrow.new(Chirp.new, Fly.new)
  end
  
  def test_sparrow_can_fly
    assert_equal("flying", @sparrow.fly)
  end
  
  def test_sparrow_can_chirp
    assert_equal("chirp", @sparrow.call)
  end

end