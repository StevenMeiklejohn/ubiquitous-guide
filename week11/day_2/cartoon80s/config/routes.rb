Rails.application.routes.draw do
  resources :shows do
    resources :characters
  end
end
