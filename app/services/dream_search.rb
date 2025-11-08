# frozen_string_literal: true

class DreamSearch
  def initialize(user, params)
    @user = user
    @params = params
  end

  def results
    Time.use_zone(@params.user_timezone) do
      dreams = @user
               .dreams
               .where('dreamed_at BETWEEN ? AND ?', @params.from.beginning_of_day, @params.to.end_of_day)
               .search_by_body(@params.search_phrase)
               .offset(@params.offset)
               .limit(@params.limit)

      dreams.map do |dream|
        Dream.filtered_dream_object(dream)
      end
    end
  end
end
