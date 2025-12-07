# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DreamSearch do
  page_size_plus_one = Constants::MAX_COUNTS['SEARCH_PAGE_SIZE'] + 1
  page_size = Constants::MAX_COUNTS['SEARCH_PAGE_SIZE']
  let(:user) { create_user_with_dreams }
  let(:user_first_dream) { user.dreams.first }
  let!(:other_user) { create_other_user_two_dreams }
  let(:params) do
    instance_double(
      DreamSearchParams,
      from: Time.new(2025, 9, 29),
      to: Time.new(2025, 9, 30),
      search_phrase: 'dream factory',
      page: '1',
      user_timezone: 'America/New_York',
      offset: 0,
      limit: page_size_plus_one
    )
  end

  subject(:search) { described_class.new(user, params) }

  describe '#results' do
    it 'returns any matching dreams for the user' do
      search_results = search.results

      expect(search_results.length).to eq(2)
      expect(search_results.first).to eq(user.dreams.first)
      other_user.dreams.each do |dream|
        expect(search_results).not_to include(dream)
      end
    end
  end

  describe '#next_page?' do
    it "returns true when there are more than #{Constants::MAX_COUNTS['SEARCH_PAGE_SIZE']} dreams" do
      user.dreams.destroy_all
      page_size_plus_one.times do
        FactoryBot.create(:dream, user_id: user.id)
      end

      expect(search.next_page?).to eq(true)
    end

    it "returns false when there are #{Constants::MAX_COUNTS['SEARCH_PAGE_SIZE']} or less dreams" do
      user.dreams.destroy_all
      page_size.times do
        FactoryBot.create(:dream, user_id: user.id)
      end

      expect(search.next_page?).to eq(false)
    end
  end
end
