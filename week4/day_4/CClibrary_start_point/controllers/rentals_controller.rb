require_relative('../models/rental.rb')

# Here's what this needs.

#INDEX
get '/rentals' do
  @rentals = Rental.all()
  erb :'rentals/index'
end

#NEW (form)
get '/rentals/new' do
    @books = Book.all()
    @members = Member.all()
    erb :'rentals/new'
  end

#CREATE

post '/rentals' do
  #binding.pry
  #params
  @rental = Rental.new( params )
  @rental.save
  redirect to('/rentals')
end

