FactoryBot.define do
  factory :dream do
    user_id { FactoryBot.create(:user).id }
    body { 'Text for dream factory' }
    dreamed_at { '2025-09-30 08:38:19' }
    ai_interpretation { 'MyText' }
    lucid { false }

    trait :one_day_ago do
      dreamed_at { '2025-09-29 07:15:11' }
    end

    trait :one_day_ahead do
      dreamed_at { '2025-10-01 07:27:40' }
    end
  end
end
