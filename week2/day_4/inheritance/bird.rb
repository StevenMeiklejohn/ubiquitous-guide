class Bird

  attr_reader :num_legs

  def initialize(num_legs)
    @num_legs=num_legs
  end


  def fly
    return "flying"
  end


end