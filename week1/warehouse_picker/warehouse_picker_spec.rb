require 'minitest/autorun'
require_relative 'solution/warehouse_picker_functions_solution'

class TestMeme < Minitest::Test
  def test_item_at_bay
    item = item_at_bay('b5')
    assert_equal('nail filer', item)
  end

  def test_bay_for_item
    item = find_bay_for_item('nail filer')
    assert_equal('b5', item)
  end

  def test_items_at_bays
    items = items_at_bays(['b5','b10','b6'])
    expected = ["nail filer", "tooth paste", "cookie jar"]
    assert_equal(expected, items)
  end

  def test_find_bays_for_items
    bays = find_bays_for_items(["shoe lace", "rusty nail", "leg warmers"])
    expected = ["c1", "c9", "c10"]
    assert_equal(expected, bays)
  end

  def test_find_index_of_bay
    index = index_of_bay('a1')
    assert_equal(9, index)
  end

  def test_items_with_distance_1
    items_with_distance = items_at_bays_with_distance( ['b5','b10','b6'] )
    items = items_with_distance[:items]
    distance = items_with_distance[:distance]
    expected_items = ["nail filer", "tooth paste", "cookie jar"]
    assert_equal(items, expected_items)
    assert_equal(5, distance)
  end

  def test_items_with_distance_2
    items_with_distance = items_at_bays_with_distance( ['b3','c7','c9', 'a3'] )
    items = items_with_distance[:items]
    distance = items_with_distance[:distance]
    expected_items = ["blouse", "paint brush", "shoe lace", "picture frame"]
    assert_equal(items, expected_items)
    assert_equal(15, distance)
  end

  def test_bays_by_order_to_visit_1
    bays = sorted_bays_for_items( ["shoe lace", "rusty nail", "leg warmers"] )
    expected = ["c1", "c9", "c10"]
    assert_equal(expected, bays)
  end

  def test_bays_by_order_to_visit_2
    bays = sorted_bays_for_items( ["hanger", "deodorant", "candy wrapper", "rubber band"] )
    expected = ["a10", "a4", "c8", "b9"]
    assert_equal(expected, bays)
  end

end