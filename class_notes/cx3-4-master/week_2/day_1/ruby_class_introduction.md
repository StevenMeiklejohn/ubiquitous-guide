### Learning Objectives
1. Understand the basic idea of Object Orientation
2. Create a class
3. Create an instance of a class
4. Understand the difference between a class and an object
4. Add properties to class
5. Add methods to class
6. Understand the difference between a function and a method
7. Understand getters
8. Understand setters

### Duration

2.5 hours

#Ruby Classes

  We have been creating objects from the 'out the box' classes Ruby provides for us.

  Let's recap some of these classes.

  ```
  #irb
  a = []
  s = "hello"
  ```

  We have been calling methods on these objects also.
  ```
  	a.push(1)
  	a.length
  ```

  Today we are going to see how we can create our own objects, with their own methods.
  
  Fundamentally, object-oriented programming sees the world as data, modelled in code by "objects." 
  
  In OOP, the programmer focuses on designing 'classes'
  that define the properties and behaviours of 'objects' that will be instantiated from our classes.
  

### Requirements
  Ruby Bank Account Function Hashes Array exercise


##Introduction

We have been writing functions to achieve the behaviour we desire. Passing in the data we want to be updated and getting the function to return the result we want back.

Our programs have thus far have had our data, often in arrays and hashes,  and functions


```
	#terminal
	touch bank_account.rb 
```

```
  # bank_account.rb
	ACCOUNT = {
	  holder_name: "Jay",
	  amount: 500,
	  type: "business"
	}

	def get_account_name()
	  ACCOUNT[:holder_name]
	end
```

Let's make a spec file to run this.

```
#terminal 
touch bank_account_spec.rb

#bank_account_spec.rb
require('minitest/autorun')
require_relative('bank_account')

class TestBankAccount < MiniTest::Test
  def test_account_name
    assert_equal("Jay",get_account_name())
  end
end
```
You can see here the data hash and function are coupled in their behaviour. However, our accout name function is sort of just floating around in the middle of nowhere - the hash and the function are not linked in anyway even though we know they are used together.

Object orientated programming takes the step of grouping the behaviour and the data together in an object. This way, we can have nicely bundled pieces of related code that can be reused.

Often, we don't just want on object but many of that type.  Think about Strings, Arrays, Fixnums and in this case Bank Accounts. It is for this reason that when defining the behaviour, we don't do it for a single object,  but for a class of objects.

## Real world example

This might sound a bit scary, but it's really not. Let's think about a real life example.

In the classroom, we have many people. We all have different names, hair colour and favourite colours. However, we all have a name, we all have hair and we all have favourite colours. We know that a person has thse traits, and that since we are all people we have our own instances of these things.

In Ruby, we could say that a Person is a class, a template, a blueprint and that Valerie is an instance - she has specific implementations of the properties we know that a person has. I have brown hair, my name is Valerie and my favourite colours are red and purple.

Similarly, we know that all people can walk, talk and sleep. We all do this, in our own way. I walk differently to Rick, he talks differently to Marc. But we all walk and talk because we are People.

We can also represent this in our code, by attaching "behaviours" to classes as well as properties. These are represented by functions, or "methods". More on this later.

## Object Orientated Code

Let's have a look at this in the context of our bank account example.

To make a class, we need the "class" keyword in Ruby. This is going to be our template where we define the properties and behaviours that our bank account objects will have.

```
#bank_account.rb

``
class BankAccount

end
```

Cool, now we need to actually create a bank account.

```
#bank_account_spec.rb

class TestBankAccount < MiniTest::Test
  def test_account_name
    account = BankAccount.new
  end
end
```
Our test isn't actually doing anything, but at least there are no errors.

We can see that we create an instance of an object, a concrete implementation, using the "new" keyword after the class name. This will make a lot more sense as we add properties to our bank account.

[i:]  Make sure everyone is on par here.

## Initializing state

The bank account object we created it was pretty empty. If you remember, our bank account needs a holder name, amount and a type.

We want to pass this to the object when we create it, since these are properties every bank account needs to have. It turns out that "new" is just a special function we can use to pass initial data to our object - defining the initial state that our object has.

```
#bank_account_spec.rb

account = BankAccount.new('jay',5000, 'business')
```
If we run this, we will see an error. We have not actually told our class to expect a name, value or type so it doesn't know what to do with it. Let's go add them.

All classes have a special function called initialize that we can use to set the state of our object. This is the code that is run when we call "new" which is a little confusing! This is just the way Ruby handles initializing state, don't worry about it too much. All you need to remember is that when we use "new" it is the initialize method which is called. What we pass "new" and what we expect to get in "initialize" must match up, just like with a normal function.

```
#bank_account.rb
class BankAccount
  def initialize(input_holder_name, input_value, input_type)
  end
end
```
Cool, so now our test is passing. Note that we can replace the name, value and type of our object with anything we want. This is just one instance of a bank account.

[i:] Do a quick demo of making another bank account then delete it.

However, we are not actually doing anything with the data. It is passed to the initialize method, then is lost.

[i:] Break here

###Initialize instance variables

Okay, so we probably want to be able to access our name, value and type after we have first initialized them. The value of the bank is likely to change a lot for sure, so we definitely need to be able to get to it and update it.

We call properties of a class which are available during the entire life of an object "instance variables". As long as our bank account exists in memory, these values will be stored and remembered. This is the object's state.

This is different to the "local" variables we saw before in functions, which live as the function executes then are lost.

Instance variables are defined with an @ sign.  This is how we setup the data on an object, and it does not get lost after initialization.

```
class BankAccount
  def initialize(input_holder_name, input_value, input_type)
    @holder_name = input_holder_name
    @amount = input_value
    @type = input_type
  end
end
```
Note that the instance variable names can be the same, or different to those that are passed in from the parameters.

```
class BankAccount
  def initialize(name, value, type)
    @name = name
    @value = value
    @type = type
  end
end
```


```
#
bank_account_spec.rb
```
We now have successfully stored the data in the object. But how do we get it back out?

## Behaviour

While it's cool that we have state,  we can't easily get it from our object.  This is because in Ruby (as they should probably be in all languages).  Instance variables are private - not accesible from outside the object.

### Instance variables are private

This brings us on to defining the behaviour of our object - ways which we can interact with it.  We do this by defining methods - these are functions which are attached to an object. We can call these methods using the . notation on the object.  From now on we'll be writing all of our functions in classes, allowing them to be methods on an object. Let's see an example to allow us to access the holder name of the account.

Why is this important? Well the properties we set on our object are "private". The outside world can't access them, only our object knows about them. This is important since we might use these properties to calculate things inside of our object or do interesting things, but we don't want people to be able to change them willy nilly.

Let's try and access our name of our account.

```
#bank_account_spec.rb
class TestBankAccount < MiniTest::Test
  def test_account_name
   account = BankAccount.new('jay', 5000, 'business')
   assert_equal(account.holder_name, 'jay')
  end
end
```
When we run this, we get an error. The outside world (us) has no access to this property of the object. It's locked away and guarded.

### Getters

In order to access our properties, we need to create "getter" methods. This allows us to give people access to the properties, but they cannot update them. Let's add a getter for the name.

```
#bank_account.rb
def holder_name
    return @holder_name
end
```
Now our test will pass, since we have allowed access to our object's name.

[Task::
Write getters for the value and the type of account, with tests first.

```
#bank_account_spec.rb
 def test_account_value
   account = BankAccount.new('jay', 5000, 'business')
   assert_equal(5000,account.value)
  end

  def test_account_type
   account = BankAccount.new('jay', 5000, 'business')
   assert_equal('business',account.type)
  end
  
#bank_account.rb
  def amount
    return @amount
  end

  def type
    return @type
  end

```
## Setters

Equally, we can write methods to set the value of our properties. We call these "setters".

Let's add a setter.

```
#bank_account_spec.rb
 def test_set_account_name
    account = BankAccount.new('jay', 5000, 'business')
    account.holder_name = 'Valerie'
    assert_equal('Valerie',account.holder_name)
  end

```
If we run this, we will get a "No method" error since we have no allowed access to set the value of the name. We can read it, but we can't set it. Let's sort that.

```
#bank_account.rb
def set_name(name)
    @holder_name = name
  end
```
[Task:] Make setters for the value and type.

```
#bank_account_spec.rb
 def test_set_account_value
    account = BankAccount.new('jay', 5000, 'business')
    account.set_amount(10000)
    assert_equal(10000,account.amount)
  end


  def test_set_account_type
    account = BankAccount.new('jay', 5000, 'business')
    account.set_type('personal')
    assert_equal('personal',account.type)
  end
  
#bank_account.rb

  def set_amount(value)
    @amount = value
  end

  def set_type(type)
    @type = type
  end

```

## Getter / Setter method shortcuts

I'm sure you will agree that it is getting a bit tedious by now, adding the methods for getting and setting properties. The good news is there is a shortcut we can use - attr_accessor.

We can delete our name getters and setters, and replace them with this at the top of the file.

```
#bank-account.rb
attr_accessor :holder_name
```

We need to update our test to use just the name property for the setter.

```
#bank_account_spec.rb
def test_set_account_name
    account = BankAccount.new('jay', 5000, 'business')
    account.holder_name=('Valerie') //UPDATED
    assert_equal('Valerie',account.holder_name)
  end
```
Because we have written unit tests, we can run them and see if our code is still okay.  This is the beauty of writing tests!

[Task:] Convert the other properties to use attr_accessor. Hint - you can separate the property names with commas.

```
#bank_account_spec.rb
  def test_set_account_value
    account = BankAccount.new('jay', 5000, 'business')
    account.amount=(10000) //UPDATE
    assert_equal(10000,account.amount)
  end


  def test_set_account_type
    account = BankAccount.new('jay', 5000, 'business')
    account.type('personal') //UPDATE
    assert_equal('personal',account.type)
  end
  
#bank_account.rb
class BankAccount
  attr_accessor :name, :value, :type
  def initialize(holer_name,value,type)
    @holder_name = holder_name
    @type = type
    @value = value
  end

end
```
Isn't that much neater??

### Further Behaviour - not a setter

Let's define some further behaviour on the BankAccount, where we can update the value of the account.

```
#bank_account_spec.rb
 def test_pay_into_account
   account = BankAccount.new('jay', 5000, 'business')
   account.pay_in(1000)
   assert_equal(6000, account.amount)
  end

```
If we run this, the test will fail and say it can't find the method pay_in. Which is correct, we need to go and add this to our class.

```
#bank_account.rb
 def pay_in(value)
    @amount += value
 end
```
This is not a setter or a getter, it's not simply updating the value or retrieving the value. It's modifying it with some logic.

## Conditional state

We sometimes want instances to behave slightly differently depending on their state (instance variables). Let's make a little pay monthly method, which subtracts 50 off the value of the account.

[Task:] Make a pay_monthly_fee method, which reduces the value of the account by 50. Write the test first.

```
#bank_account_spec.rb
  def test_monthly_fee
    account = BankAccount.new('jay', 5000, 'business')
    account.pay_monthly_fee
    assert_equal(4950, account.amount)
  end
  
#bank_account.rb
 def pay_monthly_fee
    @amount -= 50
  end
```
Our bank account currently isn't very fair, since personal users pay the same fee as a business user.
Change the monthly fee method to deduct only 10 for a personal account, and 50 for a business account. You will need to update the tests.

```
#bank_account_spec.rb
  def test_monthly_fee_business
    account = BankAccount.new('jay', 5000, 'business')
    account.pay_monthly_fee
    assert_equal(4950, account.amount)
  end

  def test_monthly_fee_personal
    account = BankAccount.new('val', 5000, 'personal')
    account.pay_monthly_fee
    assert_equal(4990, account.amount)
  end
  
#bank_account
 def pay_monthly_fee
    @value -= 10 if @type == 'personal'
    @value -= 50 if @type == 'business'
  end
```
