FactoryBot.define do
  factory :user do
    email { 'testemail@test.com' }
    password { 'Password1!' }
    password_confirmation { 'Password1!' }
  end
end

def create_user_with_dreams
  user = FactoryBot.create(:user)
  FactoryBot.create(:dream, :one_day_ago, user_id: user.id)
  FactoryBot.create(:dream, user_id: user.id)
  FactoryBot.create(:dream, user_id: user.id)
  FactoryBot.create(:dream, :one_day_ahead, user_id: user.id)
  user
end

def create_user_two_same_date_dreams
  user = FactoryBot.create(:user)
  FactoryBot.create(:dream, user_id: user.id)
  FactoryBot.create(:dream, user_id: user.id)
  user
end
