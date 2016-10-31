require_relative( 'models/pokemon.rb' )
require_relative( 'models/trainer.rb' )
require_relative( 'models/owned_pokemon.rb' )

require( 'pry-byebug' )

OwnedPokemon.delete_all
Trainer.delete_all
Pokemon.delete_all

trainer1 = Trainer.new({ 'name' => 'Tony' })
trainer2 = Trainer.new({ 'name' => 'Valerie' })

t1 = trainer1.save()
t2 = trainer2.save()

pokemon1 = Pokemon.new({ 'name' => 'Charmander'})
pokemon2 = Pokemon.new({ 'name' => 'Pikachu' })

p1 = pokemon1.save()
p2 = pokemon2.save()

entry1 = OwnedPokemon.new({ 'trainer_id' => t1.id , 'pokemon_id' => p1.id })
entry2 = OwnedPokemon.new({ 'trainer_id' => t2.id , 'pokemon_id' => p1.id })
entry3 = OwnedPokemon.new({ 'trainer_id' => t2.id , 'pokemon_id' => p2.id })

e1 = entry1.save()
e2 = entry2.save()
e3 = entry3.save()

# CREATE A MODELS CONSOLE
binding.pry
nil
