require('minitest/autorun')
require_relative('../bank_account')
require_relative('../bank')

class TestBank < MiniTest::Test

#instead of creating "account = BankAccount.new('jay', 5000, 'business')" for ever test, MiniTest lets us use ....

def setup
  bank_account1 = BankAccount.new( 'Jay', 5000, 'business' )
  bank_account2 = BankAccount.new( 'Rick', 1, 'business' )
  bank_account3 = BankAccount.new( 'Val', 800, 'business' )

  bank_accounts = [bank_account1, bank_account2, bank_account3]

  @bank = Bank.new(bank_accounts)
end

def test_bank_account_initial_state
puts @bank.inspect
assert_equal( 3, @bank.number_of_accounts)
end

def test_total_cash_in_bank
  assert_equal(5801, @bank.total_cash_in_bank)
end

def test_average_account_value
  assert_equal(1933, @bank.average_account_value)
end


def test_total_cash_in_business_accounts
  assert_equal(5801, @bank.total_cash_in_business_accounts)
  end

def test_largest_account_holder_name
  assert_equal("Jay", @bank.largest_account_holder_name)
end

def test_pay_monthly_fees
#check total cash in the bank to deduce if monthly fees have been applied.
@bank.pay_monthly_fees
assert_equal(13181, @bank.pay_monthly_fees)
end








end
