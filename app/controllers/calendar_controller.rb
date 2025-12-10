# frozen_string_literal: true

class CalendarController < ApplicationController
  before_action :authenticate_user!

  def info
    year = params[:year].to_i
    month = params[:month].to_i
    user_timezone = params[:user_timezone]
    users_dreams = current_user.dreams_from_year(year)

    render json: {
      days: generate_days_info(year, month, user_timezone, users_dreams),
      months: generate_months_info(year, user_timezone, users_dreams)
    }
  rescue StandardError => e
    Rails.logger.error("Calendars day info failure: #{e.message}")
    render json: { message: 'Failed to retrieve calendar day information' }
  end

  private

  def generate_days_info(year, month, user_timezone, users_dreams)
    Time.use_zone(user_timezone) do
      first_date = Date.new(year, month, 1)
      last_date = first_date.end_of_month
      dreams_in_range = users_dreams.where(dreamed_at: first_date.beginning_of_day..last_date.end_of_day)

      (1..last_date.day).map do |day|
        date = Date.new(year, month, day)
        days_dreams = dreams_in_range.where(dreamed_at: date.beginning_of_day..date.end_of_day)
        DaySerializer.new(year, month, day, days_dreams).as_json
      end
    end
  end

  def generate_months_info(year, user_timezone, users_dreams)
    Time.use_zone(user_timezone) do
      (1..12).map do |month|
        first_date = Date.new(year, month, 1)
        last_date = first_date.end_of_month
        dreams_in_range = users_dreams.where(dreamed_at: first_date.beginning_of_day..last_date.end_of_day).to_a
        MonthSerializer.new(year, month, dreams_in_range).as_json
      end
    end
  end
end
