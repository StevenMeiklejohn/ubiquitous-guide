require( 'pg' )
require_relative( '../db/sql_runner' )
require_relative( '../models/album' )

class Artist

  attr_reader( :id, :name )

  def initialize( options )
    @id = options['id'].to_i
    @name = options['name']
  end

  def save()
    sql = "INSERT INTO artists (name) VALUES ('#{ @name }') RETURNING *"
    artist = SqlRunner.run( sql ).first
    result = Artist.new( artist )
    return result
  end

  def albums()
    sql = "SELECT * FROM albums WHERE artist_id = #{ @id }"
    albums = SqlRunner.run( sql )
    result = albums.map { |a| Album.new( a ) }
    return result
  end

  def self.all()
    sql = "SELECT * FROM artists"
    artists = SqlRunner.run( sql )
    result = artists.map { |a| Artist.new( a ) }
    return result
  end

  def self.find( id )
    artists = SqlRunner.run( "SELECT * FROM artists WHERE id=#{id}" ) 
    result = Artist.new( artists.first )
    return result
  end

  def self.update( options )
      SqlRunner.run(  
        "UPDATE artists SET 
          name='#{options['name']}'
          WHERE id=#{options['id']}"
      ) 
  end

  def self.destroy( id )
    sql = "DELETE FROM artists WHERE id=#{id}"
    SqlRunner.run( sql )
  end

end