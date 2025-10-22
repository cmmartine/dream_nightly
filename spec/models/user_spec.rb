require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'associations' do
    it { should have_many(:dreams) }
  end

  describe 'validations' do
    it { should allow_value('Password1!').for(:password) }
    it { should_not allow_value('password').for(:password) }
    it { should_not allow_value('Password1').for(:password) }
  end

  describe('dreams_from_year') do
    it('fetches only the users dreams from the passed in year') do
      create_user_with_dreams
      user = User.first
      FactoryBot.create(:dream, user_id: user.id, dreamed_at: '2026-01-01 07:15:11')
      FactoryBot.create(:dream, user_id: user.id, dreamed_at: '2024-12-31 07:15:11')

      returned_dreams = user.dreams_from_year(2025)

      expect(returned_dreams.count { |dream| dream.dreamed_at.year == 2025 }).to eq(user.dreams.count - 2)
    end
  end
end
