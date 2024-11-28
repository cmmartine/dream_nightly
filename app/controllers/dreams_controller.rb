class DreamsController < ApplicationController
  before_action :authenticate_user!

  INVALID_DREAM = {
    empty_body: 'Dream cannot be empty',
    general: 'Dream not saved, please try again'
  }.freeze

  def create
    dream = Dream.new(body: dream_params[:body], user_id: current_user.id)
    if !dream.valid?
      flash[:alert] = dream.body.empty? ? INVALID_DREAM[:empty_body] : INVALID_DREAM[:general]
    else
      dream.save!
    end
  end

  def update
    dream = Dream.find(dream_params[:dream_id])
    dream.update(body: dream_params[:body])
    if !dream.valid?
      flash[:alert] = dream.body.empty? ? INVALID_DREAM[:empty_body] : INVALID_DREAM[:general]
    else
      dream.save!
    end
  end

  def destroy
  end

  def from_date
  end

  private

  def dream_params
    params.require(:dream).permit(:body, :dream_id)
  end
end
