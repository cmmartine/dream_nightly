require 'rails_helper'

RSpec.describe Dream, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
  end

  describe 'validations' do
    create_user_with_dreams
    it { should validate_presence_of(:body) }
  end
end
