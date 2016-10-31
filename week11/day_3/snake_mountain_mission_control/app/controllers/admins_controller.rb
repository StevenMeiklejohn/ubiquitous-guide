class AdminsController < ApplicationController
  def index
    authenticate_user!()
    missions = Mission.all
    render json: missions
  end
end