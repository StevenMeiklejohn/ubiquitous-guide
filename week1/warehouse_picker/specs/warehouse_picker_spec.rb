require ('minitest/autorun')
require_relative '../warehouse_picker_functions.rb'

class TestWarehouse < Minitest::Test


#1

def test_item_at_bay()
  location = item_at_bay( :b2 )
  assert_equal("nail filer", location)
end

# def bay_for_item()
#   item = item_at_bay( "nail_filer" )
#   assert_equal("b5", item)
# end

# def items_in_bays()
# end



end