require_relative('../models/shift')

get '/shifts/new' do
  #NEW
  erb( :'/shifts/new' )
end


get '/shifts' do
  #INDEX
  @shifts = Shift.all()
  erb ( :'/shifts/index' )
end


post '/shifts' do
  #CREATE
 @shift = Shift.new( params )
 @shift.save()
 redirect to(:'shifts')
end

get '/shifts/:id' do
  #SHOW
  @shift = Shift.find( params[:id] )
  erb( :'/shifts/show' )
end


get '/shifts/:id/edit' do
  #EDIT
  @shift = Shift.find( params[:id] )
  erb( :'/shifts/edit' )
end

put '/shifts/:id' do
  #UPDATE
 @shift = Shift.update( params )
 redirect to( "/shifts/#{params[:id]}" )
end

delete '/shifts/:id' do
  #DELETE
  Shift.destroy( params[:id] )
  redirect to('/shifts')
end
