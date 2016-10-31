# Initial setup
# createdb music_library
# mkdir music_library
# cd music_library 
# touch console.rb
# mkdir db models
# touch db/music_library.sql
# fill in music_library.sql

# then, in console, type..... psql -d music_library -f db/music_library.sql

# now we have set up our tables.

# setup models.
# fill in music_library.sql

# create sql_runner class. This means we don't need to type the sql comms info in every method.
# touch db/sql_runner.rb

# create album class by filling in albums.rb
# see notes in albums.rb file.

# create artist class by filling in artist.rb
# see notes in artist.rb file

# Time to play around........

# ruby console.rb

require_relative( './models/albums' )
require_relative( './models/artist' )

require( 'pry-byebug' )


  

artist1 = Artist.new( { 'name' => 'Blur' } ).save()
#Instantiate new artist and perform the method save on it.
album1 = Album.new( { 'name' => 'Modern Life Is Rubbish', 'artist_id' => artist1.id }).save
album2 = Album.new( { 'name' => 'Parklife', 'artist_id' => artist1.id } ).save

#instantiate album and save.

binding.pry
nil



############################################
#Now we add some more methods to the artist.rb and albums.rb
# re-run ruby console.rb.







