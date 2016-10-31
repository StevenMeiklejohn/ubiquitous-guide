require('minitest/autorun')
require('minitest/rg')
require_relative('../bank_account.rb')

# Test getters.

class TestBankAccount < MiniTest::Test
  def test_account_name
    jay_account = BankAccount.new('Jay', 5000, 'business')
    assert_equal("Jay", jay_account.holder_name)
  end

  def test_type
    jay_account = BankAccount.new('Jay', 5000, 'business')
    assert_equal("business", jay_account.type)
  end

  def test_amount
    jay_account = BankAccount.new('Jay', 5000, 'business')
    assert_equal( 5000, jay_account.amount)
  end

  #test "setters"

  def test_set_name()
    jay_account = BankAccount.new('Jay', 5000, 'business')
    jay_account.holder_name=("Valerie")
    assert_equal("Valerie", jay_account.holder_name)
  end

  def test_set_value()
    jay_account = BankAccount.new('Jay', 5000, 'business')
    jay_account.amount=(10000)
    assert_equal(10000, jay_account.amount)
  end

  def test_set_type()
    jay_account = BankAccount.new('Jay', 5000, 'business')
    jay_account.type=("personal")
    assert_equal("personal", jay_account.type)
  end

  def test_pay_into_account
    jay_account = BankAccount.new("Jay", 5000, "business")
    jay_account.pay_in(1000)
    assert_equal(6000, jay_account.amount)
  end

  def test_pay_monthly_fee
    jay_account = BankAccount.new("Jay", 5000, "business")
    rik_account = BankAccount.new("Rik", 5000, "personal")
    jay_account.pay_monthly_fee
    rik_account.pay_monthly_fee
    assert_equal(4900, jay_account.amount)
    assert_equal(4950, rik_account.amount)
  end







end
