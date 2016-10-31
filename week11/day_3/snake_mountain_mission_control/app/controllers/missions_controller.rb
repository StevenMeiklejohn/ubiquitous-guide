class MissionsController < ApplicationController
  def index
    authenticate_user!()
    missions = Missions.all
    render json: missions
  end
end