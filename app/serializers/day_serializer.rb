# frozen_string_literal: true

class DaySerializer
  def initialize(year, month, day, days_dreams)
    @day = day
    @date = Date.new(year, month, day)
    @current_date = Date.current
    @dreams = days_dreams
  end

  def as_json
    {
      num: num,
      has_dreams: dreams?,
      day_of_week: day_of_week,
      is_today: today?,
      is_in_future: in_future?
    }
  end

  private

  def num
    @date.day
  end

  def dreams?
    @dreams.any? { |dream| dream.dreamed_at.day == @day }
  end

  def day_of_week
    @date.wday
  end

  def today?
    @date == @current_date
  end

  def in_future?
    @date >= @current_date + 1
  end
end
