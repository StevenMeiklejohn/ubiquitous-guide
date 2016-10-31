require( 'pg' )
require_relative( '../db/sql_runner.rb')


class Album

  def initialize( options )
    @id = options['id'].to_i
    @name = options['name']
    #The CREATE album table in the music_library.sql 'references' the artist_id, so we include it here too.
    @artist_id = options['artist_id'].to_i
  end

    def save
  #Returning * will return everything the method saves in an object hash, instead of returning nil.
      sql = "INSERT INTO albums (name, artist_id) 
      VALUES 
      ('#{@name}',
      #{@artist_id}) 
      RETURNING *"
      album = SqlRunner.run( sql ).first
      #We add .first as sql will return the data as an array (of hashes), i.e. one item in an array. the .first method removes the array 'casing' there by returning a hash which fits with our options hash.
      result = Album.new( album )
      return result

    end

    def artist
      sql = "SELECT * FROM artists 
      WHERE id = #{@artist_id}"
     # sql command to select name from the artist table where album id (current object so just id) = @artist_id (id from artist.rb)
       artist = SqlRunner.run( sql )
       #result is the result of feeding this method(artist, array index 0) into Artist.new (instantiate artist)
       result = Artist.new( artist[0] )
       return result
    end



    def self.find( id )
      sql = "SELECT * FROM albums WHERE id = #{id}"
      # #{id} refers to the id parameter being passed in.
      album = SqlRunner.run( sql ).first
      #map or new up the result as desired.
      result = Album.new( album )
      return result
    end


end
