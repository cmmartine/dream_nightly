# frozen_string_literal: true

require 'rails_helper'

# rubocop:disable Metrics/BlockLength
RSpec.describe DreamsController, type: :controller do
  describe 'POST /create' do
    dream_params = {
      dream: {
        body: 'Test dream'
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
        invalid_dream_params = {
          dream: {
            body: ''
          }
        }

        before do
          post :create, params: invalid_dream_params, as: :json
        end

        it 'returns a flash alert' do
          expect(flash[:alert]).not_to be(nil)
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

    let(:user) { User.first }
    let(:users_dream) { user.dreams.first }

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
        it 'returns a flash alert' do
          Dream.create!(body: 'New dream', user_id: user.id)
          post :update, params: invalid_updated_dream_params, as: :json
          expect(flash[:alert]).not_to be(nil)
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
    let(:user) { User.first }
    let(:users_dream) { user.dreams.first }

    context 'When the user is logged in' do
      login_user

      context 'and the dream is destroyed successfully' do
        it 'destroys the existing dream' do
          Dream.create!(body: 'New dream', user_id: user.id)
          post :destroy, params: dream_params, as: :json
          expect(Dream.all.length).to eq(0)
          expect(Dream.exists?(users_dream.id)).to eq(false)
        end

        it 'returns a flash notice that the dream was destroyed' do
          Dream.create!(body: 'New dream', user_id: user.id)
          post :destroy, params: dream_params, as: :json
          expect(flash[:notice]).to eq(DreamsController::DREAM_DESTROYED[:success])
        end
      end

      context 'and the dream is NOT destroyed successfully' do
        it 'returns a flash notice to try deleting the dream again' do
          Dream.create!(body: 'New dream', user_id: user.id)
          allow_any_instance_of(Dream).to receive(:destroyed?) { false }
          post :destroy, params: dream_params, as: :json
          expect(flash[:notice]).to eq(DreamsController::DREAM_DESTROYED[:failed])
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
    let(:filtered_dream_array) do
      [
        {
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
