class GigsController < ApplicationController

  def index
      gigs = Gig.where( { artist: params[:artist_id] } )
      render( json: gigs.as_json( { include: :venue } ) )
  end

  def create
  gig = Gig.create(
  {
  price: params[:price],
  date: params[:date],
  artist_id: params[:artist_id],
  venue_id: params[:venue_id]
  #Calling the index function ( index() )will redirect to index after create completes.
  }
  )
  render(json: gig)
  end


end