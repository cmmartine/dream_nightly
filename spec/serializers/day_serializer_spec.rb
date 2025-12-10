# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DaySerializer do
  include ActiveSupport::Testing::TimeHelpers

  let(:dream) { [FactoryBot.build(:dream, :one_day_ago)] }
  let(:year) { 2025 }
  let(:month) { 9 }
  let(:current_day) { 29 }
  let(:future_day) { 30 }
  let(:past_day) { 28 }
  let(:date) { Date.new(year, month, current_day) }

  # rubocop:disable Metrics/BlockLength
  describe '#as_json' do
    it 'returns correct data when the day has dreams and is today' do
      travel_to date do
        json = described_class.new(year, month, current_day, dream).as_json

        expect(json[:num]).to eq(current_day)
        expect(json[:has_dreams]).to eq(true)
        expect(json[:day_of_week]).to eq(date.wday)
        expect(json[:is_today]).to eq(true)
        expect(json[:is_in_future]).to eq(false)
      end
    end

    it 'returns correct data when the day has no dreams and is in the future' do
      travel_to date do
        json = described_class.new(year, month, future_day, []).as_json

        expect(json[:num]).to eq(future_day)
        expect(json[:has_dreams]).to eq(false)
        expect(json[:day_of_week]).to eq(date.wday + 1)
        expect(json[:is_today]).to eq(false)
        expect(json[:is_in_future]).to eq(true)
      end
    end

    it 'returns correct data when the day is in the past' do
      travel_to date do
        json = described_class.new(year, month, past_day, []).as_json

        expect(json[:is_today]).to eq(false)
        expect(json[:is_in_future]).to eq(false)
      end
    end
  end
  # rubocop:enable Metrics/BlockLength
end
