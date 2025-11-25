require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  describe 'GET status' do
    context 'When the user is logged in' do
      login_user
      it 'returns a logged in status of true and a new csrf token' do
        get :status
        return_hash = JSON.parse(response.body)
        expect(return_hash['logged_in']).to eq(true)
        expect(return_hash['token']).not_to eq(nil)
      end
    end

    context 'When the user is NOT logged in' do
      it 'returns a logged in status of false and no token' do
        get :status
        return_hash = JSON.parse(response.body)
        expect(return_hash['logged_in']).to eq(false)
        expect(return_hash['token']).to eq(nil)
      end
    end
  end
end
