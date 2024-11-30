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
    let(:user) { create_user_with_dreams }
    let(:dream) { user.dreams.first }
    let(:dreams_date) { dream.created_at }
    let(:not_dreams_date) { '2000-01-01 00:00:00'.to_datetime }

    it 'returns an array of dreams from the given date' do
      expect(user.dreams.from_date(dreams_date)).to eq([dream])
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
        body: dream.body,
        ai_interpretation: dream.ai_interpretation,
        lucid: dream.lucid,
        created_at: dream.created_at.to_i
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
end
