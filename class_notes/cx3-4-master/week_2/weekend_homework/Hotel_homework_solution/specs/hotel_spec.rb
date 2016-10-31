require('minitest/autorun')
require('minitest/rg')
require_relative('../hotel.rb')
require_relative('../room.rb')
require_relative('../guest.rb')



class HotelTest < Minitest::Test

  def setup
    @guest = Guest.new("Rick", 10.0)
    @guests = [@guest]
    minibar = { "peanuts" => 4.99, "coke" => 2.99, "jim beam" => 6.99}
    @room1 = Room.new(2, minibar)
    @room2 = Room.new(2, minibar)
    @room3 = Room.new(4, minibar)
    @room4 = Room.new(4, minibar)
    @hotel = Hotel.new("Hilton")
    @hotel.rooms.push(@room1, @room2, @room3, @room4)
  end

  def test_hotel_has_name
    assert_equal("Hilton", @hotel.name)
  end

  def test_hotel_can_add_rooms
    assert_equal(4, @hotel.rooms.count)
  end

  def test_hotel_count_beds
    assert_equal(12, @hotel.count_beds)
  end

  def test_hotel_can_count_rooms
    assert_equal(4, @hotel.count_rooms)
  end

  def test_guest_can_check_in
    @hotel.check_in_hotel(@room1, @guests)
    assert_equal(1, @room1.guests.count)
  end


end