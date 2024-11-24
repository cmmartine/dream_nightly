class DreamsController < ApplicationController
  before_action :authenticate_user!

  INVALID_DREAM = {
    empty_body: 'Dream cannot be empty',
    general: 'Dream not saved, please try again'
  }.freeze

  def create
    dream = Dream.new(body: dream_params[:body], date: Time.now, user_id: current_user.id)
    if !dream.valid?
      flash[:alert] = dream.body.empty? ? INVALID_DREAM[:empty_body] : INVALID_DREAM[:general]
    else
      dream.save!
    end
  end

  def update
  end

  def destroy
  end

  def from_date
  end

  private

  def dream_params
    params.require(:dream).permit(:body)
  end
end
