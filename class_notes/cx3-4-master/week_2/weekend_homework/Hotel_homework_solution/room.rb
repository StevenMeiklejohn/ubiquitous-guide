require 'pry-byebug'
class Room

  attr_accessor :beds, :guests, :minibar

  def initialize(beds, minibar)
    @beds = beds
    @guests = []
    @minibar = minibar
  end

  def check_in(guests)
    if available? && enough_space?( guests )
      guests.each do |guest|
        @guests << guest
      end
     else
      return "Sorry, not enough space"
    end
  end

  def check_out()
    until @guests.empty? do
      @guests.pop
    end
  end

  def available?()
    return @guests.empty?
  end

  def enough_space?(guests)
    free_beds = @beds - @guests.count
    if guests.count <= free_beds
      return true 
    else
      return false
    end
  end

  def count_minibar
    i = 0
    @minibar.each do |product|
      i += 1
    end
    return i
  end

  def buy_from_minibar(product, guest)
    cost = @minibar.delete(product)
    guest.deduct_funds(cost)
  end


end