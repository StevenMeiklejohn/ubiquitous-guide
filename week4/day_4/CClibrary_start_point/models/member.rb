require('pg')
require_relative('../db/sql_runner')

class Member

  attr_reader :id, :name, :address

  def initialize( options )
    @id = options['id'].to_i
    @name = options['name']
    @address = options['address']
  end

  def save()
    sql = "INSERT INTO members (name, address) VALUES ('#{@name}', '#{@address}' ) RETURNING *"
    member = SqlRunner.run_sql(sql).first
    return Member.new(member)
  end

  def self.all()
    sql = "SELECT * FROM members"
    return Member.map_items(sql)
  end

  def self.delete_all()
    sql = "DELETE FROM members"
    SqlRunner.run_sql(sql)
  end

  def self.map_items(sql)
    member = SqlRunner.run_sql(sql)
    result = member.map { |product| Member.new( product ) }
    return result
  end

  def self.map_item(sql)
    result = Member.map_items(sql)
    return result.first
  end

end
