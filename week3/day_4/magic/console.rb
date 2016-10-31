require_relative('models/wizard.rb')
require_relative('models/magical_items.rb')
require_relative('models/wizards_sleeve.rb')

require ( 'pry-byebug' )

Wizards_sleeve.delete_all
Wizard.delete_all
Magical_item.delete_all


magical_item1 = Magical_item.new ( { 'name' => 'The holy hand grenade of antiok' } )
magical_item2 = Magical_item.new ( { 'name' => 'The examination gauntlet' } )
magical_item3 = Magical_item.new ( { 'name' => 'The stick of truth'} )

m1 = magical_item1.save
m2 = magical_item2.save
m3 = magical_item3.save

wizard1 = Wizard.new( { 'name' => 'Tim the Enchanter' } )
wizard2 = Wizard.new( { 'name' => 'Bruce the Immolator' } )
wizard3 = Wizard.new( { 'name' => 'Grey Gary' } )


w1 = wizard1.save
w2 = wizard2.save
w3 = wizard3.save

sleeve1 = Wizards_sleeve.new( { 'wizard_id' => w1.id, 'magical_item_id' => m1.id } )
sleeve2 = Wizards_sleeve.new( { 'wizard_id' => w2.id, 'magical_item_id' => m2.id } )
sleeve3 = Wizards_sleeve.new( { 'wizard_id' => w3.id, 'magical_item_id' => m3.id } )

ws1 = sleeve1.save
ws2 = sleeve2.save
ws3 = sleeve3.save


binding.pry
nil