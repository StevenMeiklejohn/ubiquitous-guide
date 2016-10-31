require_relative('bank_account_functions')
require('minitest/autorun')

class Functions_Practice < MiniTest::Test

  # Return total number of accounts
  def test_total_number_of_accounts
    bank_accounts_count = number_of_bank_accounts()
    assert_equal(8,bank_accounts_count)
  end

#   # Return first account holder
  def test_first_account_holder
    first_account = first_bank_account_holder()
    assert_equal("Jay", first_account)
  end

  # Create a collection of all account holder names
  def test_bank_holder_names
    account_names = bank_account_owner_names()
    expected = ["Jay","Rick","Keith","Valerie","Michael","Kate","Tony","Sandy"]
    assert_equal(expected, account_names)
  end

  # Add together all account totals
  def test_total_cash_in_bank
    total_cash = total_cash_in_bank()
    assert_equal(7311, total_cash)
  end

  # Return the average account value
  def test_average_bank_account_value
    average_value = average_bank_account_value()
    assert_equal(913,average_value)
  end

  # Return the account holder with the larget balance
  def test_name_of_largest_value_account_holder
    largest_value = largest_value_account_holder()
    assert_equal('Sandy',largest_value_account_holder)
  end

  #find the largest personal bank account holder. Think about how you might
  # reuse code you have already written.
  def test_name_of_largest_personal_account_holder
    largest_personal_account_holder = name_of_largest_personal_account_holder()
    assert_equal('Tony',largest_personal_account_holder)
  end



#   #find the total cash in business accounts. Again,t hink about how you might



# def test_total_cash_in_business_accounts
#   value = total_cash_in_business_accounts()
#     assert_equal(7055, value)
# end

    
end
