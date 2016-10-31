

def add_one(items)
  result=[]

  for item in items
    result << item +1
  end
  return result
end

def multiply_by_two(items)
  result=[]
  for item in items
    result << item *2
  end
  return result
end

def up_to_you
  name = "Valerie"
  return yield(name)
end

def map(items)
  result=[]
  for item in items
    result << yield(item)
  end
  return result

end








