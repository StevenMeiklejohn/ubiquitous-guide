#This file takes the place of a spec, since we are not doing testing for this review.

require_relative('bear.rb')
require_relative('fish.rb')
require_relative('river.rb')


#create new bear
yogi = Bear.new("Yogi", "grizzly")
bernard = Bear.new("Bernard", "polar")
#bear name is accessible, se we can access info about the newly instantiated bear. Sch as bear.name.
puts yogi.bear_name

#make the bear roar
puts yogi.roar
puts bernard.roar

#instantiate three fishes.

nemo=Fish.new("Nemo")
sinky = Fish.new("Sinky")
floaty = Fish.new("Floaty")
fishes = [nemo, sinky, floaty]
river = River.new("Forth", fishes)
# puts river.fish_in_river

array_of_fishes = river.fish_in_river

for fish in array_of_fishes
  # puts fish.fish_name
end

#make bear take a fish

yogi.take_fish(river)
puts yogi.tummy
puts river.fish_in_river





