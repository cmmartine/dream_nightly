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
    date_time = convert_from_time_in_ms(dream_params[:time_in_ms])
    dream = Dream.new(body: dream_params[:body], created_at: date_time, user_id: current_user.id)
    if !dream.valid?
      flash[:alert] = dream.body.empty? ? INVALID_DREAM[:empty_body] : INVALID_DREAM[:general]
      render json: { status: 'unprocessable' }, status: :unprocessable_entity
    else
      dream.save!
      render json: { status: 'created' }, status: :created
    end
  rescue StandardError => e
    Rails.logger.error "Dream creation failed: #{e.message}"
    flash[:alert] = INVALID_DREAM[:general]
    head :unprocessable_entity
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
    raise StandardError, 'time_in_ms is missing' if time.nil?

    int_time = Integer(time)
    raise StandardError, 'time_in_ms is not a valid integer' if int_time.nil?

    Time.at(int_time / 1000)
  end
end
