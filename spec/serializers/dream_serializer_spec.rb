# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DreamSerializer do
  let(:dream) { FactoryBot.build(:dream) }
  let(:expected_serialized_dream) do
    {
      id: dream.id,
      body: dream.body,
      lucid: dream.lucid,
      ai_interpretation: dream.ai_interpretation,
      dreamed_at: dream.dreamed_at.to_i * 1000
    }
  end

  it 'outputs dreams in the correct format' do
    serialized_dream = DreamSerializer.new(dream).as_json
    expect(serialized_dream).to eq(expected_serialized_dream)
  end
end
