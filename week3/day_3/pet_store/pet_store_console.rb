require_relative( './models/pet_store.rb' )
require_relative( './models/pets.rb' )

require( 'pry-byebug' )


  

pet_store1 = Pet_store.new( 
  { 'name' => 'Heavy Petting', 
  'address' => '12 Shotgun Alley',
   'stock_type' => 'allsorts'} ).save


Pet1 = Pets.new( { 
  'name' => 'Mr Bojangles',
  'pet_type' => 'cat',
  'shop_id' => pet_store1.id } ).save

Pet2 = Pets.new( { 
  'name' => 'Special Patrol Group',
  'pet_type' => 'hamster',
  'shop_id' => pet_store1.id } ).save

Pet3 = Pets.new( { 
  'name' => 'Babs',
  'pet_type' => 'tiger',
  'shop_id' => pet_store1.id } ).save


binding.pry
nil