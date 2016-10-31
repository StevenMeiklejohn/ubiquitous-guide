
User.delete_all
Account.delete_all

user1 = User.create!( {email: 'steve@gmail.com', password:'password', password_confirmation: 'password' } )

user2 = User.create!( {email: 'Aiden@gmail.com', password:'password', password_confirmation: 'password' } )

user3 = User.create!( {email: 'Jay@gmail.com', password:'password', password_confirmation: 'password' } )


acc1 = Account.create!( { acc_type: 'peronal', balance: 100, user_id: user1.id } )
acc2 = Account.create!( { acc_type: 'business', balance: 200, user_id: user1.id } )

acc3 = Account.create!( { acc_type: 'peronal', balance: 150, user_id: user2.id } )
acc4 = Account.create!( { acc_type: 'business', balance: 100, user_id: user2.id } )

acc5 = Account.create!( { acc_type: 'peronal', balance: 1000, user_id: user3.id } )
acc6 = Account.create!( { acc_type: 'business', balance: 300, user_id: user3.id } )








