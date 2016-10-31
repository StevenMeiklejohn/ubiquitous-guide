require_relative('bird.rb')

class Duck < Bird

def initialize(num_of_legs)
  @attitude="off the scale"
  super(2)
  # "super(2) calls the Bird initialize as well as runnning the Duck initialize."
end



end