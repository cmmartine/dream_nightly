# frozen_string_literal: true

class MonthSerializer
  def initialize(year, month, months_dreams)
    @month = month
    @date = Date.new(year, month)
    @current_date = Date.current
    @dreams = months_dreams
  end

  def as_json
    {
      num: num,
      has_dreams: dreams?,
      is_current: current?,
      short_name: short_name,
      is_in_future: in_future?
    }
  end

  private

  def num
    @month - 1
  end

  def dreams?
    @dreams.any?
  end

  def current?
    @date.month == @current_date.month && @date.year == @current_date.year
  end

  def short_name
    @date.strftime('%b')
  end

  def in_future?
    (@date.year == @current_date.year && @date.month > @current_date.month) || (@date.year > @current_date.year)
  end
end
