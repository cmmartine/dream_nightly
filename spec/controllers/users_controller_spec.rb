require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  describe 'GET status' do
    context 'When the user is logged in' do
      login_user
      it 'returns a status of true' do
        get :status
        return_hash = JSON.parse(response.body)
        expect(return_hash).to eq(true)
      end
    end

    context 'When the user is NOT logged in' do
      it 'returns a status of false' do
        get :status
        return_hash = JSON.parse(response.body)
        expect(return_hash).to eq(false)
      end
    end
  end
end
