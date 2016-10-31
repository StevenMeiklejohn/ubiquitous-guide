class Hotel


  attr_accessor :hotel_name, :all_rooms

  def initialize(hotel_name, all_rooms)
   @hotel_name = hotel_name
   @all_rooms = all_rooms
  end
 
 
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
    return total_vacant
    return total_occupied
  end

  def occupy_room(num, name)
  for room in @all_rooms
    if room.room_number == num
      room.status="occupied"
      room.occupier_name = name
      return room
     end
  end
  end


  def vacate_room(num)
    for room in @all_rooms
      if room.room_number == num
        room.status="vacant"
        room.occupier_name = "none"
        return room.status
      end
    end
    end









 end 