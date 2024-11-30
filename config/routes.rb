# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users
  get 'users/status'
  post 'dreams/create'
  post 'dreams/update'
  post 'dreams/destroy'
  post 'dreams/from_date'

  root 'main#index'
  get '/*path' => 'main#index'
end
