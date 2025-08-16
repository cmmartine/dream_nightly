require 'rails_helper'

RSpec.describe Dream, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
  end

  describe 'validations' do
    create_user_with_dreams
    it { should validate_presence_of(:body) }
  end

  describe 'self.from_date' do
    let(:user) { create_user_two_same_date_dreams }
    let(:first_dream) { user.dreams.first }
    let(:second_dream) { user.dreams.last }
    let(:dreams_date) { '2024-11-23 08:38:19'.to_datetime }
    let(:not_dreams_date) { '2000-01-01 00:00:00'.to_datetime }

    it 'returns an array of dreams from the given date in ascending order' do
      expect(user.dreams.from_date(dreams_date)).to eq([second_dream, first_dream])
    end

    it 'returns an EMPTY array if there are no dreams from the date' do
      expect(user.dreams.from_date(not_dreams_date)).to eq([])
    end
  end

  describe 'self.filtered_from_date' do
    let(:user) { create_user_with_dreams }
    let(:dream) { user.dreams.first }
    let(:dreams_date) { dream.created_at }
    let(:filtered_dream) do
      {
        id: dream.id,
        body: dream.body,
        ai_interpretation: dream.ai_interpretation,
        lucid: dream.lucid,
        created_at: dream.created_at.to_i * 1000
      }
    end
    let(:not_dreams_date) { '2000-01-01 00:00:00'.to_datetime }

    it 'returns an array of filtered dreams from the given date' do
      expect(user.dreams.filtered_from_date(dreams_date)).to eq([filtered_dream])
    end

    it 'returns an EMPTY array if there are no dreams from the date' do
      expect(user.dreams.filtered_from_date(not_dreams_date)).to eq([])
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

  describe 'created_at_in_ms' do
    it 'converts the created_at from datetime to ms' do
      dream = FactoryBot.create(:dream)
      expect(dream.created_at_in_ms).to eq(1_732_351_099_000)
    end
  end
end
