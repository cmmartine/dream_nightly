# frozen_string_literal: true

class Dream < ApplicationRecord
  belongs_to :user
  validates :body, presence: true

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
      {
        id: dream.id,
        body: dream.body,
        ai_interpretation: dream.ai_interpretation,
        lucid: dream.lucid,
        created_at: dream.created_at_in_ms
      }
    end
  end

  def self.find_owned_by(user, dream_id)
    user.dreams.find_by(id: dream_id)
  end

  def created_at_in_ms
    created_at.to_i * 1000
  end
end
