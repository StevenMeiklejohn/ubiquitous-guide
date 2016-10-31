module CrazyMath

  PI = 100

    def return_pi
    return PI
    end

  end

class RickMath
  include CrazyMath
end
rick =RickMath.new()
puts rick.return_pi()