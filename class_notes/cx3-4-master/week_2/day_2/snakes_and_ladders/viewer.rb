class Viewer

  def replay(log)
    for item in log
      puts "#{item.player.name} rolled #{item.roll}"
      if(item.modifier != 0)
        puts "#{item.player.name} hit a #{item.modifier_type}! Moves #{item.modifier}"
      end
    end
    puts "The winner is #{item.player.name}"
  end
  
end