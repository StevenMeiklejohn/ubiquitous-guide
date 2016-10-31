require('minitest/autorun')
require_relative('app')

class TestApp < Minitest::Test
  def test_adds_one_to_each_item
    assert_equal([2,3,4], add([1,2,3]))
  end

  def test_multiply_each_item_by_two
    assert_equal([2,4,6], multiply([1,2,3]))
  end

  def test_map_multiply_each_item_by_two
    assert_equal([2,4,6], map([1,2,3]){ |i| i * 2 })
  end

  def test_map_add_two_to_each_item
    assert_equal([2,3,4], map([1,2,3]){ |i| i + 1 })
  end

  def test_up_to_you_add
    assert_equal(2, up_to_you { 1 + 1 })
  end

  def test_up_to_you_hello
    assert_equal("hello Valerie", up_to_you { |i| "hello "+i })
  end

  def test_array_map_add_one
    array = [1,2,3]
    result = array.map { |x| x + 1}
    assert_equal([2,3,4], result)
  end

  def test_array_map_add_one_with_do
    array = [1,2,3]
    result = array.map do |x|
      x + 1
    end
    assert_equal([2,3,4], result)
  end

  def test_each
    array = [1,2,3]
    result = []
    array.each do |i|
      result << i
    end
    assert_equal([1,2,3], result)
  end

  def test_each_return
    array = [1,2,3]
    result = array.each do |i|
      #do nowt
    end
    assert_equal([1,2,3], result)
  end
end