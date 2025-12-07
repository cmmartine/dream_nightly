# frozen_string_literal: true

class DreamSerializer < ActiveModel::Serializer
  attributes :id, :body, :lucid, :ai_interpretation, :dreamed_at

  def dreamed_at
    object.dreamed_at_in_ms
  end
end
