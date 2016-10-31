class CharactersController < ApplicationController

  def index
      characters = Character.where( { show: params[:show_id] } )
      render( json: characters.as_json )
  end

  def show
    character = Character.find( params[:id] )
    render( json: character )
  end

  def create
    character = Character.create( {
      name: params[:name],
      species: params[:year],
      catchphrase: params[:location],
      show_id: params[:show_id]
      }
      )
    render( json: character )
  end

  def update
    character = Character.find(params[:id])
    character.update({ name: params[:name], species: params[:species], catchphrase: params[:catchphrase] })
    render( json: character )
  end


  def destroy
    character = Character.find(params[:id])
    character.destroy
    index
  end



end