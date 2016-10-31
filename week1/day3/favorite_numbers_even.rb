users = {
  "Jonathan" => {
    :twitter => "jonnyt",
    :favorite_numbers => [12, 42, 75, 12, 5],
    :home_town => "Stirling",
    :pets => {
      "fluffy" => :cat,
      "fido" => :dog,
      "spike" => :dog
    }
  },
  "Erik" => {
    :twitter => "eriksf",
    :favorite_numbers => [8, 12, 24],
    :home_town => "Linlithgow",
    :pets => {
      "blinky" => :fish,
      "kevin" => :fish,
      "spike" => :dog,
      "fang" => :parrot
    }
  },
  "Anil" => {
    :twitter => "bridgpally",
    :favorite_numbers => [12, 14, 85, 88],
    :home_town => "Dunbar",
    :pets => {
      :colin => :snake
    }
  },
}


# anil_array = []
# for num in users ["Anil"] [:favorite_numbers]
#   if num%2==0
#     anil_array.push(num)
#   end
# end

# puts anil_array

result = []
for num in users["Anti"][:favorite_numbers
result << num if num.even?
end
puts result




