require( 'pg' )
require_relative('../db/sql_runner')

class Analysis

  def max_shift_alert
    if employee.employee_shifts > 10
      return
end


end
