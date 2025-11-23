# frozen_string_literal: true

require 'rails_helper'

RSpec.describe TimeConversion do
  include TimeConversion

  describe 'self.from_ms' do
    let(:time_ms) { Time.new(2025, 1, 1).to_i * 1000 }
    let(:string_time_ms) { (Time.new(2025, 1, 1).to_i * 1000).to_s }
    let(:expected_time) { Time.new(2025, 1, 1) }

    it 'converts the given time correctly' do
      expect(TimeConversion.from_ms(time_ms)).to eq(expected_time)
    end

    it 'converts the given time correctly if a string number is passed in' do
      expect(TimeConversion.from_ms(string_time_ms)).to eq(expected_time)
    end

    it 'raises if time_in_ms is not passed in' do
      expect { TimeConversion.from_ms(nil) }.to raise_error(StandardError)
    end

    it 'raises if time_in_ms cannot be converted to an int' do
      expect { TimeConversion.from_ms('not an int') }.to raise_error(StandardError)
    end
  end
end
