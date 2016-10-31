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
    holder_name: "Beth",
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
  },
]

def number_of_bank_accounts()
  return ACCOUNTS.length
end

def first_bank_account_holder()
  return ACCOUNTS.first[:holder_name]
end

def bank_account_owner_names()
  names = []
  for account in ACCOUNTS
    names << account[:holder_name]
  end
  return names
end

def filter_accounts_by_type(type)
  filtered_accounts = []
  for account in ACCOUNTS
    filtered_accounts.push(account) if account[:type] == type
  end
  return filtered_accounts
end

def total_cash_in_bank(type=nil)
  if type
    filtered_accounts = filter_accounts_by_type(type)
  else
    filtered_accounts = ACCOUNTS
  end
  sum = 0
  for account in filtered_accounts
    sum += account[:amount]
  end
  return sum
end

def average_bank_account_value()
  return total_cash_in_bank() / number_of_bank_accounts()
end

def largest_bank_account_holder(type = nil)
  return largest_bank_account(type)[:holder_name]
end

def largest_bank_account(type = nil)
  if type
    filtered_accounts = filter_accounts_by_type(type)
  else
    filtered_accounts = ACCOUNTS
  end
  largest_account = filtered_accounts.first
  for account in filtered_accounts
    largest_account = account if account[:amount] > largest_account[:amount]
  end
  return largest_account
end
