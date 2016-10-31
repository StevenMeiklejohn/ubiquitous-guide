require('minitest/autorun')
require('minitest/rg')
require_relative('../cat_functions.rb')


class TestCat < MiniTest::Test


  def test_size
    mr_bojangles = Cat.new('small', 15, 'rusty_brown', 'sleep')
    assert_equal("small", mr_bojangles.size)
  end

  def test_age
    mr_bojangles = Cat.new('small', 15, 'rusty_brown', 'sleep')
    assert_equal(15, mr_bojangles.age)
  end

  def test_colour
    mr_bojangles = Cat.new('small', 15, 'rusty_brown', 'sleep')
    assert_equal('rusty_brown', mr_bojangles.colour)
  end

  def test_change_age
   mr_bojangles = Cat.new('small', 15, 'rusty_brown', 'sleep')
   mr_bojangles.change_age(10) 
   assert_equal(25, mr_bojangles.age)
 end




  def test_walking
    mr_bojangles = Cat.new('small', 15, 'rusty_brown', 'walk')
    answer=walking('walk')
    assert_equal('I am walking', answer)
  end
 
  def test_sleeping
    mr_bojangles = Cat.new('small', 15, 'rusty_brown', 'walk')
    answer=sleeping('sleep')
    assert_equal('I am sleeping', answer)
  end

  end
