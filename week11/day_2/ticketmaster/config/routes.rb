Rails.application.routes.draw do

  resources( :artists ) do
    resources( :gigs )
  end
 
end