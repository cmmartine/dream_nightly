# frozen-string-literal: true

require 'rails_helper'

# rubocop:disable Metrics/BlockLength
RSpec.describe DreamSearchParams do
  let(:params) do
    {
      from_date: Time.new(2025, 1, 1).to_i * 1000,
      to_date: Time.new(2025, 1, 29).to_i * 1000,
      search_phrase: 'some dream',
      page: '2',
      user_timezone: 'America/New_York'
    }
  end

  let(:expected_from_time) { Time.new(2025, 1, 1) }
  let(:expected_to_time) { Time.new(2025, 1, 29) }

  subject(:search_params) { described_class.new(params) }

  describe '#initialize' do
    it 'correctly parses the given params' do
      expect(search_params.from).to eq(expected_from_time)
      expect(search_params.to).to eq(expected_to_time)
      expect(search_params.search_phrase).to eq('some dream')
      expect(search_params.page).to eq(2)
      expect(search_params.user_timezone).to eq('America/New_York')
    end
  end

  describe '#offset' do
    it 'calculates the offset using the page' do
      expect(search_params.offset).to eq(50)
    end
  end

  describe '#limit' do
    it 'returns the current limit' do
      expect(search_params.limit).to eq(51)
    end
  end
end
# rubocop:enable Metrics/BlockLength
