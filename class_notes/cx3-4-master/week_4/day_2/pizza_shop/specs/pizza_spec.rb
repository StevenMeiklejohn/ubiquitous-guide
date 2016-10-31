require( 'minitest/autorun' )
require( 'minitest/rg' )
require_relative( '../models/pizza' )

class TestPizza < MiniTest::Test

  def setup
    options = {
      first_name: 'Tony', 
      last_name: 'Goncalves', 
      topping: 'Calzone', 
      quantity: '10'
    }
    @pizza = Pizza.new( options )

  end

  def test_first_name()
    puts "This is a pizza #{@pizza}"
    assert_equal( 'Tony', @pizza.first_name() )
  end

  def test_second_name()
    assert_equal( 'Goncalves', @pizza.last_name() )
  end

  def test_pretty_name()
    assert_equal( 'Tony Goncalves', @pizza.pretty_name() )
  end

  def test_topping()
    assert_equal( 'Calzone', @pizza.topping() )
  end

  def test_quantity()
    assert_equal( Fixnum, @pizza.quantity().class )
    assert_equal( 10, @pizza.quantity() )
  end

  def test_total()
    assert_equal( 100, @pizza.total() )
  end

end