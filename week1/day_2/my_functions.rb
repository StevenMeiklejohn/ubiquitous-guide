def my_name()
  name = "Steve"
  return name
end

def not_my_name
  name = "Not my name"
  return name
end



def game_of_thrones_rocks?(name)
  if name == "Val1"
return false
elseif name == "Aiden"
return true
else
  return "No idea"
end
end

puts game_of_thrones_rocks? ("Mike")
puts not_my_name()

def greet(first_name, last_name)
  puts "Hello, #{first_name} #{last_name}"
end

greet("John", "Smith")


def weather_func()
  puts "How is the weather? (good, great, Scottish)"
  weather = gets.chomp.downcase
    puts "The weather is #{weather}"
end

weather_func()

def weather_temp()
  puts "What is the temperature?"
  temp = gets.chomp.to_i
  if temp >=20
    puts "That's cool"
  else
    puts "That's freezing"
  end
end

weather_temp()



