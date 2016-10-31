class AnimalsController < ApplicationController
  def index
    @animals = [ {name: "Tiger"}, {name: "Snow Leopard"} ]
    respond_to do |format| 
      format.html
      format.json { render({ :json => @animals}) }
    end
  end
end

