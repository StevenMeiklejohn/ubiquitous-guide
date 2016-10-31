require_relative( 'pizza' )

class Sales

  def initialize( pizzas )
    @pizzas = pizzas
  end

  def total_revenue 
    @pizzas.reduce(0) { |sum, pizza| sum + pizza.quantity } * 10
  end

end