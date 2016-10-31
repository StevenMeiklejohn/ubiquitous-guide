require ('pry-byebug')

ACCOUNTS = [
  {
    holder_name: "Jay",
    amount: 55,
    type: "business"
  },
  {
    holder_name: "Rick",
    amount: 1,
    type: "personal"
  },
  {
    holder_name: "Keith",
    amount: 500,
    type: "business"
  },
  {
    holder_name: "Valerie",
    amount: 100,
    type: "personal"
  },
  {
    holder_name: "Michael",
    amount: 5,
    type: "personal"
  },
  {
    holder_name: "Kate",
    amount: 2000,
    type: "business"
  },
  {
    holder_name: "Tony",
    amount: 150,
    type: "personal"
  },
  {
    holder_name: "Sandy",
    amount: 4500,
    type: "business"
  }
]

# def number_of_bank_accounts()
def number_of_bank_accounts()
return ACCOUNTS.length
end


# def first_bank_account_holder()
def first_bank_account_holder()
  ACCOUNTS[0][:holder_name]
end



# def bank_account_owner_names()
def bank_account_owner_names()
  names_array=[]
  for person in ACCOUNTS
      names_array.push( person[:holder_name])
  end
    return names_array
end

# def total cash in bank()

def total_cash_in_bank()
total = 0
for accounts in ACCOUNTS
  total += accounts[:amount]
end
return total
end

# def average account value

def average_bank_account_value()
  avg_val = 0
  for accounts in ACCOUNTS
    avg_val += accounts[:amount]
  end
  return (avg_val/ACCOUNTS.length)
end

# or
# def average_bank_account_value()
#   average = total_cash_in_bank/number_of_bank_accounts
#   return average
# end




# Return the account holder with the largest balance

def largest_value_account_holder
result = {}
for hash in ACCOUNTS
result[hash[:amount]] = hash[:holder_name]
end
return result.fetch(result.keys.max)
end

#find the largest personal bank account holder. Think about how you might
# reuse code you have already written.
def name_of_largest_personal_account_holder()
  total = []
  people = []

  for x in ACCOUNTS
    if x[:type] == 'personal'
      total<<[:amount]
      people<<[:holder_name]
    end
  return people[total.index(total.max)]
  end




# def total_cash_in_business_accounts()
#   cash = 0
#   for x in ACCOUNTS
#     cash+= x[:amount] if x[type] == 'business'
#   end
#   return cash

# end
end















