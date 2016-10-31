require ('sinatra')
require ('sinatra/contrib/all') if development?
require ('pry-byebug')
require ('./models/calculator.rb')
require ('json')


get '/' do
  erb :home
end

get '/about_us' do
  erb :about_us
end

get '/add/:num1/:num2' do
  calculator = Calculator.new(params[:num1].to_i, params[:num2].to_i)
  # return "#{calculator.add()}"
  # returns a string
  @calculation = calculator.add()
  erb( :result )
end

get '/divide/:num1/:num2' do
  calculator = Calculator.new(params[:num1].to_i, params[:num2].to_i)
 return "#{calculator.divide}"
end

get '/multiply/:num1/:num2' do
  calculator = Calculator.new(params[:num1].to_i, params[:num2].to_i)
  return "#{calculator.multiply}"
end

get '/subtract/:num1/:num2' do
  calculator = Calculator.new(params[:num1].to_i, params[:num2].to_i)
  return "#{calculator.subtract}"
end

get '/all/:num1/:num2' do
  content_type( :json )

  calculator = Calculator.new(params[:num1].to_i, params[:num2].to_i)
  results= {
    add: calculator.add(),
    subtract: calculator.subtract(),
    divide: calculator.divide(),
    multiply: calculator.multiply()
    }
    return results.to_json
  end
