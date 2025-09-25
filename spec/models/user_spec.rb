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
end
