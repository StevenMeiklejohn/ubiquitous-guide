Rails.application.routes.draw do

  scope path: "api" do
  resources :comments
  end
  
end
