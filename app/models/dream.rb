# frozen_string_literal: true

class Dream < ApplicationRecord
  belongs_to :user
  validates :body, presence: true, length: { in: 1..Constants::MAX_COUNTS['DREAM_CHARS'] }

  def self.from_date(date_time, user_timezone)
    Time.use_zone(user_timezone) do
      target_date = Time.zone.parse(date_time.to_s)
      start_of_day = target_date.beginning_of_day
      end_of_day = target_date.end_of_day

      where('created_at BETWEEN ? AND ?', start_of_day, end_of_day).order(created_at: :desc)
    end
  end

  def self.filtered_from_date(date_time, user_timezone)
    from_date(date_time, user_timezone).map do |dream|
      filtered_dream_object(dream)
    end
  end

  def self.filtered_dream_object(dream)
    {
      id: dream.id,
      body: dream.body,
      ai_interpretation: dream.ai_interpretation,
      lucid: dream.lucid,
      created_at: dream.created_at_in_ms
    }
  end

  def self.find_owned_by(user, dream_id)
    user.dreams.find_by(id: dream_id)
  end

  def created_at_in_ms
    created_at.to_i * 1000
  end

  def self.valid_range?(time_in_ms, user_timezone)
    return false unless user_timezone && time_in_ms

    converted_date_time = time_in_ms / 1000

    Time.use_zone(user_timezone) do
      invalid_before_date = Time.new(Constants::NONVALID_DREAM_DATE['BEFORE_YEAR']).end_of_year.to_i
      invalid_after_date = (Time.now + 1.day).beginning_of_day.to_i
      converted_date_time > invalid_before_date && converted_date_time <= invalid_after_date
    end
  end
end
