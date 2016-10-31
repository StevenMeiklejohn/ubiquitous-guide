
warehouse = {
  "warehouse_a" =>{
  :a1 => "needle",
  :a2 => "stop sign",
  :a3 => "blouse",
  :a4 => "hanger",
  :a5 => "rubber duck",
  :a6 => "shovel",
  :a7 => "bookmark",
  :a8 => "model car",
  :a9 => "glow stick",
  :a10 => "rubber band",
  },
  "warehouse_b" =>{
  :b1 => "tyre swing",
  :b2 => "sharpie",
  :b3 => "picture frame",
  :b4 => "photo album",
  :b5 => "nail filer",
  :b6 => "tooth paste",
  :b7 => "bath fizzers",
  :b8 => "tissue box",
  :b9 => "deodorant",
  :b10 => "cookie jar",
  },
  "warehouse_c" =>{
  :c1 => "rusty nail",
  :c2 => "drill press",
  :c3 => "chalk",
  :c4 => "word search",
  :c5 => "thermometer",
  :c6 => "face_wash",
  :c7 => "paintbrush",
  :c8 => "candy wrapper",
  :c9 => "shoe lace",
  :c10 => "leg warmers",
  }
}


puts 'Please enter 1st store item.'
input=gets.chomp
input_array=[]
input_array.push input

puts 'Please enter 2nd store item.'
input=gets.chomp
input_array.push input

puts 'Please enter 3rd store item.'
input=gets.chomp
input_array.push input

output_array=[]
for item in input_array
  output_array.push warehouse["warehouse_a"].key(item)
  output_array.push warehouse["warehouse_b"].key(item)
  output_array.push warehouse["warehouse_c"].key(item)
end


# for item in input_array
#   if warehouse["warehouse_a"].key(item)
#   output_array.push warehouse["warehouse_a"].key(item)
#   elsif warehouse["warehouse_b"].key(item)
#   output_array.push warehouse["warehouse_b"].key(item)
#   else output_array.push warehouse["warehouse_c"].key(item)
#   end
# end

puts output_array


