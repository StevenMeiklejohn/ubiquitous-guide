require('minitest/autorun')
require_relative('../bear.rb')
require_relative('../fish.rb')
require_relative('../river.rb')

class TestEcoSystem < MiniTest::Test

  def setup
    bear1 = Bear.new( 'Barney', 'brown', 'fish', 'RAAAAAR!')
    bear2 = Bear.new( 'Baloo', 'grizzly' 'fish', 'ROOAAR!')
    fish1 = Fish.new('Bubbles')
    fish2 = Fish.new('James Pond')
    fish3 = Fish.new('Muddy the Mudskipper')
    fish4 = Fish.new('One eyed Jack McNoTail')
    river_new = River.new('The Muddy Wishkah')

    bears = [bear1, bear2, bear3]
    fishes = [fish1, fish2, fish3, fish4]
    animals = [bear1, fish1, fish2, fish3, fish4]

    @ecosystem=Ecosystem.new(animals)

  end

  def test_roar
    assert_equal("RAAAAAR!", first_bear.roar)
  end




end
