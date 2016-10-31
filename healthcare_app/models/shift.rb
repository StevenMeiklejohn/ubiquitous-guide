require( 'pg' )
require_relative('../db/sql_runner')

class Shift

  attr_reader( :id, :employee_id, :client_id, :shift_report, :shift_date, :shift_time, :shift_status )

  def initialize( options )
    @id = options['id'].to_i
    @employee_id = options['employee_id'].to_i
    @client_id = options['client_id'].to_i
    @shift_report = options['shift_report']
    @shift_date = options['shift_date']
    @shift_time = options['shift_time']
    @shift_status = options['shift_status']
  end

  def save()
    sql = "INSERT INTO shifts (
    employee_id, 
    client_id, 
    shift_report, 
    shift_date, 
    shift_time,
    shift_status
    ) VALUES (
    '#{@status}'
    '#{@employee_id}', 
    '#{@client_id}', 
    '#{@shift_report}', 
    '#{ @shift_date }', 
    '#{ @shift_time }',
    '#{ @shift_status }' 
    ) RETURNING *"
    data = SqlRunner.run(sql).first
    result = Shift.new( data )
    return result
  end

  def self.all()
    sql = "SELECT * FROM shifts"
    shifts = SqlRunner.run( sql )
    result = shifts.map { |s| Shift.new( s ) }
    return result
  end

  def self.update( options )
    SqlRunner.run(  
    "UPDATE shifts SET 
    employee_id ='#{options['employee_id']}',
    client_id ='#{options['client_id']}',
    shift_report = '#{options['shift_report']}',
    shift_date = '#{options['shift_date']}',
    shift_time = '#{options['shift_time']}',
    shift_status = '#{options['shift_status']}'
    WHERE id=#{options['id']}"
    ) 
  end

  def self.find( id )
    shifts = SqlRunner.run( "SELECT * FROM shifts WHERE id=#{id}" ) 
    result = Shift.new( shifts.first )
    return result
  end

  def self.delete_all()
    sql = "DELETE FROM shifts"
    SqlRunner.run(sql)
  end


  def employee()
    sql = "SELECT * FROM employees WHERE id = #{ @employee_id }"
    employee = SqlRunner.run( sql )
    result = Employee.new( employee.first )
    return result
  end


  def client()
    sql = "SELECT * FROM clients WHERE id = #{ @client_id }"
    client = SqlRunner.run( sql )
    result = Employee.new( client.first )
    return result
  end
  

  def self.available
    av_shifts = Array.new
    sql = "SELECT * FROM shifts"
    shifts = SqlRunner.run( sql )
    for shift in shifts
      
      if shift['shift_status'] == 'available'
        av_shifts << Shift.new(shift)
      end
    end
    return av_shifts
 end



  def self.all()
    sql = "SELECT * FROM shifts"
    shifts = SqlRunner.run( sql )
    result = shifts.map { |s| Shift.new( s ) }
    return result
  end


end
