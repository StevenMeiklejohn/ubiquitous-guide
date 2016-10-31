require ('sinatra')
require ('sinatra/contrib/all') if development?


#get = method
#'/hi' = route

get '/hi' do
  return 'Hello world! My first Sinatra app'
end

get '/full_name' do
  return 'Steven James Meiklejohn'
end

get '/my_address' do 
  return '27 Meikle RD, Pollok, Glasgow, G525JD'
end

get '/my_favourite_book' do
  return '1984'
end

get '/name/:title/:firstname/:lastname' do
  puts "I'm putsing"
  #puts prints to console
  return "Your title is: #{ params[:title] } #{params[:firstname] } #{params[:lastname]}"
end

