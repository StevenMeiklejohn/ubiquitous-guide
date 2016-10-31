class ShowsController < ApplicationController
  def index
      shows = Show.all
      render( json: shows )
  end

  def show
    show = Show.find( params[:id] )
    render( json: show)
  end

  def create
    show = Show.create( {
      name: params[:name],
      year: params[:year],
      location: params[:location],
      image: params[:image]
      }
      )
    render( json: show )
  end

  def update
    show = Show.find(params[:id])
    show.update({ name: params[:name], year: params[:year], location: params[:location], image: params[:image] })
    render( json: show )
  end


  def destroy
    show = Show.find(params[:id])
    show.destroy
    index
  end


  # private
  # def show_params
  #   params.require(:show).permit(:name, :year, :location, :img)
  # end




end