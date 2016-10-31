require( 'sinatra' )
require( 'sinatra/contrib/all' )
require('pry-byebug')

require_relative( './models/employee' )
require_relative( './models/client' )
require_relative( './models/shift' )
require_relative( './controllers/employee_controller.rb' )
require_relative( './controllers/client_controller.rb' )
require_relative( './controllers/shift_controller.rb' )

get( '/healthcare' ) do 
  @employees = Employee.all()
  @clients = Client.all()
  @shifts = Shift.all()
  erb( :index )
end


