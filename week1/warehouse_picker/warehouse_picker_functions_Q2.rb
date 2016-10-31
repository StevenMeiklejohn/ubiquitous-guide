# warehouse = {0 => "Zero", 1 => "One", :two => "Two"}

# puts warehouse.key("Two")

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

puts "Input warehouse item"
item=gets.chomp

puts warehouse["warehouse_a"].key(item)
puts warehouse["warehouse_b"].key(item)
puts warehouse["warehouse_c"].key(item)



