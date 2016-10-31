require( 'pry-byebug')
require_relative('bear.rb')
require_relative('fish.rb')
require_relative('river.rb')

binding.pry
nil

#File is setup.
#the following is copied from terminal.

# ➜  homework_review ruby bear_runner2.rb

# From: /Users/user/Desktop/CX3-4/week2/day_1/homework_review/bear_runner2.rb @ line 7 :

#     2: require_relative('bear.rb')
#     3: require_relative('fish.rb')
#     4: require_relative('river.rb')
#     5: 
#     6: binding.pry
#  => 7: nil

# [1] pry(main)> yogi = Bear.new( 'yogi', 'grizzly')
# => #<Bear:0x007fd90270e530 @bear_name="yogi", @tummy=[], @type="grizzly">
# [2] pry(main)> forth = River.new( 'forth')
# ArgumentError: wrong number of arguments (given 1, expected 2)
# from /Users/user/Desktop/CX3-4/week2/day_1/homework_review/river.rb:5:in `initialize'
# [3] pry(main)> forth = River.new('forth', [])
# => #<River:0x007fd90273eaf0 @fish_in_river=[], @river_name="forth">
# [4] pry(main)> fish_1 = Fish.new('nemo')
# => #<Fish:0x007fd9048dd1c0 @fish_name="nemo">
# [5] pry(main)> fish_2=Fish.new('sinky')
# => #<Fish:0x007fd90490f058 @fish_name="sinky">
# [6] pry(main)> fishes= [fish_1, fish_2]
# => [#<Fish:0x007fd9048dd1c0 @fish_name="nemo">, #<Fish:0x007fd90490f058 @fish_name="sinky">]
# [7] pry(main)> forth
# => #<River:0x007fd90273eaf0 @fish_in_river=[], @river_name="forth">
# [8] pry(main)> forth.fish_in_river=fishes
# => [#<Fish:0x007fd9048dd1c0 @fish_name="nemo">, #<Fish:0x007fd90490f058 @fish_name="sinky">]
# [9] pry(main)> forth
# => #<River:0x007fd90273eaf0
#  @fish_in_river=[#<Fish:0x007fd9048dd1c0 @fish_name="nemo">, #<Fish:0x007fd90490f058 @fish_name="sinky">],
#  @river_name="forth">
# [10] pry(main)> 
# 10] pry(main)> yogi.take_fish
# ArgumentError: wrong number of arguments (given 0, expected 1)
# from /Users/user/Desktop/CX3-4/week2/day_1/homework_review/bear.rb:24:in `take_fish'
# [11] pry(main)> yogi
# => #<Bear:0x007fd90270e530 @bear_name="yogi", @tummy=[], @type="grizzly">
# [12] pry(main)> yogi.take_fish(forth)
# => [#<Fish:0x007fd90490f058 @fish_name="sinky">]
# [13] pry(main)> forth
# => #<River:0x007fd90273eaf0 @fish_in_river=[#<Fish:0x007fd9048dd1c0 @fish_name="nemo">], @river_name="forth">
# [14] pry(main)> 




