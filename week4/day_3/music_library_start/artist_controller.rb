require('sinatra')
require('sinatra/contrib/all') if development?
require('pry-byebug')
require_relative('./models/artist.rb')


get '/hi' do
  return 'Hello world! 10 -4 Rubber ducky theres a smoky on yer tail'
end



get '/artist' do
  erb(:new)
end

get '/pizzas' do
  #INDEX
  @pizzas = Pizza.all()
  # binding.pry
  erb( :index )
end

#post data to creat new pizza
post '/pizzas' do
  #CREATE
  #binding.pry
  #should match form action
  #binding.pry
 # passes in def initialize(options)
  @pizza = Pizza.new( params )
  @pizza.save()
  erb( :create )

end

get '/pizzas/:id' do
  #SHOW
  @pizza = Pizza.find( params[:id] )
  #binding.pry
  erb( :show )
end

get '/pizzas/:id/edit' do
  #EDIT
  @pizza = Pizza.find( params[:id] )
  erb( :edit )

end

put '/pizzas/:id' do
  #UPDATE
  @pizza = Pizza.update( params )
  redirect to( ".pizzas/#{params[:id]}")
end

delete'/pizzas/:id' do
  #DELETE
  Pizza.destroy( params[:id] )
  redirect to('/pizzas')
  end