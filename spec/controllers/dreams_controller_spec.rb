require 'rails_helper'

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

        it 'set the dreams date' do
          expect(dream.date).to be_within(1.second).of(Time.now)
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
      let(:dream) { Dream.first }

      before do
        post :create, params: dream_params, as: :json
      end

      it 'does not create the dream' do
        expect(Dream.all.length).to eq(0)
      end
    end
  end
end
