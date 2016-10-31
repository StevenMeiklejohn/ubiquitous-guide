# ACCOUNTS = [
# {holder_name: "Jay", amount: 500, type: "business"}
# ]

# def get_account_name()
#   return ACCOUNTS[0][:holder_name]
# end

# This function is not dynamic, it is tied to specific data.
#=> create class BankAccount and using the spec file create a new account.

class BankAccount

  attr_accessor :holder_name, :amount, :type

  def initialize(holder_name, amount, type)
    # "initialize" corresponds to the .new command in the spec file.
    #"jay_account = BankAccount.new('Jay', 5000, 'business')"
    @holder_name=holder_name
    @amount = amount
    @type = type
  end



#custom
  def pay_in (amount)
    @amount += amount
  end
  ######

  def pay_monthly_fee ()
    @amount -= 50 if @type=="personal"
    @amount -=100 if @type=="business"
  end




end


# #these are 'getters'
#   def holder_name
#     return @holder_name
#   end

#   def type
#     return @type
#   end

#   def amount
#     return @amount
#   end


# # These are setters.

#   def set_holder_name(name)
#   @holder_name=name
#   end

#   def set_value (num)
#   @amount=num
#   end

#   def set_type (type)
#     @type=type
#   end

# writinbg these methods for a class with lots of variables could get tedious. So if we take them out, there is a shortcut.(Above commented out)
#attr_accessor :holder_name, :amount, :type

#when usin the attr_accessor, the test differs slightly. 
# Instead of saying;
# jay_account.holder_name("Valerie")
# we say;
# jay_account.holder_name=("Valerie")




