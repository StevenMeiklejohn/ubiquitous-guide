require "mintest/autorun"
require_relative "../board.rb"

class TestBoard < Minitest::Test

def test_board_should_have_9_tiles
  @board=Board.new(9)
  assert_equal(9, @board.state.size)
end

end