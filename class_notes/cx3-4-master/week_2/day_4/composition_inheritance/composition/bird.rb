class Bird
  attr_reader :num_legs
  def initialize(call_behaviour, fly_behaviour)
    @num_legs = 2
    @call_behaviour = call_behaviour
    @fly_behaviour = fly_behaviour 
  end

  def fly
   @fly_behaviour.fly()
  end

  def call
    @call_behaviour.call()
  end

end