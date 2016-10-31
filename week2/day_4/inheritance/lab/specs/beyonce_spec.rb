require('minitest/autorun')
require("minitest/rg")
require_relative('../beyonce.rb')

class BeyonceTest < MiniTest::Test

  def setup
    @beyonce = Beyonce.new("atrocious")
  end

  def test_bey_output_method
    assert_equal("atrocious", @beyonce.bey_output_method)
  end


end
