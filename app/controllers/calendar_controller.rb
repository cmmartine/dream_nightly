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
        create_day_object(year, month, day, dreams_in_range)
      end
    end
  end

  def create_day_object(year, month, day, dreams_in_range)
    date = Date.new(year, month, day)
    {
      num: day,
      has_dreams: dreams_in_range.any? { |dream| dream.dreamed_at.day == day },
      day_of_week: date.wday,
      is_today: date == Date.current,
      is_in_future: date >= Date.current + 1
    }
  end

  def generate_months_info(year, user_timezone, users_dreams)
    Time.use_zone(user_timezone) do
      (1..12).map do |month|
        first_date = Date.new(year, month, 1)
        last_date = first_date.end_of_month
        dreams_in_range = users_dreams.where(dreamed_at: first_date.beginning_of_day..last_date.end_of_day)
        create_month_object(year, month, dreams_in_range)
      end
    end
  end

  def create_month_object(year, month, dreams_in_range)
    date = Date.new(year, month)
    current_date = Date.current
    {
      num: month - 1,
      has_dreams: dreams_in_range.any?,
      is_current: date.month == current_date.month && date.year == current_date.year,
      short_name: date.strftime('%b'),
      is_in_future: date.year >= current_date.year && date.month > current_date.month
    }
  end
end
