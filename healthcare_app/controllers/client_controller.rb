require_relative('../models/client')

get '/clients/new' do
  #NEW
  erb( :'/clients/new' )
end


get '/clients' do
  #INDEX
  @clients = Client.all()
  erb ( :'clients/index' )
end

post '/clients' do
  #CREATE
 @client = Client.new( params )
 @client.save()
 redirect to(:'clients')
end

get '/clients/:id' do
  #SHOW
  @client = Client.find( params[:id] )
  erb( :'clients/show' )
end


get '/clients/:id/edit' do
  #EDIT
  @client = Client.find( params[:id] )
  erb( :'clients/edit' )
end

put '/clients/:id' do
  #UPDATE
  puts params
 @client = Client.update( params )
 redirect to( "/clients/#{params[:id]}" )
end


delete '/clients/:id' do
  #DELETE
  Client.destroy( params[:id] )
  redirect to('/clients')
end