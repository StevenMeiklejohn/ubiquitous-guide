require('minitest/autorun')
require("minitest/rg")
require_relative('../sparrow.rb')

class SparrowTest < MiniTest::Test

  def setup
    @sparrow = Sparrow.new
  end

  def test_sparrow_can_fly
    assert_equal("flying", @sparrow.fly)
  end


end
