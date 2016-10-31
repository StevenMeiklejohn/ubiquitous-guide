require('minitest/autorun')
require('minitest/rg')
require_relative('../room.rb')
require_relative('../guest.rb')


class RoomTest < Minitest::Test

  def setup
    minibar = { "peanuts" => 4.99, "coke" => 2.99, "jim beam" => 6.99}
    @guest1 = Guest.new("Rick", 10.0)
    @guest2 = Guest.new("Keith", 15.0)
    @guest3 = Guest.new("Beth", 20.0)
    @guests1 = [@guest1, @guest2]
    @guests2 = [@guest3]
    @room = Room.new(2, minibar)
  end

  def test_room_has_beds
    assert_equal(2, @room.beds)
  end

  def test_guest_can_check_in
    @room.check_in(@guests1)
    assert_equal(2, @room.guests.count)
  end

  def test_guest_can_check_out
    @room.check_in(@guests1)
    @room.check_out()
    assert_equal(0, @room.guests.count)
  end

  def test_check_if_has_space
    @room.check_in(@guests1)
    assert_equal("Sorry, not enough space", @room.check_in(@guests2))
  end

  def test_room_is_available
    @room.check_in(@guests1)
    assert_equal(false, @room.available?)
  end

  def test_has_minibar
    assert_equal(3, @room.count_minibar)
  end

  def test_can_buy_from_minibar
    @room.buy_from_minibar("coke", @guest1)
    assert_equal(2, @room.count_minibar)
  end

  def test_can_spend_money_at_minibar
    @room.buy_from_minibar("coke", @guest1)
    assert_equal(7.01, @guest1.funds)
  end

end