

puts "Result: (Number between 1 and 10)"
score = gets.chomp.to_i

result = case score
  when 10
    'genius'
  when 8..9
    'merit'
  when 5..7
    'pass'
  else
    'fail'
  end

  puts result


