require_relative('../singers.rb')

class Rihanna < singers

  def initialize (ri_output)
    @ri_output=ri_output
    super(2, "yes", "no")
  end 

  def ri_output_method
    return @ri_output
  end





end