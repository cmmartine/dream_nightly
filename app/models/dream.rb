# frozen_string_literal: true

class Dream < ApplicationRecord
  belongs_to :user
  validates :body, presence: true

  def self.from_date(date_time)
    where('created_at BETWEEN ? AND ?', date_time.beginning_of_day, date_time.end_of_day).order('id DESC')
  end

  def self.filtered_from_date(date_time)
    from_date(date_time).map do |dream|
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
