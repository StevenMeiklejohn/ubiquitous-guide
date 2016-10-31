require('minitest/autorun')
require('minitest/rg')
require_relative('../people.rb')
require_relative('../room.rb')
require_relative('../hotel.rb')



 class TestHotel < Minitest::Test



  def setup
    @hotel_name = "Guesthouse Paradiso"
    @room1 = Room.new(1, "single", 100, "vacant", "none")
    @room2 = Room.new(2, "single", 100, "vacant", "none")
    @room3 = Room.new(3, "single", 100, "vacant", "none")
    @room4 = Room.new(4, "single", 100, "vacant", "none")
    @room5 = Room.new(5, "single", 100, "vacant", "none")
    @room6 = Room.new(6, "double", 150, "occupied", "none")
    @room7 = Room.new(7, "double", 150, "occupied", "none")
    @room8 = Room.new(8, "double", 150, "occupied", "none")
    @room9 = Room.new(9, "double", 150, "occupied", "none")
    @room10 = Room.new(10, "double", 150, "occupied", "none")
    @person1 = People.new("Cannonball Taffy O' Jones")
    @person2 = People.new("Harry The Bastard")
    @person3 = People.new("Jerzei Bolovski")
    @person4 = People.new("Dr Wildthroat")
    @person5 = People.new("Tight Lipped Larry")
    @all_rooms = [@room1, @room2, @room3, @room4, @room5, @room6, @room7, @room8, @room9, @room10]
    @hotel=Hotel.new("Guesthouse Paradiso", @all_rooms)
  end
 
 
    def test_hotel_name
      assert_equal("Guesthouse Paradiso", @hotel_name)
    end



    def test_number_of_rooms
      assert_equal(10, @hotel.number_of_rooms)
    end

    def test_total_value_of_rooms
      assert_equal(1250, @hotel.total_value_of_rooms)
    end

    def test_total_room_status
      assert_equal(5, @hotel.total_room_status)
      assert_equal(5, @hotel.total_room_status)
    end

    def test_occupy_room
      num = @hotel.occupy_room(1, "Mr Bojangles")
      assert_equal(@room1, num)
      
    end

    def test_vacate_room
      num = @hotel.vacate_room(1)
      assert_equal('vacant', num)
    end






  
 
   # def test_initial_state
   #   assert_equal(3, @river.number_of_fishes)
   # end
 
   # def test_can_get_fish
   #   fish = @river.get_fish
   #   assert_equal(fish.name, @fish3.name)
 
   end