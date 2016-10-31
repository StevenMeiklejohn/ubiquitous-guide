require('minitest/autorun')
require("minitest/rg")
require_relative('../rihanna.rb')

class RihannaTest < MiniTest::Test

  def setup
    @rihanna = Rihanna.new("atrocious ocious ocious")
  end

  def test_ri_output_method
    assert_equal("atrocious ocious ocious", @brihanna.ri_output_method)
  end


end