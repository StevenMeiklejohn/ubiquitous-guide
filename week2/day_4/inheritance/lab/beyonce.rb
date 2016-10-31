require_relative('singers.rb')

class Beyonce < Singers

  def initialize (bey_output)
    @bey_output=bey_output
    super(2, "yes", "yes")
  end 


  def bey_output_method
    return @bey_output
  end



end