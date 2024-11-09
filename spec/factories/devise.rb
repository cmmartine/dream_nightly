FactoryBot.define do
  factory :user do
    email { "testemail@test.com" }
    password { "Password1!" }
    password_confirmation { "Password1!" }
  end
end