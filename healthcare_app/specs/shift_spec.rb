require('minitest/autorun')
require_relative('../models/shift.rb')

class TestShift < MiniTest::Test

  def setup
    options ={
      "staff_id" => 1,
      "client_id" => 2,
      "shift_report" => "Client was a little sleepy so made food to eat later"
    }

    
    @shift = Shift.new(options)
  end


  def test_staff_id
    assert_equal( 1, @shift.employee_id())
  end


  def test_client_id
    assert_equal( 2, @shift.client_id())
  end

  def test_shift_report
    assert_equal( "Client was a little sleepy so made food to eat later", @shift.shift_report())
  end







end
