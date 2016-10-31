class Bear
  attr_accessor :name, :type

  def initialize(name,type)
    @name = name
    @type = type
    @food = []
  end

  def roar 
    "Rooooar"
  end

  def food_count
    @food.size
  end

  def take_fish_from_river(river)
    fish = river.get_fish
    @food << fish unless fish.nil?
  end













end