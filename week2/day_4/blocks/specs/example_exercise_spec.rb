require ('minitest/autorun')
require_relative ('../example_exercise.rb')

class BayTest < Minitest::Test


  def test_item_at_bay
    item = item_at_bay('b5')
    assert_equal('nail filer', item)
  end

  def test_bay_for_item
    bay = bay_for_item('nail filer')
    assert_equal('b5', bay)
  end

  def test_items_at_bays
    bays = items_at_bays(["b3", "b4"])
    assert_equal(["picture frame", "photo album"], bays)
  end

  def test_find_bays_for_items
    name = find_bays_for_items(["cookie jar", "tissue box"])
    assert_equal(["b8", "b10"], name)
  end


 
end