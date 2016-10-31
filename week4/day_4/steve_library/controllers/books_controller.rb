require_relative('../models/book.rb')

#Create /books page which displays all books.
#Create.all method for model book.
get '/books' do
  @books = Book.all
  erb :'books/index'
end