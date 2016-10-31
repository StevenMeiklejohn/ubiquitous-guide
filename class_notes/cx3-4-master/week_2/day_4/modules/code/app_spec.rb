require('minitest/autorun')
require_relative('app')

class TestApp < Minitest::Test
  def test_array_has_size_2
    array = Pokemon::Array.new
    assert_equal(151, array.size)
  end

  def test_array_has_only_pikachu
    array = Pokemon::Array.new
    assert_equal("Pikachu", array[3])
  end

  def test_value_of_pi_is_100
    assert_equal(100, CrazyMath::Pi)
  end
end