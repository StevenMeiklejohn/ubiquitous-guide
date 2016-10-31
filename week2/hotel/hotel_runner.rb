require_relative('people.rb')
require_relative('room.rb')
require_relative('hotel.rb')
require_relative('specs/hotel_spec.rb')
require_relative('specs/room_spec.rb')
require_relative('specs/people_spec.rb')


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
@hotel =Hotel.new("Guesthouse Paradiso", @all_rooms)






# def initialize(hotel_name, all_rooms)
#  @hotel_name = hotel_name
#  @all_rooms = all_rooms
# end


def hotel_name(hotel_name)
  return @hotel_name
end


def number_of_rooms
  return @all_rooms.count
end

def total_value_of_rooms
  total=0
  for room in @all_rooms
    total += room.room_cost
  end
  return total
end

def total_room_status
  total_vacant=0
  total_occupied=0
  for room in @all_rooms
    if room.status=='vacant'
      total_vacant+=1
    else 
      total_occupied+=1
    end
  end
  puts "#{total_vacant} rooms are vacant"
  puts "#{total_occupied} rooms are occupied"
end

def occupy_room
  puts "Please enter the room number"
  num = gets.chomp
  puts "Please enter the customer's name"
  name = gets.chomp
  for room in @all_rooms
    if room.room_number == num
    room.status=="occupied"
    room.occupier_name == name
    end
    puts room.room_number
    puts room.room_type
    puts room.room_cost
    puts room.status
    puts room.occupier_name
  end
end





def vacate_room
  puts "Which room would you like to vacate?"
  num = gets.chomp
  for room in @all_rooms
    if room.room_number == num
      room.status="vacant"
      room.occupier_name = "none"
    end
      puts room.room_number
      puts room.room_type
      puts room.room_cost
      puts room.status
      puts room.occupier_name
   end
 end
  


 
  puts "Welcome to the Ghesthouse Paradiso Management App!"
  puts "Would you like to......"
  puts "(a)Check the status of all rooms, (b)Check in, (c)Check out, (d)See vacant/occupied totals"
  selection = gets.chomp

  input = case selection
  when "a"
    puts "aye aye"
  when "b"
    occupy_room
  when "c"
    vacate_room
  when "d"
    total_room_status
  end


