class Spaceship

  attr_accessor :spaceship_name, :position, :fuel_level

  def initialize(params)
    @spaceship_name = params[:name]  
    @position = params[:position]
    @fuel_level = params[:fuel_level]
    @fuel_per_lightyear = params[:fuel_per_lightyear]
  end

  def move(lightyears)
    @position += lightyears
    @fuel_level -= (lightyears * @fuel_per_lightyear)
  end

  def refuel()
    refuel = 50 - @fuel_level
    @fuel_level += refuel
  end

end