require( 'pg' )

class Wizards_sleeve

  attr_accessor :id, :wizard_id, :magical_item_id

  def initialize( options )
    @id = options['id'].to_i
    @wizard_id = options['wizard_id'].to_i
    @magical_item_id = options['magical_item_id'].to_i
  end

  def save
    sql = "INSERT INTO sleeves (wizard_id, magical_item_id) VALUES (#{@wizard_id}, #{@magical_item_id}) RETURNING *;"
    return Wizards_sleeve.map_item( sql )
  end

  def self.all
    sql = "SELECT * FROM sleeves"
    return Wizards_sleeve.map_items(sql)
  end


  def self.delete_all
    sql = "DELETE FROM sleeves"
    SqlRunner.run(sql)
  end

  def self.map_items(sql)
    sleeves = SqlRunner.run(sql)
    result = sleeves.map { |data| Wizards_sleeve.new(data)}
    return result
  end

  def self.map_item(sql)
    result = Wizards_sleeve.map_items(sql)
    return result.first
  end

end