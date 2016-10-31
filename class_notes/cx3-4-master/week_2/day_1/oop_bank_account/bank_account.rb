class BankAccount

  attr_accessor :holder_name, :amount, :type

  def initialize(holder_name, amount, type)
    @holder_name = holder_name
    @amount = amount
    @type = type
  end

  def pay_in(amount)
    @amount += amount
  end

  def pay_monthly_fee
    @amount -= 50 if @type == 'personal'
    @amount -= 100 if @type == 'business'
  end


end