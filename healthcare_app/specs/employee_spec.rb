require('minitest/autorun')
require_relative('../models/employee.rb')

class TestEmployee < MiniTest::Test

  def setup
    options ={
      "name" => "Sally"
    }

    
    @employee = Employee.new(options)
  end


  def test_name
    assert_equal( 'Sally', @employee.name())
  end




end
