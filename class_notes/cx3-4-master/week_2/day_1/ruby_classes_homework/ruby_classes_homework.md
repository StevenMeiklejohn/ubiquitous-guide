#Object Orientation Homework

### TL;DR

* Bears must
	- roar (return a string)
	- have a type (e.g 'Grizzly')
	- have a name (e.g. 'Yogi')
	- have a tummy (empty array)

* Fish must
	- have a name (e.g 'Nemo')

* River must
 	- be populated with an array of fishes

Bears must be able to take fish from the river. This decreases the fish in the river and increases the fish in the bears tummy.

### Bears

Create a Bear Class, allow it to be instantiated with a 'name' and 'type' instance variable.  Instantiate a couple of bears setting their name and type ( eg Bear.new('Yogi', 'Grizzly') )

Give the bear a roar method.
Make your bears roar (return a string with the content)

### Fish & River

Create a Fish Class. Again give the fish a 'name' instance variable.

Create a River class. Allow the river to be instantiate with an array of fishes.  ( just like the Bank with Bank Accounts )

Instantiate three fish objects.  Instantiate a river object that has these three fishes in an array.

### Objects working together

When bears are initialized give them an empty 'food' array instance variable.

Allow the bear to 'take_fish_from' the river.  Taking a fish from the river should remove it from the river fishes array and add it to the bear's tummy. 

Think carefully how we can give the bear access to the river.

Array.pop may come in useful here

How do we test that the fish has moved from the river's fishes to the bear's tummy?

What happens if the river has no fish?

