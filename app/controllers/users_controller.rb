class UsersController < ApplicationController
  def status
    if current_user
      render json: { status: true }
    else
      render json: { status: false }
    end
  end
end
