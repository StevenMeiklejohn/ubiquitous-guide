require_relative('../models/member.rb')


get '/members' do
  @members = Member.all()
  erb :'members/index'
end

get '/members/new' do
  erb :'members/new'
end

get '/members/:id' do
  erb :'members/show'
end

get '/members/:id/edit' do
end

post '/members' do
  @member = Member.new(params)
  @member.save
  redirect to('/members')
end

post '/members/:id' do
end

delete '/members' do
end