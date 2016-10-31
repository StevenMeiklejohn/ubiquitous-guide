class AccountsController < ApplicationController

  def index
    authenticate_user!()
    accounts = Account.where(user_id: current_user.id)
    # accounts = [ 
    #   { name: 'offshore', amount:1000000.00 },
    #   { name: 'local', amount: 0.01 }
    # ]
    render json: accounts
  end


end