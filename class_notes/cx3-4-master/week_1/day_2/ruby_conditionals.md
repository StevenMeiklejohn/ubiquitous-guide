# Conditionals

### objectives

* To understand how to use conditional operators to control behaviour
* Understand if stamements
* Understand "else"
* Understand ternary operators
* Understand case select

### Duration
1 hour

====================

# Conditional Logic

In our daily lifes we often make decisions based on some outcomes.

E.g if it's sunny, I will walk to work. Otherwise, I'll take the bus.

If I catch a pikachu, I'll be happy. Otherwise, I'll be sad.

We often want to do the same thing in our code. If a certain condition is true, do something. If it is false, do something else.

We have seen how to "assign" a variable - this is when we use a single equals sign to take a value on the right side of the statement and make the variable on the left side of the statement be the same. This allows us to use that variable to do interesting things.

```
#irb
 first_number = 1
```

Once we have assigned a variable a value, we might want to check if it is equal to another variable. We use the double equals sign == to check for equality.

```
2 == 3
=> false

2 == 2
=> true
```

You'll see that irb has returned true and false here, which is what we would expect. But what are these funny words? They are just instances of a class representing true and false.

```
#irb
true.class
false.class
```
We can use these to make decisions in our code. We will see these true and false classes when we evaluate portions of our code to see if they are true or false.

```
  # irb - examples of statements that evaluate to true or false

  4 == 2 + 2
  #=> true

  4 == 2 + 3
  #=> false
  
  "cat" == "cat"
  #=> true
  
  "cat" == "dog"
  #=> false
  
  "1" == 1 #how to fix this?
  
```

## Type Conversion 

We need to be careful with this, since the string "1" is not the same as the Fixnum 1. The string "1" is a piece of text not a number. What happens here?

```
"1"+"1"
=> "11"
1 + 1
=> 2
1 + "1"
=> ????
```
Ruby has no idea what to do here, since Strings and Fixnums are not the same thing. It's like trying to put a VHS into a dvd player or vice versa. The two things are similar but incompatible.

Luckily, there are methods (functions on an object) out of the box in Ruby that allow us to convert one type to another.

```
"1".to_i == 1
=> true
1.to_s == "1"
=> true
```
We need to bare this in mind when testing assertions in our code.

# Control Flow

Making a decision based on a statement being true or false is the basis of conditional logic. Ruby allows us to write this in a way that sounds a *little* like a "normal" sentence.

```
 if (2 + 2 == 4) then "do this" else "do that" end
```
We can also "negate" conditions.
  
```
  if 2+2 != 4 then "do this" else "do that" end -> #what does this do?

  unless true then "do this" else "do that" end
```

Aside: we don't normally see these conditionals on one line like this (it's quite hard to read...); instead it's normally presented on multiple lines.

```
  if (2+2 == 4)
    "do this"
  else
    "do that"
  end
```

We can also add a conditional statement to the end of single lines of code, as a 'guard'.

```
  "hello" if (1 + 1 == 2)
  "hello" if (1+1 == 4)
```

You will also come across "ternary" operators -- most commonly seen with very simple true/false conditional logic. 

We call them "ternary" because they take three arguments - the thing being evaluated, the action to take if it evaluates true and the action to evaluate if it evaluates as false.

```
  (1+1==2) ? "hello" : "bye"
```
We're reaching the limits of what we want to type in the console. We need to write bigger programs, so we'll need to start working with Ruby files, and executing them in the terminal.

```
  # terminal
  subl what_animal.rb
```

```
	# what_animal.rb
	puts "What animal are you?"
	name = gets.chomp
	if(name == "Chicken")
		puts "This is my favourite animal!"
	else
		puts "Sad, not my favourite."
	end
```

```
  # terminal
  ruby what_animal.rb
```
Braces around the condition is very common in most programming languages. However, in Ruby we do not need them.


What happens if we want to add a condition for a kitten?

```
	# what_animal.rb
	puts "What animal are you?"
	name = gets.chomp
	if name == "Chicken"
		puts "This is my favourite animal!"
	elsif name == "Kitten"
		puts "I love kittens!"
	end
	puts "Sad, not my favourite."
```

'If' statements work very well for one or two conditions, but when there are multiple conditions they can get a bit messy. 

## When choices are more complex

Instead we can use 'case' statements (in some languages, these are called 'switch' statements).

```
  # terminal
  subl case_statement.rb
```

```
  # case_statement.rb
  score = 6
  result = case score
    when 10
      "genius"
    when 8..9
      "merit"
    when 5..7
      "pass"
    else # default value is optional... without this it would return nil
      "fail"
  end
  puts result
```

```
  # terminal
  ruby case_statement.rb
```

Think about what would be needed to alter the program to alter the output? How easy is it to:

  - change the score ranges
  - add more conditions
  - ask user for score as input (rather than hard-coding it as '6')

[i]: Depending on time, allow them to complete some of the above.

[i:] If there is time, talk about && and ||. (truth tables)