# frozen_string_literal: true

class DreamsController < ApplicationController
  before_action :authenticate_user!

  DREAM_DESTROYED = {
    success: 'Dream was successfully deleted',
    failed: 'Dream could not be deleted, please try again'
  }.freeze

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def create
    date_time = convert_from_time_in_ms(dream_params[:time_in_ms])
    dream = Dream.new(body: dream_params[:body], created_at: date_time, user_id: current_user.id)
    if !dream.valid?
      render json: { status: 'unprocessable' }, status: :unprocessable_entity
    else
      dream.save!
      render json: { status: 'created' }, status: :created
    end
  rescue StandardError => e
    Rails.logger.error "Dream creation failed: #{e.message}"
    render json: { status: 'unprocessable', message: e.message }, status: :unprocessable_entity
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

  def update
    dream = Dream.find(dream_params[:dream_id])
    dream.update(body: dream_params[:body])
    if !dream.valid?
      Rails.logger.error "Dream updating failed for ID #{dream.id}"
      render json: { status: 'unprocessable' }, status: :unprocessable_entity
    else
      dream.save!
      render json: { status: 'ok' }, status: :ok
    end
  end

  def destroy
    dream = Dream.find(dream_params[:dream_id])
    dream.destroy
    if dream.destroyed?
      render json: { status: 'ok', message: DREAM_DESTROYED[:success] }, status: :ok
    else
      Rails.logger.error "Dream destruction failed for ID #{dream.id}"
      render json: { status: 'unprocessable', message: DREAM_DESTROYED[:failed] }, status: :unprocessable_entity
    end
  end

  def from_date
    date_time = convert_from_time_in_ms(dream_params[:time_in_ms])
    filtered_dreams = current_user.dreams.filtered_from_date(date_time)
    render json: filtered_dreams
  rescue StandardError => e
    Rails.logger.error "Dream filtering failed: #{e.message}"
    render json: { error: 'Failed to filter dreams', message: e.message }, status: :unprocessable_entity
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
