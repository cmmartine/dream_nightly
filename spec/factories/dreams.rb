FactoryBot.define do
  factory :dream do
    user { nil }
    body { "MyText" }
    date { "2024-11-23 19:38:19" }
    ai_interpretation { "MyText" }
    lucid { false }
  end
end
