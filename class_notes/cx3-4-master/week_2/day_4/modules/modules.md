# Namespaces

## Duration 30 mins

In Minitest, we saw that we inherited a class by doing this:

```
  class TestThing < Minitest::Test
```

What is this weird :: syntax? It's a namespace. This is a way of bundling together related code that we can call on to use. It's very common in gems and 3rd party code, since it avoids naming collisions. Let's see what we mean by that.

```
touch app_spec.rb app.rb
```

Let's create a normal Array.

```
require('minitest/autorun')
require_relative('app')

class TestApp < Minitest::Test
  
  def test_array_has_size_one
    array = Array.new
    assert_equal(0, array.size)
  end
end
```

Now let's try and make our own totally crazy array

```

  class Array
    def first
      "Bulbasaur"
    end

    def last
      "Mew"
    end

    def size
      151
    end

  end

```

If we include this in our specs, we will get a big fat error. This is because Arrays already exist in Ruby and we can't do this. Or can we?

We can wrap our Array in a "module."

```
module Pokemon
  class Array
    #etc
  end
end

```
Now, if we want to use it we use the :: syntax.

```
def test_array_has_size_zero
  array = Pokemon::Array.new
  assert_equal(0, array.size)
end
```

Our test is now failing, since the size is 151.This means when we make gems or bundles of code, we don't need to worry about clashing with other developers names for things. Our users can reference our classes directly.

We can do something very surprising with our Pokemon::Array...

```
#app
def [](index)
  "Pikachu"
end

#app_spec
def test_array_has_only_pikachu
  array = Pokemon::Array.new
  assert_equal("Pikachu", array[3])
end

```

Yep, turns out that the [] syntax for an array is just a method!

# Constants

We can also use modules to store constants.

```
#app_spec
def test_value_of_pi_is_100
  assert_equal(100, CrazyMath::Pi)
end

#app.rb
module CrazyMath
  Pi = 100
end
```

We have made our own totally mad Pi value!