# Ruby Functions

#### Learning objectives

* Understand the concept of isolating code into functions
* Why we use functions
* Understand local variables
* Undertsand parameters and arguments
* Run our first tests
* Recognise duplication in code and attempt to DRY

##### Duration

1 hour

## What are functions?

- A 'function' is a resusable chunk of code that can be called (invoked) by name to perform a specific task.

Let's create a litte code file to play with ``` touch my_functions.rb ```

```
def my_name() 
   return "Rick"
end

puts my_name()

```
## So what do they do?

We use them to encapsulate meaningful pieces of code into small, isolated constructs

We've been using some functions already like `.to_i`, `.chomp`. These are special kinds of functions which are associated with an object ("methods"). Try not to worry about this too much - we will cover it later in the week.

In Ruby, functions *always* return a value - whether we want them to or not.  By default, the result of the last evaluated expression is returned, but you can also use the `return` keyword to explicitly return a value. We will do this in the beginning because it makes it clearer.

## Why Do We Use Functions?
 * It's much easier to find and fix bugs if you've organized your program well.
 * Separation of concerns makes our code less redundant
 * We can 'encapsulate' data so that no other part of the program can interefere with it

## Anatomy of a Function

Defined with `def` then function name followed by (), end with `end`

  - name can't begin with a number
  - name *must* begin with a lower-case character
  - special characters are allowed and imply functionality (? for predicate, ! or 'bang', = for setters, etc)

## Scope

A function has it's own internal world and can't see the information that another function has.

```
  def my_name()
  	name = "Rick"
  	return name
  end
  
  def not_my_name
  	return name
  end
  
  puts not_my_name()
```

We call variables which are solely defined in a function "local variables". They exist for the life of the function, then are lost. They cannot be seen by any other function.

## Passing variables to functions

We can give functions the information they need using arguments which we pass into the function.

```
  def greet(name)
    puts "hello, #{name}"
  end

  greet('Fred')
  => "hello, Fred"
```

When we define what we need in our functions world, we call these parameters. When we provide what a function has asked for, we call these arguments.

Multiple parameters are separated with a comma:

```
   def greet(first_name, last_name)
    puts "hello, #{first_name} #{last_name}"
  end
```
[Task:] make a function that prints "the weather today is: " plus the current weather, with one parameters that takes in the current weather condition.

## Let's test what we do

When we write our code we want to make sure it works. Sounds obvious but let's have a think abut it. We can craft better code if it's tested. How do we test?

There are many approaches to Testing our code but the principles are the same. What we want to do is write code which asserts an expectation and returns true or false on the outcome. Or pass of fail!

All languages have test suites and different ways of testing but Ruby has a test unit built in - called minitest.  We test to:

- Craft better code
- It's more maintainable
- It's easier to get your head into large codebases
- It makes your code more modular
- We don't want to manually test

To setup our tests we create a seperate file:

```
mkdir specs
cd specs
touch my_functions_spec.rb

```

This my_functions_spec.rb is going to be run by us manulally and ensure our functionality 'passes'! Inside our my_functions_spec.rb:

```
require( 'minitest/autorun' )
require_relative( '../my_functions' )

class My_Functions < MiniTest::Test

  def test_my_name()
    name = my_name()
    assert_equal( 'Rick', name )
  end

end

```

We can run this in terminal ```ruby specs/my_functions_spec.rb```

We get an error - this is cool! It says "undefined method `my_name'". What do we need to do? Let's go and create a function.

### Good/bad method names

It's always useful to use function names that say what the function does - use snake case.

### More functions

Let's create an add function. We want to test drive our code in our spec. What do we need to do step by step:

1. define a function
2. decide a good method name for add? Add is probably good!
3. invoke our function that we haven't created
4. use the assert_equal method which takes two arguments
	- the expected result
	- the called method
5. the end keyword

```
def test_add()
	result = add( 2, 2 ) 
	assert_equal( 4, result )
end

```

If we run this spec. We should get an undefined method add(). This is handy, it's telling us what to do! We need to go and define a method add().

If we run our spec again, we get wrong number of arguments. This is useful - it's giving us tips of what we need to do...let's add some parameters! Let's add ``` num_1, num_2 ``` to our add parameters.

If we run our spec again we should get actual: nil. So we can then add a return to our function and should get a pass:

```
	return num_1 + num_2

```

### Be DRY

DRY - is a guiding principle of coding (especially in Ruby).

- **D**on't
- **R**epeat
- **Y**ourself

We can use functions to make our code DRYer.

```
def greeting(day, name)
	case day
	when 1
		"Hello #{name} it is Monday"
	when 2
		"Hello #{name} it is Tuesday"
	when 3
		"Hello #{name} it is Wednesday"
	when 4
		"Hello #{name} it is Thursday"
	end
end

puts greeting(1, "Valerie")

```

This code isn't very dry. What if we want to add "Isn't that awesome?" to the end of the line we print out?

```
def greeting(day, name)
	case day
	when 1
		"Hello #{name} it is Monday. Isn't that awesome?"
	when 2
		"Hello #{name} it is Tuesday. Isn't that awesome?"
	when 3
		"Hello #{name} it is Wednesday. Isn't that awesome?"
	when 4
		"Hello #{name} it is Thursday. Isn't that awesome?"
	end
end

puts greeting(4, "Valerie")
```

We can make this better by "encapsulating" or isolating the code that is repeated using a function. We need to ask ourselves "what is staying the same" and "what is changing?"

```
def greeting(day, name)
	case day
	when 1
		print_message(name, "Monday")
	when 2
		print_message(name, "Tuesday")
	when 3
		print_message(name, "Wednesday")
	when 4
		print_message(name, "Thursday")
	end
end

def print_message(name, day)
	"Hello #{name} it is #{day}. Isn't that awesome?"
end

puts greeting(4, "Valerie")
```
If you find yourself writing the same code over and over again, you most probably need a function.