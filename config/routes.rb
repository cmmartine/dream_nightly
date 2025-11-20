# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users
  get 'users/status'
  get '/users', to: redirect('/users/sign_up')

  namespace :dreams do
    post 'create'
    post 'update'
    post 'destroy'
    get 'from_date'
    get 'search'
  end
  get 'calendar/info'

  root 'main#index'
  get '/*path' => 'main#index'
end
