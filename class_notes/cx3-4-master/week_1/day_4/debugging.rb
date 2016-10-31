require( 'pry-byebug' )

def print_score( results )
  binding.pry
  for score in results
    puts score
  end

end

print_score( [ 2,5,6,7 ] )


