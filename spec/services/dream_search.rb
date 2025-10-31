# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DreamSearch do
  let(:user) { create_user_with_dreams }
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
      limit: 50
    )
  end

  subject(:search) { described_class.new(user, params) }

  describe '#results' do
    it 'returns any matching dreams for the user' do
      search_results = search.results
      expect(search_results.length).to eq(2)
      expect(search_results).to all(have_attributes(user_id: user.id))
      other_user.dreams.each do |dream|
        expect(search_results).not_to include(dream)
      end
    end
  end
end
