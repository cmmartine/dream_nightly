require 'rails_helper'

RSpec.describe Dream, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
  end

  describe 'validations' do
    create_user_with_dreams
    it { should validate_presence_of(:body) }
    it { should validate_length_of(:body).is_at_least(1).is_at_most(Constants::MAX_COUNTS['DREAM_CHARS']) }
  end

  describe 'self.from_date' do
    let(:user) { create_user_two_same_date_dreams }
    let(:oldest_dream) { user.dreams.first }
    let(:newest_dream) { user.dreams.last }
    let(:dreams_date) { oldest_dream.dreamed_at }
    let(:not_dreams_date) { '2000-01-01 00:00:00'.to_datetime }
    let(:timezone) { 'America/New_York' }

    it 'returns an array of dreams from the given date in descending order' do
      expect(user.dreams.from_date(dreams_date, timezone)).to eq([newest_dream, oldest_dream])
    end

    it 'returns an EMPTY array if there are no dreams from the date' do
      expect(user.dreams.from_date(not_dreams_date, timezone)).to eq([])
    end

    it 'only returns dreams on the date of the users timezone' do
      # Create a dream at 2024-01-02 03:00:00 UTC (which is 2024-01-01 22:00:00 EST)
      time = Time.utc(2024, 1, 2, 3, 0, 0)
      first_dream = Dream.create!(body: 'Test dream', user_id: user.id, dreamed_at: time)
      # 2024-01-02 00:00:00 EST in UTC is 2024-01-02 05:00:00 UTC
      second_time = Time.utc(2024, 1, 5, 0, 0, 0)
      Dream.create!(body: 'Test dream2', user_id: user.id, dreamed_at: second_time)
      expect(user.dreams.from_date(first_dream.dreamed_at, timezone)).to eq([first_dream])
    end
  end

  describe 'self.filtered_from_date' do
    let(:user) { create_user_with_dreams }
    let(:dream) { user.dreams.first }
    let(:dreams_date) { dream.dreamed_at }
    let(:timezone) { 'America/New_York' }
    let(:filtered_dream) do
      {
        id: dream.id,
        body: dream.body,
        ai_interpretation: dream.ai_interpretation,
        lucid: dream.lucid,
        dreamed_at: dream.dreamed_at.to_i * 1000
      }
    end
    let(:not_dreams_date) { '2000-01-01 00:00:00'.to_datetime }

    it 'returns an array of filtered dreams from the given date' do
      expect(user.dreams.filtered_from_date(dreams_date, timezone)).to eq([filtered_dream])
    end

    it 'returns an EMPTY array if there are no dreams from the date' do
      expect(user.dreams.filtered_from_date(not_dreams_date, timezone)).to eq([])
    end
  end

  describe('self.filtered_dream_object') do
    let(:user) { create_user_with_dreams }
    let(:dream) { user.dreams.first }

    it 'returns the dream object with attributes converted correctly' do
      filtered_dream = Dream.filtered_dream_object(dream)

      expect(filtered_dream).to eq(
        {
          id: dream.id,
          body: dream.body,
          ai_interpretation: dream.ai_interpretation,
          lucid: dream.lucid,
          dreamed_at: dream.dreamed_at.to_i * 1000
        }
      )
    end
  end

  describe 'self.find_owned_by' do
    let(:user) { create_user_with_dreams }
    let(:dream) { user.dreams.first }

    it 'returns the dream if dream id belongs to user and exists' do
      expect(Dream.find_owned_by(user, dream.id)).not_to eq(nil)
    end

    it 'does not return the dream if dream id and user do no match' do
      other_user = FactoryBot.create(:user, email: 'testemai2@test.com')
      other_user_dream = FactoryBot.create(:dream, user_id: other_user.id)
      expect(Dream.find_owned_by(user, other_user_dream.id)).to eq(nil)
    end
  end

  describe 'dreamed_at_in_ms' do
    it 'converts the dreamed_at from datetime to ms' do
      dream = FactoryBot.create(:dream)
      expect(dream.dreamed_at_in_ms).to eq(1_759_221_499_000)
    end
  end

  describe 'self.valid_range?' do
    let(:valid_time) { Time.now.to_i * 1000 }
    let(:invalid_future_time) { (Time.now + 2.days).to_i }
    let(:invalid_past_time) { Time.new(Constants::NONVALID_DREAM_DATE['BEFORE_YEAR']).beginning_of_year.to_i }
    let(:user_timezone) { 'America/New_York' }

    it 'returns false if there is no date_time' do
      expect(Dream.valid_range?(nil, user_timezone)).to eq(false)
    end

    it 'returns false if there is no user_timezone' do
      expect(Dream.valid_range?(valid_time, nil)).to eq(false)
    end

    it 'returns false if date is before valid range' do
      expect(Dream.valid_range?(invalid_past_time, user_timezone)).to eq(false)
    end

    it 'returns false if date is after valid range' do
      expect(Dream.valid_range?(invalid_future_time, user_timezone)).to eq(false)
    end

    it 'returns true when time is within range and there is a timezone' do
      expect(Dream.valid_range?(valid_time, user_timezone)).to eq(true)
    end
  end
end
