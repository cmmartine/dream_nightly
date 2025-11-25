class UsersController < ApplicationController
  def status
    if current_user
      render json: { logged_in: true, token: form_authenticity_token }
    else
      render json: { logged_in: false, token: nil }
    end
  end
end
