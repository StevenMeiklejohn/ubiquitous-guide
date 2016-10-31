### Duration

1.5 hours

### Objectives
* More practice using classes.
* See classes interacting with each other

# Multiple Classes

Earlier, we saw how to make classes and create instances of objects from those classes. Now, we are going to see how we can have different classes working together.

We're going to make a Bank class that interacts with our BankAccount that we made earlier.

```
  #terminal
  touch specs/bank_spec.rb
  touch bank.rb
```

```
  #bank_spec.rb
  require_relative('../bank_account')
  require_relative('../bank')
```
We will want to be populating bank accounts to use in every test, which we are not going to change. We are just going to be reading state from the bank. Luckily, MiniTest gives us a utility method that we can use to set up an object before every test runs. It would be tedious to write this for every test. Use this carefully - it's only for when we are creating objects used across multiple tests that are not going to change state.

```
  def setup
    bank_account_1 = BankAccount.new('Jay',5000,'business')
    bank_account_2 = BankAccount.new('Rick',1,'personal')
    bank_account_3 = BankAccount.new('Kat',7500,'business')
    bank_account_4 = BankAccount.new('Val',800,'personal')

    bank_accounts = [ bank_account_1, bank_account_2, bank_account_3, bank_account_4 ]

    @bank = Bank.new( bank_accounts )
  end
```
As you can see, we now have an instance variable (we know what this is now!) that we can share across our tests. The state of this object (we also know what this is now) is reset before every test.

```
  def test_bank_account_initial_state
    
  end
```
If we run this, we should get a missing class error since we haven't made our bank. Let's create one now.

```
  #bank.rb
  class Bank
    def initialize(input_accounts)
      @accounts = input_accounts
    end
  end
```
Cool so we have a bank class, but we don't have any tests to run yet.

Let's add a method that returns the number of accounts. When we have objects that have internal collections like arrays and hashes, we don't tend to let external forces have access to the raw collection itself. Instead, we write methods that act on that data. So here, we will write a number_of_accounts method, keeping the accounts themselves private.

```
  #bank_spec.rb
def test_bank_account_initial_state
    assert_equal(4,@bank.number_of_accounts)
  end

```
Cool, this is failing. Let's go and add a method to make it pass.

```
  #bank.rb
  class Bank
    def initialize(input_accounts)
      @accounts = input_accounts
    end

    def number_of_accounts
      @accounts.length
    end
  end
```
Awesome.

[Task:] Add a method that returns the total cash in accounts.

```
#bank_spec.rb
def test_total_cash_in_accounts
    assert_equal(13301,@bank.total_cash)
end
  
#bank.rb
def total_cash
  total = 0
  for account in @accounts
    total += account.value
  end
  return total
 end
```
