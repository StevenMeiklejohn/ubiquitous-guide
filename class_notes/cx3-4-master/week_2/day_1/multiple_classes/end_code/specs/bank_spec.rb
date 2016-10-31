require('minitest/autorun')
require_relative('../bank')
require_relative('../bank_account')

class TestBank < MiniTest::Test

  def setup
    bank_account_1 = BankAccount.new('Jay',5000,'business')
    bank_account_2 = BankAccount.new('Rick',1,'personal')
    bank_account_3 = BankAccount.new('Kat',7500,'business')
    bank_account_4 = BankAccount.new('Val',800,'personal')

    bank_accounts = [ bank_account_1, bank_account_2, bank_account_3, bank_account_4 ]

    @bank = Bank.new( bank_accounts )
  end

  def test_bank_account_initial_state
    assert_equal(4,@bank.number_of_accounts)
  end

  def test_total_cash_in_accounts
    assert_equal(13301,@bank.total_cash)
  end

  def test_average_bank_account_value
    assert_equal(3325, @bank.average_account_value)
  end

  def test_total_cash_business
    assert_equal(12500, @bank.total_cash('business'))
  end

  def test_name_of_highest_value_account_holder
    assert_equal('Kat', @bank.highest_value_account_holder_name)
  end 

  def test_pay_monthly_fees
    @bank.pay_monthly_fees
    assert_equal(13181,@bank.total_cash)
  end 
end