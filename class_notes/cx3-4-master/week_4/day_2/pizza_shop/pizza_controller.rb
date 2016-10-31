require( 'sinatra' )
require( 'sinatra/contrib/all' )
require( 'pry-byebug' )
require( './models/pizza' )

get '/pizza' do
  @pizzas = Pizza.all()
  erb ( :index )
end

get '/pizza/new' do 
  erb( :new )
end

post '/pizza' do 
  @pizza = Pizza.new( params )
  @pizza.save
  erb( :create )
end