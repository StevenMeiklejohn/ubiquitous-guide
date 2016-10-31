require_relative('room')
class Hotel

  attr_accessor :name, :rooms

  def initialize(name)
    @name = name
    @rooms = []
  end

  def add_room(room)
    @rooms.push(room)
  end

  def check_in_hotel(room, guests)
    room.check_in(guests)
  end

  def count_rooms
    @rooms.count
  end

  def count_beds
   beds = @rooms.map {|room| room.beds}
   beds.inject {|sum, bed| sum + bed}
  end






end