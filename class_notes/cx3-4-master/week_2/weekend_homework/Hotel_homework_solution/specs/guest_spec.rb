require('minitest/autorun')
require('minitest/rg')
require_relative('../guest.rb')

class GuestTest < Minitest::Test

  def setup
    @guest = Guest.new("Rick", 10.0)
  end

  def test_guest_has_name
    assert_equal("Rick", @guest.name)
  end

  def test_guest_has_funds
    assert_equal(10.0, @guest.funds)
  end


end