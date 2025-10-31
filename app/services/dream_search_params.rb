# frozen_string_literal: true

class DreamSearchParams
  attr_reader :from, :to, :search_phrase, :page, :user_timezone

  include TimeConversion

  def initialize(params)
    @from = TimeConversion.from_ms(params[:from_date])
    @to = TimeConversion.from_ms(params[:to_date])
    @search_phrase = params[:search_phrase]
    @page = params[:page].to_i.positive? ? params[:page].to_i : 1
    @user_timezone = params[:user_timezone]
  end

  def offset
    (page - 1) * limit
  end

  def limit
    50
  end
end
