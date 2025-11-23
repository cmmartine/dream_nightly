# frozen_string_literal: true

class Dream < ApplicationRecord
  include PgSearch::Model

  before_save :update_search_body_vector

  belongs_to :user
  validates :body, presence: true, length: { in: 1..Constants::MAX_COUNTS['DREAM_CHARS'] }

  pg_search_scope :search_by_body,
                  using: {
                    tsearch: {
                      tsvector_column: 'search_body_vector',
                      dictionary: 'english',
                      prefix: true,
                      any_word: true
                    }
                  }

  def self.from_date(date_time, user_timezone)
    Time.use_zone(user_timezone) do
      target_date = Time.zone.parse(date_time.to_s)
      start_of_day = target_date.beginning_of_day
      end_of_day = target_date.end_of_day

      where('dreamed_at BETWEEN ? AND ?', start_of_day, end_of_day).order(dreamed_at: :desc)
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
      dreamed_at: dream.dreamed_at_in_ms
    }
  end

  def self.find_owned_by(user, dream_id)
    user.dreams.find_by(id: dream_id)
  end

  def dreamed_at_in_ms
    dreamed_at.to_i * 1000
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

  private

  def update_search_body_vector
    quoted_body = ActiveRecord::Base.connection.quote(body.to_s)
    sql = "SELECT to_tsvector('english', #{quoted_body})"
    result = ActiveRecord::Base.connection.execute(sql)
    self.search_body_vector = result.first['to_tsvector']
  end
end
