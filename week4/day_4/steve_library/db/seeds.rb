require 'pry-byebug'
require_relative('../models/book.rb')
require_relative('../models/member.rb')
require_relative('../models/rental.rb')

Rental.delete_all()
Book.delete_all()
Member.delete_all()

book1 = Book.new({ 'title' => 'Catch 22', 'author' => 'J. Heller'})
book2 = Book.new({ 'title' => 'Necronomicon', 'author' => 'H.P.Lovecraft'})
book3 = Book.new({ 'title' => 'American Gods', 'author' => 'N.Gaiman'})
book3 = Book.new({ 'title' => 'Fishing For Arseholes', 'author' => 'J.R. Hartley'})
b1 = book1.save
b2 = book2.save
b3 = book3.save
b4 = book4.save

member1 = Member.new({ 'name' => 'Conan the Librarian', 'address' => 'Cimmeria'})
member2 = Member.new({ 'name' => 'Lisa Simpson', 'address' => 'Springfield'})
member3 = Member.new({ 'name' => 'Charles Xavier', 'address' => 'Xavier Estate'})
m1 = member1.save
m2 = member2.save
m3 = member3.save

rental1 = Rental.new( {"book_id" => b1.id, 'member_id' =>m1.id}) .save()
rental2 = Rental.new( {"book_id" => b2.id, 'member_id' =>m2.id}) .save()