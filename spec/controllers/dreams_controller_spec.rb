# frozen_string_literal: true

require 'rails_helper'

# rubocop:disable Metrics/BlockLength
RSpec.describe DreamsController, type: :controller do
  describe 'POST /create' do
    let(:valid_time) { Time.now.to_i * 1000 }
    let(:dream_body) { 'Test dream' }
    let(:user_timezone) { 'America/New_York' }
    def dream_params(time)
      {
        dream: {
          body: dream_body,
          time_in_ms: time,
          user_timezone: user_timezone
        }
      }
    end
    context 'When the user is logged in' do
      login_user
      let(:dream) { Dream.first }
      valid_num_of_dreams = Constants::MAX_COUNTS['DREAMS_IN_A_DAY']

      describe "and the dream is within valid time range and there are less than #{valid_num_of_dreams} dreams that day" do
        before do
          post :create, params: dream_params(valid_time), as: :json
        end

        it 'creates the dream' do
          expect(Dream.all.count).to eq(1)
        end

        it 'sets the dreams body correctly' do
          expect(dream.body).to eq(dream_body)
        end

        it 'returns a filtered dream object' do
          returned_dream = JSON.parse(response.body)['dream']
          expect(returned_dream['body']).to eq(dream_body)
          expect(returned_dream['created_at']).to eq(valid_time)
        end
      end

      describe("when there are less than #{valid_num_of_dreams} dreams but dream is outside of the time range") do
        it 'does not create the dream' do
          post :create, params: dream_params((Time.now + 2.days).to_i * 1000), as: :json

          expect(Dream.all.count).to eq(0)
          expect(response.status).to eq(403)
        end
      end

      describe("when dream is in valid time range but there are more than #{valid_num_of_dreams} in the day") do
        it 'does not create the dream' do
          user = User.first
          10.times do
            Dream.create(body: 'test', user_id: user.id)
          end

          post :create, params: dream_params(valid_time), as: :json

          expect(Dream.all.count).to eq(10)
          expect(response.status).to eq(403)
        end
      end

      describe 'and the dream is not valid' do
        invalid_dream_body_params = {
          dream: {
            body: '',
            time_in_ms: Time.now.to_i * 1000,
            user_timezone: 'America/New_York'
          }
        }

        nil_dream_time_params = {
          dream: {
            body: 'dream',
            time_in_ms: nil,
            user_timezone: 'America/New_York'
          }
        }

        invalid_dream_time_params = {
          dream: {
            body: 'dream',
            time_in_ms: 'invalid_time',
            user_timezone: 'America/New_York'
          }
        }

        date_greater_than_valid_range = {
          dream: {
            body: 'dream',
            time_in_ms: (Time.now + 2.days).to_i * 1000,
            user_timezone: 'America/New_York'
          }
        }

        date_less_than_valid_range = {
          dream: {
            body: 'dream',
            time_in_ms: Time.new(Constants::NONVALID_DREAM_DATE['BEFORE_YEAR']).end_of_year.to_i,
            user_timezone: 'America/New_York'
          }
        }

        context 'when the body is empty' do
          it 'returns an unprocessable status' do
            post :create, params: invalid_dream_body_params, as: :json
            expect(response.status).to eq(422)
          end
        end

        context 'when the time is null' do
          before do
            allow(Dream).to receive(:valid_range?).and_return(true)
          end

          it 'renders a 422 status code' do
            post :create, params: nil_dream_time_params, as: :json
            expect(response.status).to eq(422)
          end
        end

        context 'when the time is invalid' do
          before do
            allow(Dream).to receive(:valid_range?).and_return(true)
          end

          it 'renders a 422 status code' do
            post :create, params: invalid_dream_time_params, as: :json
            expect(response.status).to eq(422)
          end
        end

        context 'when the date is after the allowed range' do
          it 'does not create the dream' do
            post :create, params: date_greater_than_valid_range, as: :json
            expect(Dream.all.length).to eq(0)
          end

          it 'renders a 403 status code' do
            post :create, params: date_greater_than_valid_range, as: :json
            expect(response.status).to eq(403)
          end
        end

        context 'when the date is before the allowed range' do
          it 'does not create the dream' do
            post :create, params: date_less_than_valid_range, as: :json
            expect(Dream.all.length).to eq(0)
          end

          it 'renders a 403 status code' do
            post :create, params: date_less_than_valid_range, as: :json
            expect(response.status).to eq(403)
          end
        end
      end
    end

    context 'When the user is NOT logged in' do
      before do
        post :create, params: dream_params(valid_time), as: :json
      end

      it 'does not create the dream' do
        expect(Dream.all.length).to eq(0)
      end
    end
  end

  describe 'POST /update' do
    let(:updated_dream_params) do
      {
        dream: {
          body: 'Dream is updated',
          dream_id: users_dream.id
        }
      }
    end

    let(:invalid_updated_dream_params) do
      {
        dream: {
          body: '',
          dream_id: users_dream.id
        }
      }
    end

    let(:second_user_dream_params) do
      {
        dream: {
          body: 'not updated',
          dream_id: second_users_dream.id
        }
      }
    end

    let(:user) { User.first }
    let(:second_user) { FactoryBot.create(:user, email: 'testemai2@test.com') }
    let(:users_dream) { user.dreams.first }
    let(:second_users_dream) { second_user.dreams.first }

    context 'When the user is logged in' do
      login_user

      it 'updates the dreams body' do
        Dream.create!(body: 'New dream', user_id: user.id)
        expect(users_dream.body).to eq('New dream')
        post :update, params: updated_dream_params, as: :json
        users_dream.reload
        expect(users_dream.body).to eq('Dream is updated')
      end

      describe 'and the dream is not valid' do
        it 'returns an unprocessable status ' do
          Dream.create!(body: 'New dream', user_id: user.id)
          post :update, params: invalid_updated_dream_params, as: :json
          expect(response.status).to eq(422)
        end
      end

      describe 'and the dream is not the current users dream' do
        it 'returns a forbidden status and does not update the dream' do
          Dream.create!(body: 'User 2 dream', user_id: second_user.id)
          post :update, params: second_user_dream_params, as: :json
          expect(response.status).to eq(403)
          second_users_dream.reload
          expect(second_users_dream.body).to eq('User 2 dream')
        end
      end
    end

    context 'When the user is not logged in' do
      let(:user) { create_user_with_dreams }
      let(:users_dream) { user.dreams.first }

      it 'does not update the dreams body' do
        expect(users_dream.body).to eq('Text for dream factory')
        post :update, params: updated_dream_params, as: :json
        users_dream.reload
        expect(users_dream.body).not_to eq('Dream is updated')
        expect(response.body).to include('You need to sign in or sign up before continuing')
      end
    end
  end

  describe 'POST /destroy' do
    let(:dream_params) do
      {
        dream: {
          dream_id: users_dream.id
        }
      }
    end
    let(:second_user_dream_params) do
      {
        dream: {
          dream_id: second_users_dream.id
        }
      }
    end
    let(:user) { User.first }
    let(:second_user) { FactoryBot.create(:user, email: 'testemai2@test.com') }
    let(:users_dream) { user.dreams.first }
    let(:second_users_dream) { second_user.dreams.first }

    context 'When the user is logged in' do
      login_user

      context 'and the dream is destroyed successfully' do
        it 'destroys the existing dream' do
          Dream.create!(body: 'New dream', user_id: user.id)
          post :destroy, params: dream_params, as: :json
          expect(Dream.all.length).to eq(0)
          expect(Dream.exists?(users_dream.id)).to eq(false)
        end
      end

      context 'and the dream is NOT destroyed successfully' do
        it 'returns an unprocessable status' do
          Dream.create!(body: 'New dream', user_id: user.id)
          allow_any_instance_of(Dream).to receive(:destroyed?) { false }
          post :destroy, params: dream_params, as: :json
          expect(response.status).to eq(422)
        end
      end

      context 'and the dream is not the current users dream' do
        it 'returns a forbidden status and does not delete the dream' do
          Dream.create!(body: 'User 2 dream', user_id: second_user.id)
          post :destroy, params: second_user_dream_params, as: :json
          expect(response.status).to eq(403)
          second_users_dream.reload
          expect(second_users_dream.body).to eq('User 2 dream')
        end
      end
    end

    context 'When the user is not logged in' do
      let(:user) { create_user_with_dreams }
      let(:users_dream) { user.dreams.first }

      it 'does not destroy the dream' do
        users_initial_dream_count = user.dreams.count
        post :destroy, params: dream_params, as: :json
        expect(user.dreams.count).to eq(users_initial_dream_count)
        expect(Dream.exists?(users_dream.id)).to eq(true)
        expect(response.body).to include('You need to sign in or sign up before continuing')
      end
    end
  end

  describe 'POST /from_date' do
    let(:dream_params) do
      {
        dream: {
          time_in_ms: users_dream.created_at.to_i * 1000
        }
      }
    end

    let(:invalid_dream_params) do
      {
        dream: {
          time_in_ms: 'invalid_time',
          user_timezone: 'no timezone'
        }
      }
    end

    let(:filtered_dream_array) do
      [
        {
          id: users_dream.id,
          body: users_dream.body,
          ai_interpretation: users_dream.ai_interpretation,
          lucid: users_dream.lucid,
          created_at: users_dream.created_at.to_i * 1000
        }
      ]
    end
    let(:user) { User.first }
    let(:users_dream) { user.dreams.first }

    context 'When the user is logged in' do
      login_user

      it 'renders the filtered dream array with correct time zone' do
        # Created with UTC
        time = Time.new(2024, 1, 1, 8, 0, 0)
        dream = Dream.create!(body: 'Test dream', user_id: user.id, created_at: time)

        Time.use_zone('America/New_York') do
          expected_time = Time.use_zone('America/New_York') do
            Time.zone.parse(time.to_s)
          end.to_i * 1000

          params = {
            dream: {
              time_in_ms: time.to_i * 1000,
              user_timezone: 'America/New_York'
            }
          }
          post :from_date, params: params, as: :json
          expected = [
            {
              id: dream.id,
              body: dream.body,
              ai_interpretation: dream.ai_interpretation,
              lucid: dream.lucid,
              created_at: expected_time
            }
          ]
          expect(response.status).to eq(200)
          expect(JSON.parse(response.body)).to eq(JSON.parse(expected.to_json))
        end
      end

      it 'does not include dreams outside the requested date in the timezone' do
        # Create a dream at 2024-01-02 03:00:00 UTC (which is 2024-01-01 22:00:00 EST)
        time = Time.utc(2024, 1, 2, 3, 0, 0)
        Dream.create!(body: 'Test dream', user_id: user.id, created_at: time)

        # 2024-01-02 00:00:00 EST in UTC is 2024-01-02 05:00:00 UTC
        time_to_get_dreams = Time.use_zone('America/New_York') { Time.zone.local(2024, 1, 2, 0, 0, 0) }
        params = {
          dream: {
            time_in_ms: time_to_get_dreams.to_i * 1000,
            user_timezone: 'America/New_York'
          }
        }
        post :from_date, params: params, as: :json
        # Should not include the UTC dream, since it's on 2024-01-01 in EST
        expect(JSON.parse(response.body)).to be_empty
      end

      context 'and an error occurs' do
        it 'returns an error message' do
          post :from_date, params: invalid_dream_params, as: :json
          expect(response.status).to eq(422)
          expect(response.body).to include('Failed to retrieve dreams')
        end
      end
    end

    context 'When the user is NOT logged in' do
      let(:user) { create_user_with_dreams }
      let(:users_dream) { user.dreams.first }

      it 'does not render the filtered dream array' do
        post :from_date, params: dream_params, as: :json
        expect(response.body).to include('error')
      end
    end
  end
end
# rubocop:enable Metrics/BlockLength
