# lines = ['Gyle Centre', 'Edinburgh Park', 'Murrayfield Stadium', 'Haymarket', 'Princes Street']

# #A Question 1.

# Work out how many stops there are in the lines array
# lines.count

# Return 'Edinburgh Park' from the array
# lines[1]


# How many ways can we return 'Princes Street' from the array?
# lines[4]
# lines[-1]
# lines.at(4)
# lines.fetch(4)
# lines.last


# Work out the index position of 'Haymarket'
# index = 4

# Add 'Airport' to the start of the array
# lines.unshift('airport')

# Add 'York Place' to the end of the array
# lines.push('York_Place')

# Remove 'Edinburgh Park' from the array using it's name
# lines.delete('Edinburgh Park')

# lines.insert(2, "Edinburgh_Park")

# Delete 'Edinburgh Park' from the array by index
# lines.delete_at(2)

# Reverse the positions of the stops in the array
# lines.reverse

# Print out all of the stops using loop / while / until / for
# lines = ['Gyle Centre', 'Edinburgh Park', 'Murrayfield Stadium', 'Haymarket', 'Princes Street']
# lines.each { |x| puts x }

# or.......
# for stop in lines
#   puts lines
# end

# or......
# while i < lines.length do
#   puts lines[i]
#   i+=1
# end

# or
# maxnum = lines.length
# until i < maxnum
#   puts lines[i]
#   i +=1
# end

# Question B

# my_hash = {0 => "Zero", 1 => "One", :two => "Two", "two" => 2}

# How would you return the string "One"?
# puts my_hash [1]

# How would you return the string "Two"?
# puts my_hash [2]

# How would you return the number 2?
# puts my_hash["two"]

# How would you return the number 2?
# my_hash[3] = "Three"

# How would you add {:four => 4} to the hash?
# my_hash[:four] = 4

# Question C

# Given the following data structure,

# users = {
#   "Jonathan" => {
#     :twitter => "jonnyt",
#     :favorite_numbers => [12, 42, 75, 12, 5],
#     :home_town => "Stirling",
#     :pets => {
#       "fluffy" => :cat,
#       "fido" => :dog,
#       "spike" => :dog
#     }
#   },
#   "Erik" => {
#     :twitter => "eriksf",
#     :favorite_numbers => [8, 12, 24],
#     :home_town => "Linlithgow",
#     :pets => {
#       "blinky" => :fish,
#       "kevin" => :fish,
#       "spike" => :dog,
#       "fang" => :parrot
#     }
#   },
#   "Anil" => {
#     :twitter => "bridgpally",
#     :favorite_numbers => [12, 14, 85, 88],
#     :home_town => "Dunbar",
#     :pets => {
#       :colin => :snake
#     }
#   },
# }

# Return Jonathan's Twitter handle (i.e. the string "jonnyt")
# users["Jonathan"] [:twitter]

# Return Erik's hometown
# users["Erik"] [:home_town]

# Return the array of Erik's favorite numbers
# users["Erik"] [:favorite_numbers]

# Return the type of Anil's pet Colin
# users["Anil"] [:pets] [:colin]

# Return the smallest of Erik's favorite numbers
# users["Erik"] [:favorite_numbers].min



# Return an array of Anil's favorite numbers that are even
# anil_array = []
# for num in users ["Anil"] [:favorite_numbers]
#   if num%2==0
#     anil_array.push(num)
#   end
# end
# puts anil_array

# Return an array of Jonathans favourite numbers, sorted in ascending order and excluding duplicates


# Add the number 7 to Erik's favorite numbers
# users[Erik"] [:favorite_numbers].push(7)

# Change Erik's hometown to Edinburgh
# users["Eric"][:home_town] = "Edinburgh"

# Add a pet dog to Erik called "Fluffy"
users ["Eric"] [:pets] [:dog] = "fluffy"


# Add yourself to the users hash

users ["Steve"] =>d {:twitter => "Steve", :favorite_numbers => [6, 8, 10,] :home_town => "Glasgow"}



