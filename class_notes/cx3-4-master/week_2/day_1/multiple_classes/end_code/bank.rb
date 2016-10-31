class Bank
  def initialize(input_accounts)
    @accounts = input_accounts
  end

  def number_of_accounts
    @accounts.length
  end

  def total_cash(type=nil)
    total = 0
    for account in @accounts
      total += account.value if(type == nil || account.type == type)
    end
    total
  end

  def average_account_value
    total_cash / number_of_accounts
  end

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

  def pay_monthly_fees
    for account in @accounts
      account.pay_monthly_fee
    end
  end
end