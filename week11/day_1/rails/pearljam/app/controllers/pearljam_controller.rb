class PearljamController < ApplicationController
  def index
    pearljam = Album.all
    render(json: pearljam)
  end

  def show
    album = Album.find( params[:id] )

    render( json: album )
  end

  def create
    album = Album.new
    album.name = params[:name]
    album.save
    render( json: album )
  end

  def update
    album = Album.find_by(id: params[:id])
    album.update(name: params[:name])
    render( json: album )
  end

  def destroy 
    album = Album.find(params[:id])
    album.delete();
    index();
  end



end


