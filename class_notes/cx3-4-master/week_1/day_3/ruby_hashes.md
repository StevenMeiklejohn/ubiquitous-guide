# Hashes

###objectives

1. Understand what a hash is
2. Create a hash
3. Add keys to a hash
4. Retrieve items from a hash
5. Delete items from a hash
5. Understand what a symbol is

### duration
1 hour

====================

##What is a hash

We have seen that we can store a collection of objects in an array object.

```
irb
my_toys = [ 'lightsaber', 'teddy', 'slinky' ]
my_toys[0]
```

Ruby provides another class that are designed for storing collections of objects. Hashes.

[:i] Draw on board that this is class that we are adding to our toolbox. 

The main difference is that with arrays items are retrieved by the integer index. In a hash every item is given a key and it is this key that is used to retrieve the object.

The technical description of a hash is a collection of key-value pairs - that can also be referred to as dictionaries or associative arrays. 

Each key in the hash is unique allowing you to always find the value you stored against a particular item.

Another difference to an Array in that we can't assume that it's items are stored in any partcular order.

It's a little bit like a filing cabinet - we have labels we associate with things we want to store e.g. finance, recipes, reciepts. It doesn't matter to use what "index" the items are stored at (there's no need to know Finance is the first set of items in the drawer), what matters is the label we filed it under.


##Using Hashes

### Creating Hashes

```
	#irb
	my_first_hash = Hash.new
	my_second_hash = {}
	my_toys = { 'under_the_bed' => 'lightsaber',  'cupboard'=>'teddy', 'drawer' =>'slinky' }
	
```
###Accessing elements
We can access elements in a simlar manner to arrays. However, using the key rather than the index.

```
my_toys['under_the_bed']
```
Note: gere we are using strings as the keys in our hash.  We can use any object we want as the key.  We will see later an object that is better suited as a key.

If we try to access an element for which there is no key the has will return nil. 
```
	my_toys
	my_toys['jacket_pocket']
```
We can override this using if we wish by passing it as the argument when we create it

```
	my_hash = Hash.new(0)
```

### Accessing using fetch
We saw access hashes using square brackets
```
	my_toys['drawer']
```
Another option is to use the fetch method
```
	my_toys.fetch('drawer')
```
The main difference using the fetch method is that it will scream if it can't find the key
```
	my_toys.fetch('lalala')
	
```

#Modifying Elements

We can add objects to a hash much like we would assign variable.

```
	my_toys['jacket_pocket'] = 'top trumps'
```
We can also replace objects

```
	my_toys['jacket_pocket'] = 'firetruck'
	my_toys
```

We can remove items using the delete method.

```
 	my_toys.delete('jacket_pocket')
 	my_toys
```

#Symbols

Symbol is class provided to us by Ruby which objects are particularly suited as keys for hashes.  A Symbol is essentially a string.  Unlike strings they are immutable, cannot change.  This makes it lighterweight and allows for greater performance as a key.  We won't go into details here.  What we need to know is the syntax.


```
	:my_sym
	:hello
```
```
	my_toys = { :under_the_bed => 'lightsaber',  :cupboard => 'teddy'  }
```

Symbols are so commonly used as keys in hashes that Ruby gives us a special syntax.

```
	my_toys = { under_the_bed: 'lightsaber',  cupboard: 'teddy' }
	my_toys[:under_the_bed]
```

## Nested Hashes

We can actually store a hash inside of a hash! Sounds scary, but it can actually be very useful. What if we wanted to store more than just the population - maybe the capital city?

```
countries = {
	uk: {
		capital: 'London',
		population: 1000
	},
	germany: {
		capital: 'Berlin',
		population: 5
	}
}
```
[Task:] See if you can figure out how to get the population out of Germany.

```
countries[:germany][:population]
```