### title

Loops

### topic

### objectives
* To understand how to use looping constructs to control behaviour

### standards

### materials

### summary

Code-along in IRB to introduce conditional operators and loops. Also moving out of IRB into executing Ruby script files.

### assessment

### follow-up

====================

# Loops

Loops in Ruby are used to execute the same 'bit'/chunk of code a specified number of times. 

In Ruby we can use any of the following constructs: `for`, `while`, `until`, `loop`

Let's create a ```touch loops.rb```

### For Loop

Executes code once for each element in expression.

```
	my_array = [1,2,3,4,5]	
	for i in my_array; puts i; end
```
[Draw on board with loops] 

* first time i = 1
* second time i = 2
* third time i = 3 and so on...

### While loop
```
	i = 0
	my_num = 5
	
	while i < my_num  do
	   puts "number is #{i}"
	   i +=1
	end
```

### Until loop

Executes code until conditional is true

```
 x = 0
  
 until x == 10
 	puts x += 1 
 end
```

What happens if the condition is never met?... The code will loop forever, or eventually crash.

```
  x = 0; until x == 10; puts x -= 1; end # ctrl-c to exit ;-)
```

So beware of infinite loops (and stack overflows). Ruby loops just keep on going until you run out of RAM...


## Playing with loops

Let's write a program that asks a user to guess the answer to a maths question, and loops until they get it right:

```
  # terminal
  subl loop.rb
```

```
  # loop.rb
  my_number = 5
  puts "What number am I thinking of? "
  value = gets.to_i

  until value == my_number
    print "nope... try again: "
    value = gets.to_i
  end

  puts "yes!"
```

[:OPTIONAL]What would need to change in the above program to give the user information about whether their guess was too high, or too low? Is it much effort to do that? Why don't we...

[i]: if there's time, make the change, or encourage them to do it (5 mins to write a `case`/`if` statement)


## Exiting out of loops

To exit out of loops, and when loops crash, we have some other functionality available to us:

```
  loop do
    print "type something: "
    line = gets.chomp
    break if line.downcase == 'q'
    puts "you typed: #{line}"
  end
```

  - break:
    Terminates the most internal loop. Terminates a method with an associated block if called within the block (with the method returning nil).

So for instance, if we want to loop asking the user for input for ever, *until* they type a particular character ('q'), we could use:

## More idiomatic Ruby

Loops are a very common programming device, and Ruby support them, but when we get further into Ruby programming, we will use them less, in favour of more idiomatic Ruby constructs.

