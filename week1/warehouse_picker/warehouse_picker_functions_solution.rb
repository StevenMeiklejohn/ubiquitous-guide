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
  for product in PRODUCTS
    return product[:name] if product[:bay] == bay
  end
  return "item not found"
end

def find_bay_for_item(item)
  for product in PRODUCTS
    return product[:bay] if product[:name] == item
  end
  return "bay not found"
end

def items_at_bays(bays)
  items = []
  for product in PRODUCTS
    items << product[:name] if bays.include?(product[:bay])
  end
  return items
end

def find_bays_for_items(items)
  bays = []
  for product in PRODUCTS
    bays << product[:bay] if items.include?(product[:name])
  end
  return bays
end

def distance_between_bays(bays)
  distance = 0
  distances = []
  for bay in bays
    distances << index_of_bay(bay)
  end
  min_index, max_index = distances.minmax
  return max_index - min_index
end

def index_of_bay(bay_name)
  index = 0
  counter = 0
  for product in PRODUCTS
    index = counter if product[:bay] == bay_name
    counter += 1
  end
  return index
end

def items_at_bays_with_distance(bays)
  return {items: items_at_bays(bays), distance: distance_between_bays(bays)}  
end

def sort_bays(bays)
  indexes = []
  for bay in bays
    indexes << index_of_bay(bay)
  end
  indexes.sort!
  products = []
  for index in indexes
    products << PRODUCTS[index][:bay]
  end
  return products
end

def sorted_bays_for_items(items)
  sort_bays( find_bays_for_items(items) )
end

