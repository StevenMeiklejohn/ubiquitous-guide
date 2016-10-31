require( 'pg' )
require_relative( '../db/sql_runner.rb')
require_relative( './albums.rb')


class Artist

  attr_accessor( :id, :name )
  # attr_reader( :id )


  def initialize( options )
    @id = options['id'].to_i
    @name = options['name']
#    @album_name = options['artist_id'].to_i
  end

  def save
#Returning * will return everything the method saves in an object hash, instead of returning nil.
    sql = "INSERT INTO artists (name) VALUES (
    '#{@name}') RETURNING *"
    artist = SqlRunner.run( sql ).first
    #We add .first as sql will return the data as an array (of hashes), i.e. one item in an array. the .first method removes the array 'casing' there by returning a hash which fits with our options hash.
    result = Artist.new( artist )
    return result
  end


  def albums
    sql = "SELECT name FROM albums 
    WHERE artist_id = #{@id}"
    #@id is in reference to @artist_id in the album.rb, but since we are currently in artist, we can say @id.
     albums = SqlRunner.run( sql )
     #map the results to an array. There are more than one results. Uses Album.new to return hashes of new albums.
     result = albums.map { |album| Album.new( album ) }
     return result
  end




end
