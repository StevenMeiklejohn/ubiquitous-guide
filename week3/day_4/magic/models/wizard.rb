require( 'pg' )
require_relative('../db/sql_runner')

class Wizard

attr_reader( :id, :name )

def initialize( options )
  @id = options['id'].to_i
  @name = options['name']
end

def save()
  sql = "INSERT INTO wizards (name) VALUES ('#{ @name }') RETURNING *"
  return Wizard.map_item( sql )
end

def self.all()
  sql = "SELECT * FROM wizards"
  return Wizard.map_items(sql)
end

def self.delete_all
  sql = "DELETE FROM wizards"
  SqlRunner.run(sql)
end

def magical_items
  sql = "SELECT m from magical_items m
  INNER JOIN sleeves ws
  ON ws.magical_item_id = m.id
  WHERE wizard_id = #{@id};"
  return Magical_item.map_items(sql)
end

def self.map_items(sql)
  wizards = SqlRunner.run( sql )
  result = wizards.map { |wizard| Wizard.new(wizard)}
  return result
end

def self.map_item(sql)
  result = Wizard.map_items(sql)
  return result.first
end



end