require_relative('../models/book.rb')

get '/books' do
  @books = Book.all
  erb :'books/index'
end

get '/books/new' do
  erb :'books/new'
end

get '/books/:id' do
end

get '/books/:id/edit' do
end

post '/books' do
  @book = Book.new(params)
  @book.save
  redirect to( "books" )
end

post '/books/:id' do
end

delete '/books' do
end