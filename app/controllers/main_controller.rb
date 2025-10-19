# frozen_string_literal: true

class MainController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.any { head :not_acceptable }
    end
  end
end
