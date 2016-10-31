class MoviesController < ApplicationController
  def index
    @movies = [ {name: "Jaws"}, {name: "Aliens"}, {name: "Robocop"} ]
    respond_to do |format| 
      format.html
      format.json { render({ :json => @movies}) }
    end
  end
end
