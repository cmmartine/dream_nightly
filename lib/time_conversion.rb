# frozen_string_literal: true

module TimeConversion
  def self.from_ms(time_in_ms)
    raise StandardError, 'time_in_ms is missing' if time_in_ms.nil?

    int_time = Integer(time_in_ms)
    raise StandardError, 'time_in_ms is not a valid integer' if int_time.nil?

    Time.at(int_time / 1000)
  end
end
