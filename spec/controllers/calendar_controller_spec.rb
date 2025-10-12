# frozen_string_literal: true

require 'rails_helper'

# rubocop:disable Metrics/BlockLength
RSpec.describe CalendarController, type: :controller do
  include ActiveSupport::Testing::TimeHelpers
  describe 'GET /info' do
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

    context 'when the user is logged in' do
      login_user

      before(:each) do
        create_dreams_for_logged_in_user
      end

      it 'returns http success' do
        get :info, params: valid_params, as: :json
        expect(response).to have_http_status(:success)
      end

      it 'returns an array with each days information for the month and year' do
        travel_to Date.new(2025, 9, 30).end_of_day do
          get :info, params: valid_params, as: :json

          days_info = JSON.parse(response.body)['days']

          first_day = days_info[0]
          expect(first_day['num']).to eq(1)
          expect(first_day['has_dreams']).to eq(false)
          expect(first_day['day_of_week']).to eq(chosen_date.beginning_of_month.wday)
          expect(first_day['is_today']).to eq(false)

          last_day = days_info[days_info.length - 1]
          expect(last_day['num']).to eq(30)
          expect(last_day['has_dreams']).to eq(true)
          expect(last_day['day_of_week']).to eq(chosen_date.end_of_month.wday)
          expect(last_day['is_today']).to eq(true)
        end
      end

      it 'returns an array with each months information for the year' do
        travel_to Date.new(2025, 9, 15) do
          get :info, params: valid_params, as: :json

          months_info = JSON.parse(response.body)['months']

          expect(months_info.length).to eq(12)

          first_month = months_info[0]
          expect(first_month['num']).to eq(0)
          expect(first_month['has_dreams']).to eq(false)
          expect(first_month['is_current']).to eq(false)
          expect(first_month['short_name']).to eq('Jan')

          current_month = months_info[8]
          expect(current_month['num']).to eq(8)
          expect(current_month['has_dreams']).to eq(true)
          expect(current_month['is_current']).to eq(true)
          expect(current_month['short_name']).to eq('Sep')
        end
      end

      it 'returns that a day has dreams only for the chosen month' do
        get :info, params: valid_params, as: :json

        days_info = JSON.parse(response.body)['days']

        expect(days_info.select { |day| day['has_dreams'] == true }.count).to eq(2)
      end

      context 'when there are no dreams' do
        it 'returns all days with day_has_dreams as false' do
          current_user.dreams.destroy_all
          get :info, params: valid_params, as: :json

          days_info = JSON.parse(response.body)['days']

          expect(days_info.all? { |day| day['has_dreams'] == false }).to be true
        end
      end
    end

    context 'when the user is NOT logged in' do
      it 'does not return calendar info' do
        get :info, params: valid_params, as: :json

        expect(response.body).to include('error')
      end
    end
  end
end
# rubocop:enable Metrics/BlockLength
