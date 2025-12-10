# frozen_string_literal: true

require 'rails_helper'

RSpec.describe MonthSerializer do
  include ActiveSupport::Testing::TimeHelpers
  let(:dreams) { [FactoryBot.build(:dream)] }
  let(:current_year) { 2025 }
  let(:next_year) { 2026 }
  let(:current_month) { 9 }
  let(:next_month) { 10 }
  let(:prev_month) { 8 }

  describe '#as_json' do
    it 'returns the correct data when the month has a dream, and is the current day' do
      travel_to Date.new(2025, 9, 29).end_of_day do
        json = MonthSerializer.new(current_year, current_month, dreams).as_json

        expect(json[:num]).to eq(8)
        expect(json[:has_dreams]).to eq(true)
        expect(json[:is_current]).to eq(true)
        expect(json[:short_name]).to eq('Sep')
        expect(json[:is_in_future]).to eq(false)
      end
    end

    it 'returns the correct data when the month has no dreams, and the month is in the future of this year' do
      travel_to Date.new(2025, 9, 29).end_of_day do
        json = MonthSerializer.new(current_year, next_month, []).as_json

        expect(json[:num]).to eq(9)
        expect(json[:has_dreams]).to eq(false)
        expect(json[:is_current]).to eq(false)
        expect(json[:short_name]).to eq('Oct')
        expect(json[:is_in_future]).to eq(true)
      end
    end

    it 'returns the correct data when the year is greater than the current year' do
      travel_to Date.new(2025, 9, 29).end_of_day do
        json = MonthSerializer.new(next_year, next_month, []).as_json

        expect(json[:is_current]).to eq(false)
        expect(json[:is_in_future]).to eq(true)
      end
    end

    it 'returns the correct data when the month is in the past' do
      travel_to Date.new(2025, 9, 29).end_of_day do
        json = MonthSerializer.new(current_year, prev_month, []).as_json

        expect(json[:is_current]).to eq(false)
        expect(json[:is_in_future]).to eq(false)
      end
    end
  end
end
