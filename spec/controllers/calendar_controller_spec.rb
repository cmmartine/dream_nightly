# frozen_string_literal: true

require 'rails_helper'

# rubocop:disable Metrics/BlockLength
RSpec.describe CalendarController, type: :controller do
  describe 'GET /days_info' do
    context 'when the user is logged in' do
      login_user

      let(:current_user) { User.first }
      let(:user_timezone) { 'America/New_York' }
      let(:chosen_date) { Date.new(2025, 9, 30) }
      let(:next_month_date) { chosen_date + 1.day }

      let(:valid_params) do
        {
          year: chosen_date.year,
          month: chosen_date.month,
          user_timezone: user_timezone
        }
      end

      before(:each) do
        create_dreams_for_logged_in_user
      end

      it 'returns http success' do
        get :days_info, params: valid_params, as: :json
        expect(response).to have_http_status(:success)
      end

      it 'returns an array with each days information for the month and year' do
        get :days_info, params: valid_params, as: :json

        days_info = JSON.parse(response.body)['days']

        first_day = days_info[0]
        expect(first_day['day_num']).to eq(1)
        expect(first_day['day_has_dreams']).to eq(false)
        expect(first_day['day_of_week']).to eq(chosen_date.beginning_of_month.wday)

        last_day = days_info[days_info.length - 1]
        expect(last_day['day_num']).to eq(30)
        expect(last_day['day_has_dreams']).to eq(true)
        expect(last_day['day_of_week']).to eq(chosen_date.end_of_month.wday)
      end

      it 'returns that a day has dreams only for the chosen month' do
        get :days_info, params: valid_params, as: :json

        days_info = JSON.parse(response.body)['days']

        expect(days_info.select { |day| day['day_has_dreams'] == true }.count).to eq(2)
      end

      context 'when there are no dreams' do
        it 'returns all days with day_has_dreams as false' do
          current_user.dreams.destroy_all
          get :days_info, params: valid_params, as: :json

          days_info = JSON.parse(response.body)['days']

          expect(days_info.all? { |day| day['day_has_dreams'] == false }).to be true
        end
      end
    end
  end
end
# rubocop:enable Metrics/BlockLength
