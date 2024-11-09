Rails.application.routes.draw do
  devise_for :users
  get 'users/status'

  root 'main#index'
  get '/*path' => 'main#index'
end
