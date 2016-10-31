# Snakes and Ladders Lab

## Objectives

Reinforce everything we have learned about OO

## Duration

All day

# Intro

Today we are going to build a TDD snakes and ladders game, which might be hard to believe. The objective is not to have a fully functional game, but for us to explore what we have learned so far. If we don't get to the end result, we will learn a lot on the way so it's still cool. Ask lot's of questions, this is our time to consolidate our learning.

Cool so let's make a new directory.

```
mkdir snakes_and_ladders

```

Before we make a file, let's have a think about what we are going to need and what our assumptions are.

Let's use a 9x9 board that looks like this

```
[6] [7] [8]
[5] [4] [3]
[0] [1] [2]

```
We will start at 0, because arrays are indexed from 0, and it makes our lives a little easier. Let's add 1 snake and 1 ladder.

```
[l] [s] [e] 678
[e] [e] [e] 543
[s] [e] [l] 012
```
Our snake starts on 7, ends on 0. Our ladder starts on 2, ends on 6.

So we probably want to make a class to model our board. 

[i:] Give the class a little bit of time to discuss how they might model the board.

We are going to use a class which contains an array of the board state. We can then pass in the positions of the snakes and ladders in a hash.  If a key in the array is a ladder, it should be the positive value that is going to be added to the players position after their move. If it is negative, we take it away.

```
array = [0,0,4,0,0,0,0,-7,0]
```

There are a million different ways to do things, we're just running with this way.

# The Board

As always we will start with our test file. Let's make a folder called specs - this name is important for later so make sure it's spelled correctly!

```
mkdir specs
touch specs/board_spec.rb
```
We need to add the usual plumbing for tests.

```
#board_spec.rb
require 'minitest/autorun'
require_relative '../board'

class TestBoard < Minitest::Test

end
```

If we run this, we will get an error, because board does not exist. Let's make that file.

```
touch ../board.rb
```
The first thing we probably want to test is that we have 9 tiles.

```
#board_spec
def test_board_should_have_9_tiles
	@board = Board.new(9)
	assert_equal(9, @board.state.size)
end
```
Now we need to go and create a board class.

```
#board.rb
class Board
end
```
We now need to add our constructor.

```
#board
class Board
  def initialize(size)
    @state = Array.new(size)
  end
end
```

We are nearly there for passing our test - let's go and make the size property readable.

```
#board
class Board
  attr_reader :state
  def initialize(size)
    @state = Array.new(size)
  end
end
```
Awesome, we have a passing test.

It's going to get a bit tedious making a new board before every test, so let's use a sneaky class method where we only need to declare it once. Board now needs an "@" sign, since we want it available across the entire class.

```
#board_spec
  def setup
    @board = Board.new(9)
  end
```
We then need to add the @ symbol before our variable.

```
#board_spec
def test_board_should_have_9_tiles
    assert_equal(9, @board.state.size)
  end
```

The setup method makes the variables in it available acorss the class and also resets the state of the objects before every test. It's important that every test has it's own little world with a defined state - we don't want changes to persist across tests. We need to be sure of what the start and end state of our test will be.

Let's use this method to set up a hash with our snake and ladder.

```
#board_spec
def setup
    positions = {
      2 => 4,
      7 => -7,
    }
    @board = Board.new(9, positions)
  end
```

Positions doesn't need an @ sign, since it's a local variable to this method.

We want to test that the board has a snake at position 2 and a ladder at position 7. Let's write the tests.

```
#board_spec
 def test_position_2_is_a_ladder
    assert_equal(4, @board.state[2])
  end

  def test_position_7_is_a_snake
    assert_equal(-7, @board.state[7])
  end
```
Now we need to write the code to pass this. The first step is to fill our array of board state with zeros - luckily the constructor can be passed a default value.

```
#board
@state = Array.new(size,0)
```

For every key in our positions hash, we need to loop around our keys and the equivalent position in the array should be set to the hashes value.

```
#board
def initialize(size, positions)
    @state = Array.new(size,0)
	
    for key in positions.keys //NEW
      @state[key] = positions[key]
    end
  end
```

Cool, now our tests should pass. While we are at it, we should probably at a little method that returns the win tile, since we will no doubt need it later. We know that the winning tile is index 8 but our board needs to know this.

```
#board_spec
def test_win_tile
  assert_equal(8, @board.win_tile)
end
```
Now we need to add the code. We don't want to hard code 8, incase we change the size of the board. It will always be the size of the board minus one, so let's go with that.

```
#board
def win_tile
  @state.size - 1
end
```
Excellent, now we an get at the win tile when we need it.

# Players

The next thing we probably need is players. Again we will use the setup method, since we probably want to reuse the player in our tests.

```
#terminal
touch specs/player_spec.rb

#player_spec
require 'minitest/autorun'
require_relative '../player'

class TestPlayer < Minitest::Test

  def setup
    @player = Player.new()
  end

end
```
Now we need to make the file to make the setup stop erroring out.

```
touch player.rb

#player
class Player
end
```
Cool. Our player probably needs a name, so let's go add that.

```
#player_spec
  def setup
    @player = Player.new("Val") //UPDATE
  end

  def test_player_has_a_name
    assert_equal("Val", @player.name) //NEW
  end
```
Let's get this guy passing.

```
#player
attr_reader :name
  
  def initialize(name)
    @name = name
  end
```
Our player is going to keep a record of which tile they are on, which should start at 0.

```
#player_spec

def test_player_starts_at_tile_0 //NEW
    assert_equal(0, @player.position)
  end
 
```
Let's make this pass.

```
#player
class Player
  attr_reader :name, :position //UPDATE
    
    def initialize(name)
      @name = name
      @position = 0 //NEW
    end
end
```

We don't want anyone setting this value directly (it's internal state private to the object), instead we will provide a method by which user can move the player a number of squares.

```
#player_spec
 def test_player_can_move
    @player.move(5)
    assert_equal(5, @player.position)
  end
```
Let's add the passing code to a player.

```
#player
def move(spaces)
	@position += spaces
end
```

# Game

Now we need a game to bring together the board and the players.

```
#terminal
touch specs/game_spec.rb

#game_spec
require 'minitest/autorun'
require_relative '../game'
require_relative '../player'
require_relative '../board'

class TestGame < Minitest::Test
	def setup
	end
end
```
First let's create a board.

```
#game_spec
 def setup
    positions = { //NEW
      2 => 4,
      7 => -7,
    }

    board = Board.new(9, positions) //NEW
  end
```
Next, let's add 2 players. 

```
#game_spec
 def setup
    positions = {
      2 => 4,
      7 => -7,
    }

    board = Board.new(9, positions)

    @player1 = Player.new("Val") //NEW
    @player2 = Player.new("Rick") //NEW

  end
```
Lastly let's make a game that brings all of this together.

```
#game_spec
 def setup
    positions = {
      2 => 4,
      7 => -7,
    }

    board = Board.new(9, positions)

    @player1 = Player.new("Val")
    @player2 = Player.new("Rick")
    
    @players = [@player1, @player2] //NEW
    
    @game = Game.new(@players, board) //NEW
  end
```
Cool, so now we should have a big nasty error. Let's go make our game class.

```
#game
class Game
end
```
Great. The first thing we want to test is that the game starts with the correct number of players.

```
#game_spec
def test_game_starts_with_2_players
    assert_equal(2, @game.number_of_players)
  end
```
Let's go add this method. First we need to initialize the game to take in an array of players and a board, and set those to instance variables. Then add the method to count the number of players in the current game.

```
#game

  def initialize(players, board)
    @players = players
    @board = board
  end
  
 def number_of_players
    return @players.count
  end
```
Great a passing test! Nice. Next, we'd like some way of keeping track of the current player. Let's make the start player be player 1.

```
#game_spec
 def test_game_current_player_starts_as_player_1
    assert_equal(@player1, @game.current_player)
  end
```
Next let's add an instance variable that is read only - this should not be able to be modified outside of the class.

```
#game
   attr_reader :current_player //NEW

  def initialize(players, board)
    @players = players
    @board = board
    @current_player = players[0] //NEW
  end
```
Another passing test, fab. It's no use if the current player never changes, so let's make a way to update the current player.

```
#game_spec
  def test_can_update_current_player
    @game.update_current_player
    assert_equal(@player2, @game.current_player)
  end
```
Now we need the code to pass it.

```
#game
  def update_current_player
    @current_player = @players.rotate!
  end
```
The bang! is a special method which alters the actual array we call the method on. Rotate shifts everything across to the left 1 place, with the start item becoming the end.

Now the fun begins. We need to allow players to take a turn. A turn will involve a player moving a number of spaces, then we change the current player for the next turn to start.

```
#game_spec
def test_can_take_turn
    @game.next_turn(1)
    assert_equal(@player2,@game.current_player)
    assert_equal(1,@player1.position)
  end
```
Let's go implement this method. 

```
#game
def next_turn(spaces)
    @current_player.move(spaces)
    update_current_player
  end
```
Before we move on, we need to consider that a player should not be allowed to move past the end square of the board. One way we can address this is by checking if the distance from the player's current position to the end of the board is more or less than the amount of spaces they have rolled. If they have rolled more, they should not move past the final board tile.

```
#game_spec
  def test_cannot_move_beyond_end
    @game.next_turn(15)
    assert_equal(8, @player1.position)
  end
```
In this case, we don't want the player to be able to move to square 15, as our board only has 8 spaces.

We need to update the next_turn method to prevent this from happening.

```
#game.rb
  def next_turn(spaces)
    distance_to_end = @board.win_tile - @current_player.position //NEW
    movement = spaces > distance_to_end ? distance_to_end : spaces //NEW
    @current_player.move(movement) //UPDATED
    update_current_player
  end

```
Now if the player rolls more spaces than the distance to the end, they only move the distance to the end and no further.

This is all very well... but we haven't taken into account what happens if a player lands on a snake or a ladder!

If a player lands on square 2

```
#game_spec
  def test_can_take_turn_with_ladder
    @game.next_turn(2)
    assert_equal(@player2,@game.current_player)
    assert_equal(6,@player1.position)
  end
```
Oh no! Broken test, sad. Let's go fix it. Luckily, we have our board state. We can lookup the tile that the player has landed on after their movement, and applier the modifier we assigned it. So if the player lands on tile 2, we add 4. If they land on 7, we deduct 7.

```
#game
  def next_turn(spaces)
    distance_to_end = @board.win_tile - @current_player.position 
    movement = spaces > distance_to_end ? distance_to_end : spaces
    @current_player.move(movement)
    
    modifier = @board.state[@current_player.position] //NEW
    @current_player.move(modifier) //NEW
    update_current_player
  end
```
Hurrah! Passing test, good times. Let's write a similar test for snakes.

```
#game_spec
 def test_can_take_turn_with_snake
    @game.next_turn(7)
    assert_equal(@player2,@game.current_player)
    assert_equal(0,@player1.position)
  end
```
Awesome, it automatically passes because we are amazing.

Now is a good time to run all of our other tests and make sure they are still passing. It's going to be tedious writing ruby/filname for every test, so I'm going to hand out something to make it easier.

[i:] Hand out run_specs.sh

Place this guy in the folder above specs. It will will run every test inside a folder called specs. We can use it with ``` bash run_specs.sh ```
Great stuff, all of our tests are still passing. Happy days.

Our game is really starting to take shape. Now we need a way to check if the game is won. We know the game is won if a player's position is equal to the end tile. We are going to keep it simple - if anyone moves and has a position greater or equal to the end tile they win the game.

We probably want an instance method to hold the winner.

```
#game_spec
def test_winner_starts_as_nil
    assert_equal(nil,@game.winner)
end
```
Let's go add the code.

```
#game
attr_reader :current_player, :winner //UPDATE

  def initialize(player1, player2, board)
    @players = [player1, player2]
    @current_player = player1
    @board = board
    @winner = nil; //UPDATE
  end
```
Next we want a way to check if the game is won.

```
#game_spec
  def test_game_is_won
    @game.next_turn(8)
    assert_equal(true,@game.is_won?)
  end
```
Now we need to write the code to pass it. We need to loop over the players, and check if any of them have a position equal to the end tile. If they do, set the winner and return true. Otherwise, return false.

```
#game
def is_won?
    for player in @players
      @winner = player if player.position == @board.win_tile
    end
    return @winner.nil? ? false : true
  end
```
Hurrah! We can now detect if a game has been won. Lastly, we want to make sure that no more turns can be taken after the game has been won.

```
#game_spec
def test_no_next_turn_on_win
    @game.next_turn(8)
    assert_equal(true,@game.is_won?)

    @game.next_turn(2)
    assert_equal(0,@player2.position)
  end
```
This will fail, let's go add the check.

```
#game
def next_turn(spaces)
    return if(is_won?) //NEW
    distance_to_end = @board.win_tile - @current_player.position 
    movement = spaces > distance_to_end ? distance_to_end : spaces
    @current_player.move(movement) 
    
    modifier = @board.state[@current_player.position]
    @current_player.move(modifier)
    update_current_player
  end
```

# Outputting to the screen

We are going to want to use the result of the turns to display updates to the user. In our case, we are going to print the info to the terminal. We need a way to do this that will not litter our code with puts statements.

The first thing we need to do is add a log to our game. This will keep track of what happens every turn. We will need the player's name, the roll they make and the modifier for the tile they landed on. Sounds like we need a new class! As always, let's write the test first.

```
touch turn_log_specs.rb

#turn_log_specs
require 'minitest/autorun'
require_relative('../turn_log')

class TestTurnLog < Minitest::Test

  def setup
    @turn_log1 = TurnLog.new("Valerie", 7, -7)
  end

end

```

## Constructor params

Cool so we have made our constructor. However, it's quite confusing having 7 and minus 7 there, since we don't clearly see which one is the roll and which one is the modifier. We need to remember the order which is a bit annoying.

There is actually another way we can initialize our object and it's a very common pattern in Ruby. We also see this with named parameters in C#.

```
#test_log_spec
 def setup
    @turn_log1 = TurnLog.new(player: "Valerie", roll: 7, modifier: -7)
    @turn_log2 = TurnLog.new(player: "Rick", roll:2, modifier:4)
    @turn_log3 = TurnLog.new(player: "Valerie", roll:1, modifier:0)
  end
```
Now we have one parameter, and it's a hash. If this is the only parameter, we can leave off the square brackets. This means the order is no longer important and we can pass them in however we like.

Let's go make the class. It's very common to call a Hash like this "params".

```
touch test_log.rb

#turn_log
class TurnLog
  def initialize(params)
	
  end
end
```
Cool, lets now get the properties out of the hash.

```
#turn_log_spec
def test_has_player
    assert_equal("Valerie",@turn_log1.player)
  end
```
Let's make it pass.
```
 attr_reader :player //NEW
 
 def initialize(params)
    @player = params[:player] //NEW
  end
```
Again for the other two properties. Modifier:

```
#turn_log_spec.rb
def test_has_modifier
    assert_equal(-7,@turn_log1.modifier)
  end
  
#turn_log
attr_reader :player, :modifier //UPDATED

  def initialize(params)
    @player = params[:player]
    @modifier = params[:modifier] //NEW
  end

```
Finally roll.

```
#turn_log_spec
 def test_has_roll
    assert_equal(7,@turn_log1.roll)
  end
  
#turn_log
attr_reader :player, :roll, :modifier

  def initialize(params)
    @player = params[:player]
    @roll = params[:roll]
    @modifier = params[:modifier]
  end

```
Cool, these are all passing. Lastly, we need to return the type of the modifier. Zero is a normal tile, greater than 0 is a ladder and less than zero is a snake.

```
#turn_log_spec
 def test_has_snake_modifier_type
    assert_equal(:snake,@turn_log1.modifier_type)
  end

#turn_log
 def modifier_type
    result = :space
 
    result = :ladder if @modifier > 0
    result = :snake if @modifier < 0
    
    return result
  end
```

We are using a symbol since its a type of thing. A snake will always be snake, we don't want to change it so we might as well use a symbol.

Let's now test a ladder modifier.

```

  def test_has_ladder_modifier_type
    assert_equal(:ladder,@turn_log2.modifier_type)
  end
```
Whoot! Free passing test. Lastly a normal tile.

```
  def test_has_space_modifier_type
    assert_equal(:space,@turn_log3.modifier_type)
  end
```
Amazing! Now we need to actually add a log entry from our game.

```
#game_spec
def test_adds_turn_to_log
    @game.next_turn(1)
    assert_equal(1,@game.log.size)
    assert_equal("Val",@game.log[0].player.name)
    assert_equal(1,@game.log[0].roll)
    assert_equal(0,@game.log[0].modifier)
end
```

Let's go add the code - we need to make sure to require the turn_log.rb file so that we can create and add to one within our game turn.

```
#game
require_relative './turn_log' //NEW

attr_reader :current_player, :winner, :log //UPDATE

  def initialize(players, board)
    @players = players
    @board = board
    @current_player = players[0]
    @winner
    @log = [] //UPDATE
  end
  
  def next_turn(spaces)
    return if(is_won?)
    distance_to_end = @board.win_tile - @current_player.position
    movement = spaces > distance_to_end ? distance_to_end : spaces
    @current_player.move(movement)

    modifier = @board.state[@current_player.position]
    @current_player.move(modifier)

    log << TurnLog.new(player: @current_player, roll: spaces, modifier: modifier) //UPDATE

    update_current_player
  end
```
Whoot! Now are in a position to actually run our game. First, we will run a series of tests to see if the game state is what we expect it to be. This is more of an "integration test" than a unit test.

# Running the game - test

Awesome! So now... we actually have a working game! We just need some way to run it. We can write a series of tests that checks that the state of the board is what we expect it to be.

The setup will be very similar to the game spec.

```
touch specs/game_play_spec.rb

#game_play_spec
require 'minitest/autorun'
require_relative '../game'
require_relative '../player'
require_relative '../board'

class TestGamePlay < Minitest::Test
def setup
    positions = {
     2 => 4,
     7 => -7,
   }

   board = Board.new(9, positions)

   @player1 = Player.new("Val")
   @player2 = Player.new("Rick")

   players = [@player1, @player2]

   @game = Game.new(players, board)
  end
end
```

First we want to test a simple win - no snakes and ladders are hit.

```
#game_play_spec
def test_simple_win

    @game.next_turn(6)
    assert_equal(6,@player1.position)

    @game.next_turn(1)
    assert_equal(1,@player2.position)

    @game.next_turn(2)
    assert_equal(8,@player1.position)
    
    assert_equal(true, @game.is_won?)
    assert_equal(@player1, @game.winner)

  end
```
Great, this does exactly what we think it should.

Let's now test a win where a player hits a snake.

```
#game_play_spec
def test_game_snake_win

    @game.next_turn(6)
    assert_equal(6,@player1.position)

    @game.next_turn(6)
    assert_equal(6,@player2.position)

    @game.next_turn(1)
    assert_equal(0,@player1.position)

    @game.next_turn(2)
    assert_equal(8,@player2.position)

    assert_equal(true, @game.is_won?)
    assert_equal(@player2, @game.winner)

  end
```
Lastly let's test a game where a player hits a ladder.

```
def test_ladder_win
 @game.next_turn(2)
    assert_equal(6,@player1.position)

    @game.next_turn(1)
    assert_equal(1,@player2.position)

    @game.next_turn(2)
    assert_equal(8,@player1.position)

    assert_equal(true, @game.is_won?)
    assert_equal(@player1, @game.winner)
 end
```
Now we can be certain that our game is working as we intended!!! Whoot!!!

# Running the game - for real

Why don't we try running the game with some random moves for the players? Since we have tested an entire game run or two we can be reasonably confident that it should work!

There are a couple of things we need to do to be able to run the game. In our tests, we are passing an integer value to the next turn method. In practice, we want to roll a dice to achieve this.

```
touch dice.rb

#dice.rb
class Dice

  def initialize
    @rolls = (1..4).to_a
  end

  def roll
    return @rolls.sample
  end
  
end
```

Great. Now we need a class that simulates running the game. It will be very similar to before, but with the addition of the dice.

```
touch snakes_and_ladders.rb

#snakes_and_ladders
require_relative 'game'
require_relative 'player'
require_relative 'board'
require_relative 'dice'
require_relative 'viewer'

class SnakeAndLadders

  def initialize(dice)
    @dice = dice

    positions = {
      2 => 4,
      7 => -7,
    }
    board = Board.new(9, positions)

    player1 = Player.new("Val")
    player2 = Player.new("Rick")

    players = [player1,player2]
    @game = Game.new(players,board)
  end
end
```
Great, now we need a way to run it. We will pass in a viewer, which is in charge of displaying all of the data to the screen. Thankfully, we already have a game log!

```
def simulate(viewer)
    while(!@game.is_won?)
      @game.next_turn(@dice.roll)
    end

    viewer.replay(@game.log)
  end
```
We won't unit test this, since it's just manipulating strings. I actually found a use case for the last item in a for loop not getting forgotten about...

```
touch viewer.rb

#viewer
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
```
Lastly, let's add this to the bottom of our runner file.

```
#snakes_and_ladders

game = SnakeAndLadders.new(Dice.new)
game.simulate(Viewer.new)
```
Check it out!!!! Sweeeeeeet!!!!
