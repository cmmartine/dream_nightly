# frozen_string_literal: true

class CalendarController < ApplicationController
  before_action :authenticate_user!

  def days_info
    render json: { days: generate_days_info(params[:year].to_i, params[:month].to_i, params[:user_timezone]) }
  rescue StandardError => e
    Rails.logger.error("Calendars day info failure: #{e.message}")
    render json: { message: 'Failed to retrieve calendar information' }
  end

  private

  def generate_days_info(year, month, user_timezone)
    Time.use_zone(user_timezone) do
      first_date = Date.new(year, month, 1)
      last_date = first_date.end_of_month
      dreams = current_user.dreams.where(dreamed_at: first_date.beginning_of_day..last_date.end_of_day)

      (1..last_date.day).map do |day|
        create_day_object(year, month, day, dreams)
      end
    end
  end

  def create_day_object(year, month, day, dreams)
    date = Date.new(year, month, day)
    {
      day_num: day,
      day_has_dreams: dreams.any? { |dream| dream.dreamed_at.day == day },
      day_of_week: date.wday,
      is_today: date == Date.current
    }
  end
end
