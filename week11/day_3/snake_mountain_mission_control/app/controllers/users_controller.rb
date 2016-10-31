class UsersController < ApplicationController
  def index
    authenticate_user!()
    missions = missions.where(user_id: current_user.id)
    render json: missions
  end
end