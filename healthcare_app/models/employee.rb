require( 'pg' )
require( 'pry-byebug')
require_relative('../db/sql_runner')
require_relative( 'shift' )

class Employee

  attr_accessor( :id, :name, :bio, :image, :start_date )

  def initialize( options )
    @id = nil || options['id'].to_i
    @name = options['name']
    @bio = options['bio']
    @image = options['image']
    @start_date = options['start_date']
  end

  def save()
    sql = "INSERT INTO employees (name, bio, image, start_date) VALUES ('#{ @name }', '#{ @bio }', '#{ @image }', '#{ @start_date }') RETURNING *"
    data = SqlRunner.run( sql ).first
    result = Employee.new( data )
    return result
  end

  def self.all()
    sql = "SELECT * FROM employees"
    employees = SqlRunner.run( sql )
    result = employees.map { |s| Employee.new( s ) }
    return result
  end

  def self.delete_all()
    sql = "DELETE FROM employees"
    SqlRunner.run(sql)
  end

  def self.find( id )
    employees = SqlRunner.run( "SELECT * FROM employees WHERE id=#{id}" ) 
    result = Employee.new( employees.first )
    return result
  end

  def self.update( options )
      SqlRunner.run(  
        "UPDATE employees SET 
        name = '#{options['name']}',
        bio = '#{options['bio']}',
        image = '#{options['image']}',
        start_date = '#{options['start_date']}'
        WHERE id = #{options['id']}"
      ) 
  end

def employee_shifts()
  shifts = Shift.all
  total = 0
  shifts.each do |shift|
    total += 1 if shift.employee_id == @id
  end
  return total
end



end
