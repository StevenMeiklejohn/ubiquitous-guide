
Mini-Lab: 30 mins

1. Find the average bank account value

```
#bank_spec.rb
def test_average_bank_account_value
    assert_equal(3325, @bank.average_account_value)
end 

#bank.rb
def average_account_value
    total_cash / number_of_accounts
end
```
2. Find the total cash in business accounts

```
#bank_spec.rb
  def test_total_cash_business
    assert_equal(12500, @bank.total_cash('business'))
  end
  
#bank.rb
  def total_cash(type=nil)
    total = 0
    for account in @accounts
      total += account.value if(type == nil || account.type == type)
    end
    total
  end
```
3. Find the largest bank account holder name

```
#bank_spec.rb
  def test_name_of_highest_value_account_holder
    assert_equal('Kat', @bank.highest_value_account_holder_name)
  end  

#bank.rb
  def highest_value_account_holder_name
    highest_value_account_holder.name
  end
  
def highest_value_account_holder
    highest = @accounts.first
    for account in @accounts
      highest = account if account.value > highest.value
    end
    highest
  end
  
```
4. Make all accounts pay their monthly fee

```
#bank_spec.rb
 def test_pay_monthly_fees
    @bank.pay_monthly_fees
    assert_equal(13181,@bank.total_cash)
  end
  
#bank.rb
  def pay_monthly_fees
    for account in @accounts
      account.pay_monthly_fee
    end
  end
```





    
