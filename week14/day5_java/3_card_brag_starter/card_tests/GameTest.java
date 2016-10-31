import card_game.*;

import static org.junit.Assert.*;
import org.junit.*;

public class GameTest {

  Game game;
  Player player1;
  Player player2;

  @Before
  public void before(){
    game = new Game();
    player1 = new Player("Beth");
    player2 = new Player("Rick");
  }

  @Test
  public void hasDeckOf52(){
    assertEquals(52, game.getDeck().size());
  }

  @Test
  public void canAddPlayer(){
    game.addPlayer(player1);
    assertEquals(1, game.playerCount());
  }

  @Test
  public void dealsCards(){
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.deal();
    assertNotNull(player1.getHand()[0]);
    assertNotNull(player2.getHand()[2]);
  }

}