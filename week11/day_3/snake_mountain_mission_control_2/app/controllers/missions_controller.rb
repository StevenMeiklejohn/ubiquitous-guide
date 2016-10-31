class MissionsController < ApplicationController

  def index
    authenticate_user!
    current_user
    if current_user.user_type == 'admin'
      missions = Mission.all
      
    else
      missions = Mission.where(user_id: current_user.id)
    end
    render json: missions.as_json(include: :user) 
  end


  def create
    if current_user.user_type == 'admin'
      mission = Mission.create({
                        
                                })
    end
  end

end