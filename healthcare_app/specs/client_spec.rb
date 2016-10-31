require('minitest/autorun')
require_relative('../models/client.rb')

class TestClient < MiniTest::Test

  def setup
    options ={
      "name" => "Mr Johnson",
      "address" => "20 Peat Rd",
      "requirements" => "tea and tuck"
    }

    
    @client = Client.new(options)
  end


  def test_name
    assert_equal( 'Mr Johnson', @client.name())
  end

  def test_address
    assert_equal( '20 Peat Rd', @client.address())
  end

  def test_requirements
    assert_equal( 'tea and tuck', @client.requirements())
  end






end
