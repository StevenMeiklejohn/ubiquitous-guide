class Cat

  attr_accessor :size, :age, :colour, :doing

  def initialize(size, age, colour, doing)
    @size=size
    @age = age
    @colour = colour
    @doing = doing
  end

  def change_age (amount)
    @age += amount
  end

  def walking (input)
    if @doing=input
      return "I am walking"
    end
  end

  def sleeping (input)
    if @doing=input
      return "I am sleeping"
    end
  end




# def change_doing(input)
#    if @doing=="walk"
#     puts "I am walking"
#   end
# end




end


