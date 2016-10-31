PRODUCTS = [
  {bay: 'a10', name: "rubber band"},
  {bay: 'a9', name: "glowstick"},
  {bay: 'a8', name: "model car"},
  {bay: 'a7', name: "bookmark"},
  {bay: 'a6', name: "shovel"},
  {bay: 'a5', name: "rubberduck"},
  {bay: 'a4', name: "hanger"},
  {bay: 'a3', name: "blouse"},
  {bay: 'a2', name: "stop sign"},
  {bay: 'a1', name: "needle"},
  {bay: 'c1', name: "rusty nail"},
  {bay: 'c2', name: "drill press"},
  {bay: 'c3', name: "chalk"},
  {bay: 'c4', name: "wordsearch"},
  {bay: 'c5', name: "thermometer"},
  {bay: 'c6', name: "face wash"},
  {bay: 'c7', name: "paint brush"},
  {bay: 'c8', name: "candy wrapper"},
  {bay: 'c9', name: "shoe lace"},
  {bay: 'c10', name: "leg warmers"},
  {bay: 'b1', name: "tyre swing"},
  {bay: 'b2', name: "sharpie"},
  {bay: 'b3', name: "picture frame"},
  {bay: 'b4', name: "photo album"},
  {bay: 'b5', name: "nail filer"},
  {bay: 'b6', name: "tooth paste"},
  {bay: 'b7', name: "bath fizzers"},
  {bay: 'b8', name: "tissue box"},
  {bay: 'b9', name: "deodorant"},
  {bay: 'b10', name: "cookie jar"}
]

def item_at_bay(bay)
  result = PRODUCTS.find { |item|
  item[:bay] == bay}
  return result[:name]
end

def bay_for_item(product)
  result = PRODUCTS.find { |item| item[:name] == product}
  return result[:bay]
end

def items_at_bays(bays)
  items = PRODUCTS.select { |product| bays.include?(product[:bay]) }
  items.map { |item| item[:name] }
end

def find_bays_for_items(items)
items = PRODUCTS.select { |product| items.include?(product[:name]) }
items.map { |item| item[:bay] }
end
















  # def item_at_bay(bay)
  #   result = PRODUCTS.find {|item| item[:bay]==bay}w
  #   return result[:name]
  # end



    
  


