# frozen_string_literal: true

class DreamsController < ApplicationController
  before_action :authenticate_user!

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def create
    time_in_ms = dream_params[:time_in_ms]
    date_time = convert_from_time_in_ms(time_in_ms)
    user_timezone = dream_params[:user_timezone]

    if Dream.valid_range?(time_in_ms, user_timezone) &&
       Dream.from_date(date_time, user_timezone).length < Constants::MAX_COUNTS['DREAMS_IN_A_DAY']

      date_time = convert_from_time_in_ms(time_in_ms)

      dream = Dream.new(body: dream_params[:body], created_at: date_time, user_id: current_user.id)
      if !dream.valid?
        render json: { status: 'unprocessable' }, status: :unprocessable_entity
      else
        dream.save!
        filtered_dream = Dream.filtered_dream_object(dream)
        render json: { status: 'created', dream: filtered_dream }, status: :created
      end
    else
      render json: {
        error: 'Only 10 dreams can be created per day, and dreams cannot be created before 2010 or beyond today'
      }, status: :forbidden
    end
  rescue StandardError => e
    Rails.logger.error "Dream creation failed: #{e.message}"
    render json: { message: 'Dream creation failed' }, status: :unprocessable_entity
  end

  def update
    dream = Dream.find_owned_by(current_user, dream_params[:dream_id])

    if dream.nil?
      render json: { message: 'Dream not found or not authorized' }, status: :forbidden
      return
    end

    dream.update(body: dream_params[:body])
    raise unless dream.valid?

    dream.save!
    render json: { status: 'ok' }, status: :ok
  rescue StandardError => e
    Rails.logger.error "Dream updating failed: #{e.message}"
    render json: { message: 'Dream updating failed' }, status: :unprocessable_entity
  end

  def destroy
    dream = Dream.find_owned_by(current_user, dream_params[:dream_id])

    if dream.nil?
      render json: { message: 'Dream not found or not authorized' }, status: :forbidden
      return
    end

    dream.destroy
    raise unless dream.destroyed?

    render json: { status: 'ok' }, status: :ok
  rescue StandardError => e
    Rails.logger.error "Dream destruction failed: #{e.message}"
    render json: { message: 'Dream deletion failed' }, status: :unprocessable_entity
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

  def from_date
    date_time = convert_from_time_in_ms(dream_params[:time_in_ms])
    filtered_dreams = current_user.dreams.filtered_from_date(date_time, dream_params[:user_timezone])
    render json: filtered_dreams
  rescue StandardError => e
    Rails.logger.error "Dream filtering failed: #{e.message}"
    render json: { message: 'Failed to retrieve dreams' }, status: :unprocessable_entity
  end

  private

  def dream_params
    params.require(:dream).permit(:body, :dream_id, :time_in_ms, :user_timezone)
  end

  def convert_from_time_in_ms(time)
    raise StandardError, 'time_in_ms is missing' if time.nil?

    int_time = Integer(time)
    raise StandardError, 'time_in_ms is not a valid integer' if int_time.nil?

    Time.at(int_time / 1000)
  end
end
