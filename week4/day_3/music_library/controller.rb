require( 'sinatra' )
require( 'sinatra/contrib/all' )
require('pry-byebug')

require_relative( './models/album' )
require_relative( './models/artist' )
require_relative( './controllers/albums_controller.rb' )
require_relative( './controllers/artists_controller.rb' )

get( '/library' ) do 
  @artists = Artist.all()
  @albums = Album.all()
  erb( :index )
end