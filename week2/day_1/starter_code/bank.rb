class Bank

  def initialize( bank_accounts )
    @accounts = bank_accounts
  end

  def number_of_accounts
    return @accounts.count
  end

  def total_cash_in_bank
    total=0
    for account in @accounts
   total += account.value
    end
  return total
end

def average_account_value
  average_value = total_cash_in_bank/number_of_accounts
return average_value
end

def total_cash_in_business_accounts
      total=0
  for account in @accounts
     total += account.value if account.type='business'  
   end
    return total
  end

def largest_account_holder_name
biggest_account= @accounts.first
for account in @accounts
  if account.value > biggest_account.value 
    biggest_account = account
  end
return biggest_account.name
end


def monthly_fee_on_all_accounts
  for account in @accounts
   accounts.value -= 10 if accounts.type == 'personal'
   accounts.value -= 50 if accounts.type == 'business'
  end
end





