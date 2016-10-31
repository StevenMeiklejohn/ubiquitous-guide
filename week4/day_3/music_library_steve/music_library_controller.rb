require('sinatra')
require('sinatra/contrib/all') if development?
require('pry-byebug')
require_relative('./models/artist')


get '/artist/new' do
  erb(:new)
end

get '/artist' do
  @artists = Artist.all()
  erb( :index )
end


post '/artist' do
  @artist = Artist.new( params )
  @artist.save()
  erb( :create )

end

get '/artist/:id' do
  @artist = Artist.find( params[:id] )
  #binding.pry
  erb( :show )
end

get '/artists/:id/edit' do
  #EDIT
  @artist = Artist.find( params[:id] )
  erb( :edit )


end

put '/artists/:id' do
  #UPDATE
  @artist = Artist.update( params )
  redirect to( ".artists/#{params[:id]}")
end

delete'/artists/:id' do
  #DELETE
  Artist.destroy( params[:id] )
  redirect to('/artists')
  end









