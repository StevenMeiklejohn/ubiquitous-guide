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

end