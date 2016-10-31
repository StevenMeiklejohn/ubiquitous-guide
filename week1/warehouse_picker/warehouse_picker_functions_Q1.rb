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

puts "Input warehouse location"
# def item_at_bay(location)
location=gets.chomp
location_first=location.chars.first
location_sym=location.to_sym
if location_first=="a"
    hash="warehouse_a"
  elsif location_first=="b"
    hash="warehouse_b"
  else
    hash="warehouse_c"
end
puts warehouse[hash][location_sym]
#end


  








