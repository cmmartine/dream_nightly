# frozen_string_literal: true

class DreamsController < ApplicationController
  before_action :authenticate_user!

  INVALID_DREAM = {
    empty_body: 'Dream cannot be empty',
    general: 'Dream not saved, please try again'
  }.freeze

  DREAM_DESTROYED = {
    success: 'Dream was successfully deleted',
    failed: 'Dream could not be deleted, please try again'
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
    dream = Dream.find(dream_params[:dream_id])
    dream.destroy
    flash[:notice] = dream.destroyed? ? DREAM_DESTROYED[:success] : DREAM_DESTROYED[:failed]
  end

  def from_date
    date_time = convert_from_time_in_ms(dream_params[:time_in_ms])
    filtered_dreams = current_user.dreams.filtered_from_date(date_time)
    render json: filtered_dreams
  end

  private

  def dream_params
    params.require(:dream).permit(:body, :dream_id, :time_in_ms)
  end

  def convert_from_time_in_ms(time)
    Time.at(time / 1000)
  end
end
