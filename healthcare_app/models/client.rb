require( 'pg' )
require_relative('../db/sql_runner')

class Client

  attr_reader( :id, :name, :image, :address, :requirements )

  def initialize( options )
    @id = options['id'].to_i
    @name = options['name']
    @image = options['image']
    @address = options['address']
    @requirements = options['requirements']
  end

  def save()
    sql = "INSERT INTO clients (name, image, address, requirements) VALUES ('#{@name}', '#{@image}', '#{@address}', '#{@requirements}' ) RETURNING *"
    data = SqlRunner.run(sql).first
    result = Client.new( data )
    return result
  end

  def self.delete_all()
    sql = "DELETE FROM clients"
    SqlRunner.run(sql)
  end

  def self.all()
    sql = "SELECT * FROM clients"
    clients = SqlRunner.run( sql )
    result = clients.map { |s| Client.new( s ) }
    return result
  end

  def self.update( options )
    SqlRunner.run(  
    "UPDATE clients SET 
    name ='#{options['name']}',
    image='#{options['image']}',
    address ='#{options['address']}',
    requirements = '#{options['requirements']}'
    WHERE id=#{options['id']}"
    ) 
  end

  def self.find( id )
    clients = SqlRunner.run( "SELECT * FROM clients WHERE id=#{id}" ) 
    result = Client.new( clients.first )
    return result
  end



end
