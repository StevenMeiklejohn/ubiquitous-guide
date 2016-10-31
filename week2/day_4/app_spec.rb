require( 'minitest/autorun')
require( 'minitest/rg')
require_relative( 'app2' )

class TestApp < Minitest::Test

  def test_value_of_pi
    assert_equal(100, CrazyMath::PI)
  end

# def test_module_play
#   array= Pokemon::Array.new
#   assert_equal( "Bulbasour", array.pokemon )
# end

# def test_array_only_has_pikachu
#   array = Pokemon::Array.new
#   assert_equal( 'Pikachu', array[9])
# end

end