FactoryBot.define do
  factory :dream do
    user_id { nil }
    body { 'Text for dream factory' }
    date { '2024-11-23 08:38:19' }
    ai_interpretation { 'MyText' }
    lucid { false }

    trait :one_day_ago do
      date { '2024-11-22 07:15:11' }
    end

    trait :one_day_ahead do
      date { '2024-11-24 07:27:40' }
    end
  end
end
