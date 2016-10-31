# Blocks

##Learning Objectives

- Understand what blocks are
- Write our own blocks
- Get to know Ruby Enumerable Iterators

## Duration - 2 hours

So we need to talk about blocks.

Blocks are really weird and are almost the only thing in Ruby which are NOT objects. By that I mean they CANNOT be assigned to a variable. They take a bit of getting used to, but they are super powerful once you get your head around it.

Sometimes, we write bits of code that are very very similar but we have no way to break it down more sensibly. Let's have a look at an example.

```
touch app.rb

#app.rb

def add_one(items)
  result = []
  for item in items
    result << item + 1
  end
  return result
end
```

This will take every item in an array, and add 1 to it.

```
touch app_spec.rb
#app_spec
require('minitest/autorun')
require_relative('app')

class TestApp < Minitest::Test
  def test_adds_one_to_each_item
    assert_equal([2,3,4], add_one([1,2,3]))
  end
end
```

Great. But what happens if we need a function to multiply the items by 2?

```
#app_spec
def test_multiplies_each_item_by_two
  assert_equal([2,4,6], multiply_by_two([1,2,3]))
end

```

We need to copy the entire code to achieve this.

```
def multiply_by_two(items)
  result = []
  for item in items
    result << item * 2
  end
  return result
end
```

The only difference between these two functions is the operation we are applying to each item.

Enter blocks.

## The Power of Blocks

Blocks are very odd but very useful constructs in Ruby. There are similar things in other languages, such as callbacks in Javascript and Funcs in C#. In Ruby, they are NOT objects. They are one of the only things which are not. This means they CANNOT be assigned to a variable.

We use them with the {} syntax. We have seen this before in passing, but now we are going to have a look at what is actually going on.

```
#app
def up_to_you
  return yield
end
```

What is this weird yield keyword? It allows us to let the calling function pass us some code to execute. It's like copying and pasting code as our function runs, which is pretty nuts and very powerful.

```
#app_spec
def test_up_to_you_add
  assert_equal(2, up_to_you { 1 + 1 })
end
```

Our function simply returns whatever the user puts into the {}s. Similarly, we can pass the user arguments.

```
#app
def up_to_you
  name = "Valerie"
  yield(name)
end

#app_spec
def test_up_to_you_hello
  assert_equal("hello Valerie", up_to_you { |i| "hello "+i })
end
```

Wouldn't it be nice if we could now get rid of our add_one and multiply_by_two functions and merge them into one function? 

Let's do it!

```
#app
def map(items)
  result = []
  for item in items
    result << yield(item)
  end
  return result
end
```

"Yield" says, allow the person calling the function to pass us some code, and we will execute it. In this case, we are expecting them to want 1 argument which we are providing.

```
#app_spec
def test_map_multiply_each_item_by_two
  assert_equal([2,4,6], map([1,2,3]){ |i| i * 2 })
end

def test_map_add_two_to_each_item
  assert_equal([2,3,4], map([1,2,3]){ |i| i + 1 })
end
```

# Array Methods and Blocks

You may have noticed that in fact Ruby already has a map method on an array.

```
#app_spec
def test_array_map_add_one
  array = [1,2,3]
  result = array.map { |x| x + 1}
  assert_equal([2,3,4], result)
end
```

This doesn't look so weird now does it?

The only other thing to be aware of is that we can alternatively write blocks with the "do" syntax.

```
def test_array_map_add_one_with_do
  array = [1,2,3]
  result = array.map do |x|
    x + 1
  end
  assert_equal([2,3,4], result)
end
```

This is EXACTLY the same functionality, however we can now write multiple lines of code for more complex logic.

## Enumeration

A very common method of looping over an array is the each method in Ruby.

```
#app_spec
def test_each
  array = [1,2,3]
  result = []
  array.each do |i|
    result << i
  end
  assert_equal([1,2,3], result)
end
```

This is very similar to map, but rather than applying some operation we define to the item, we have complete control over what we want to do. It is simply a for loop in different clothing - however, it does not return the last item it looped over it returns the entire collection! This will trip us up a lot in Rails!

```
def test_each_return
  array = [1,2,3]
  result = array.each do |i|
    #do nowt
  end
  assert_equal([1,2,3], result)
end
```

## Common Emumerable Iterators

These are probably the ones you'll use most in Ruby:

- **each** returns the original object it was called on. Used for its side effects and not what it returns
- **each\_with_index** passes the current item and whatever position in the array it was located in.
- **select** (a.k.a find_all) returns a new object (e.g. array) filled with only those original items where the block you gave it returned true
- **find** finds the first object that meets the condition in the block
- **map** (a.k.a collect) returns a new array filled with whatever gets returned by the block each time it runs.


##Task (20 mins)

Let's say we have a warehouse of products:

```
PRPODUCTS = [
  {bay: 'a10', name: "rubber band"},
  {bay: 'a9', name: "glowstick"},
  {bay: 'a8', name: "model car"},
  {bay: 'a7', name: "bookmark"},
  {bay: 'a6', name: "shovel"}
]
```

See if you can use the common Enuerable Iterators to 

- Return the items at a given bay
- Return the bay for a given product
- Return the items for a given array of bays 


SOLUTION:

```
def item_at_bay(bay)
  PRODUCTS.find { |product| product[:bay] == bay }[:name]
end

def find_bay_for_item(item)
  PRODUCTS.find { |product| product[:name] == item }[:bay]
end

def items_at_bays(bays)
  items = PRODUCTS.select { |product| bays.include?(product[:bay]) }
  items.map { |item| item[:name] }
end

```


