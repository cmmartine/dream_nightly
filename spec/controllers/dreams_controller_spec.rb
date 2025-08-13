# frozen_string_literal: true

require 'rails_helper'

# rubocop:disable Metrics/BlockLength
RSpec.describe DreamsController, type: :controller do
  describe 'POST /create' do
    dream_params = {
      dream: {
        body: 'Test dream',
        time_in_ms: Time.now.to_i * 1000
      }
    }
    context 'When the user is logged in' do
      login_user
      let(:dream) { Dream.first }

      describe 'and the dream is valid' do
        before do
          post :create, params: dream_params, as: :json
        end

        it 'creates the dream' do
          expect(Dream.all.length).to eq(1)
        end

        it 'sets the dreams body correctly' do
          expect(dream.body).to eq('Test dream')
        end
      end

      describe 'and the dream is not valid' do
        invalid_dream_body_params = {
          dream: {
            body: '',
            time_in_ms: Time.now.to_i * 1000
          }
        }

        nil_dream_time_params = {
          dream: {
            body: 'dream',
            time_in_ms: nil
          }
        }

        invalid_dream_time_params = {
          dream: {
            body: 'dream',
            time_in_ms: 'invalid_time'
          }
        }

        before do
          post :create, params: invalid_dream_body_params, as: :json
        end

        context 'when the body is empty' do
          it 'returns an unprocessable status' do
            expect(response.status).to eq(422)
          end
        end

        context 'when the time is null' do
          before do
            post :create, params: nil_dream_time_params, as: :json
          end

          it 'renders a 422 status code' do
            expect(response.status).to eq(422)
          end
        end

        context 'when the time is invalid' do
          before do
            post :create, params: invalid_dream_time_params, as: :json
          end

          it 'renders a 422 status code' do
            expect(response.status).to eq(422)
          end
        end
      end
    end

    context 'When the user is NOT logged in' do
      before do
        post :create, params: dream_params, as: :json
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
          time_in_ms: 'invalid_time'
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
          created_at: users_dream.created_at.to_i
        }
      ]
    end
    let(:user) { User.first }
    let(:users_dream) { user.dreams.first }

    context 'When the user is logged in' do
      login_user

      it 'renders the filtered dream array' do
        Dream.create(body: 'Test dream', user_id: user.id)
        post :from_date, params: dream_params, as: :json
        expect(response.body).to eq(filtered_dream_array.to_json)
      end

      context 'and an error occurs' do
        it 'returns an error message' do
          post :from_date, params: invalid_dream_params, as: :json
          expect(response.status).to eq(422)
          expect(response.body).to include('Failed to filter dreams')
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
