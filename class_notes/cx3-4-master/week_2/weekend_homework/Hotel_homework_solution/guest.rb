class Guest

  attr_accessor :name, :funds

  def initialize(name, funds)
    @name = name
    @funds = funds
  end

  def deduct_funds(cost)
    @funds = @funds - cost
  end

end