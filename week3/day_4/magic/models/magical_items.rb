require( 'pg' )
require_relative('../db/sql_runner')

class Magical_item

  attr_reader( :id, :name )

  def initialize( options )
    @id = options['id'].to_i
    @name = options['name']
  end

  def save()
    sql = "INSERT INTO magical_items (name) VALUES
    ('#{ @name }') RETURNING *"
    return Magical_item.map_item( sql )
   end

   def self.all()
    sql = "SELECT * FROM magical_items"
    return Magical_item.map_items( sql )
  end

  def self.delete_all()
    sql = "DELETE FROM magical_items"
    SqlRunner.run(sql)
  end

  def wizards()
    sql = "SELECT w.* FROM wizards w
          INNER JOIN sleeves ws
          ON ws.wizard_id = w.id
          WHERE magical_item_id = #{@id};"
          return Wizard.map_items(sql)
  end

  def self.map_items(sql)
    function = SqlRunner.run(sql)
    result = function.map { |item| Magical_item.new( item ) }
    return result
  end

  def self.map_item( sql )
    result = Magical_item.map_items( sql )
    return result.first
  end


end