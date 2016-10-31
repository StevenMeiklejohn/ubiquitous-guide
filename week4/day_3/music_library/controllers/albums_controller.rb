get '/albums' do
  #INDEX
  @albums = Album.all()
  erb ( :'albums/index' )
end

get '/albums/new' do
  #NEW
  @artists = Artist.all()
  erb( :'albums/new' )
end

post '/albums' do
  #CREATE
 @album = Album.new( params )
 @album.save()
 redirect to('/albums')
end

get '/albums/:id' do
  #SHOW
  @album = Album.find( params[:id] )
  erb( :'albums/show' )
end

get '/albums/:id/edit' do
  #EDIT
  @album = Album.find( params[:id] )
  @artists = Artist.all()
  erb( :'albums/edit' )
end

put '/albums/:id' do
  #UPDATE
 @album = Album.update( params )
 redirect to( "/albums/#{params[:id]}" )
end

delete '/albums/:id' do
  #DELETE
  Album.destroy( params[:id] )
  redirect to('/albums')
end