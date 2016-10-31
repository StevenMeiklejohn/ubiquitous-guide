class Bear

attr_accessor :bear_name, :type, :tummy

def initialize(bear_name, type)
@bear_name = bear_name
@type = type
@tummy = []
end

# def roar
#  return "Rooooooar"
# end
# we could also make name of the bear roaring appear

def roar
  if @type == "grizzly"
 return "#{bear_name} is Rooooooaring"
else
  puts "#{bear_name} is roaring"
end
end

def take_fish(river)
  fish = river.lose_fish()
  @tummy<<fish
end

end
