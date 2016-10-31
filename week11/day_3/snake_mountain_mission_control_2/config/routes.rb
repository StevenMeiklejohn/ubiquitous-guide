Rails.application.routes.draw do

  devise_for :users
  root "missions#index"
  resources :missions, defaults: {format: :json}
end

