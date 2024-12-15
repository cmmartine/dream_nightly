class UsersController < ApplicationController
  def status
    if current_user
      render json: true
    else
      render json: false
    end
  end
end
