# frozen_string_literal: true

class Dream < ApplicationRecord
  belongs_to :user
  validates :body, presence: true

  def self.from_date(date_time)
    where('created_at BETWEEN ? AND ?', date_time.beginning_of_day, date_time.end_of_day)
  end

  def self.filtered_from_date(date_time)
    from_date(date_time).map do |dream|
      {
        body: dream.body,
        ai_interpretation: dream.ai_interpretation,
        lucid: dream.lucid,
        created_at: dream.created_at.to_i # convert to ms for frontend
      }
    end
  end
end
